const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const source = fs.readFileSync(`${__dirname}/write.ts`, 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const userId = '123456789012345678901234'

function setup({ mobile = '13871388282', status = 'paid', count = 1, userStatus = 'active' } = {}) {
  const order = { _id: 'order1', verifyCode: 'ABC123', status, out_trade_no: 'SCORE001' }
  let writes = 0
  const score = {
    find: ({ verifyCode }) => ({
      limit: () => ({ toArray: async () => verifyCode === order.verifyCode
        ? Array.from({ length: count }, () => ({ ...order })) : [] }),
    }),
    updateOne: async (filter, update) => {
      assert.equal(filter.status, 'paid')
      assert.deepEqual(JSON.parse(JSON.stringify(filter.isVerified)), { $ne: true })
      if (order.status !== filter.status || order.isVerified) return { modifiedCount: 0 }
      writes++
      Object.assign(order, update.$set)
      return { modifiedCount: 1 }
    },
  }
  const user = { findOne: async () => ({ _id: userId, mobile, status: userStatus }) }
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, console, process: { env: {} },
    require: (name) => {
      if (name === '@lafjs/cloud') return { default: { mongo: { db: {
        collection: (name) => {
          if (name === 'ScoreOrder') return score
          assert.equal(name, 'UserList')
          return user
        },
      } } } }
      if (name === 'mongodb') return { ObjectId: class { constructor(id) { this.id = id } } }
      throw new Error(`Unexpected dependency: ${name}`)
    },
  })
  return {
    run: (body = {}) => exports.default({ body: { verifyCode: 'ABC123', publicUserId: userId, ...body } }),
    order,
    writes: () => writes,
  }
}

;(async () => {
  const normal = setup()
  assert.equal((await normal.run()).code, 200)
  assert.equal(normal.order.verifiedBy, userId)
  assert.equal((await normal.run()).code, 400)
  assert.equal(normal.writes(), 1)
  for (const options of [{ mobile: '13900000000' }, { userStatus: 'disabled' }]) {
    const denied = setup(options)
    assert.equal((await denied.run()).code, 403)
    assert.equal(denied.writes(), 0)
  }
  for (const options of [{ status: 'pending' }, { status: 'refunded' }, { count: 0 }, { count: 2 }]) {
    const invalid = setup(options)
    assert.equal((await invalid.run()).code, 400)
    assert.equal(invalid.writes(), 0)
  }
  assert.equal((await setup().run({ publicUserId: 'invalid' })).code, 400)
  assert.equal((await setup().run({ verifyCode: '' })).code, 400)
  const concurrent = setup()
  const results = await Promise.all([concurrent.run(), concurrent.run()])
  assert.deepEqual(results.map((result) => result.code).sort(), [200, 400])
  assert.equal(concurrent.writes(), 1)
  console.log('PASS: permission, invalid input, order states, duplicate codes, repeat and concurrent verification')
})().catch((error) => { console.error(error); process.exitCode = 1 })
