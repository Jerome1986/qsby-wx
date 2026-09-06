// 云函数路径：/scoreOrder/write
import cloud from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db
// 如现有积分订单接口使用其他集合名，请将环境变量设为相同的集合名。
const scoreOrderDB = db.collection(process.env.SCORE_ORDER_COLLECTION || 'ScoreOrder')
const userDB = db.collection('UserList')
const verifierMobile = '13871388282'

export default async function (ctx: FunctionContext) {
  try {
    const verifyCode = String(ctx.body?.verifyCode ?? '').trim()
    const publicUserId = String(ctx.body?.publicUserId ?? '').trim()

    if (!verifyCode || !/^[a-f\d]{24}$/i.test(publicUserId)) {
      return { code: 400, message: '核销码或核销用户ID不正确' }
    }

    // 沿用现有核销接口参数，手机号从数据库读取。
    const currentUser = await userDB.findOne({
      _id: new ObjectId(publicUserId),
    })

    if (!currentUser) {
      return { code: 403, message: '核销用户不存在' }
    }

    if (currentUser.status && currentUser.status !== 'active') {
      return { code: 403, message: '当前用户状态异常' }
    }

    if (String(currentUser.mobile ?? '').trim() !== verifierMobile) {
      return { code: 403, message: '您无权限核销积分订单' }
    }

    // 只查积分订单，不处理活动或门店订单。
    const orders = await scoreOrderDB.find({ verifyCode }).limit(2).toArray()
    if (orders.length === 0) {
      return { code: 400, message: '积分核销码不存在，请确认订单类型' }
    }
    if (orders.length !== 1) {
      return { code: 400, message: '积分核销码重复，请联系平台处理' }
    }

    const order = orders[0]
    if (order.isVerified || order.status === 'verified') {
      return { code: 400, message: '该积分订单已核销，请勿重复核销' }
    }
    if (order.status !== 'paid') {
      return { code: 400, message: '该积分订单不处于待核销状态' }
    }

    const verifiedTime = new Date()
    // 状态条件和更新在同一操作内完成，并发请求只能核销一次。
    const result = await scoreOrderDB.updateOne(
      { _id: order._id, verifyCode, status: 'paid', isVerified: { $ne: true } },
      {
        $set: {
          status: 'verified',
          isVerified: true,
          verifiedTime,
          verifiedBy: String(currentUser._id),
          updatedAt: verifiedTime,
        },
      },
    )

    if (result.modifiedCount !== 1) {
      return { code: 400, message: '订单已核销或订单状态已发生变化' }
    }

    // 积分、库存已在兑换时处理；核销只确认使用，不重复扣减或返佣。
    return {
      code: 200,
      message: '积分订单核销成功',
      data: {
        orderId: String(order._id),
        out_trade_no: String(order.out_trade_no ?? ''),
        isVerified: true,
        verifiedTime: verifiedTime.toISOString(),
      },
    }
  } catch (error: unknown) {
    console.error('积分订单核销失败', error instanceof Error ? error.message : '未知错误')
    return { code: 500, message: '积分核销失败，请稍后重试' }
  }
}
