#!/usr/bin/env node

const { spawn } = require('child_process')

const uniBin = require.resolve('@dcloudio/vite-plugin-uni/bin/uni.js')
const env = {
  ...process.env,
  BROWSERSLIST_IGNORE_OLD_DATA: process.env.BROWSERSLIST_IGNORE_OLD_DATA || '1',
  NODE_NO_WARNINGS: process.env.NODE_NO_WARNINGS || '1',
}

const child = spawn(process.execPath, [uniBin, ...process.argv.slice(2)], {
  env,
  stdio: ['inherit', 'pipe', 'pipe'],
})

const createKnownWarningFilter = (target) => {
  let buffer = ''
  let skipBrowserslistLines = 0

  return (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (skipBrowserslistLines > 0) {
        skipBrowserslistLines -= 1
        continue
      }

      if (line.includes('uni-app 有新版本发布')) {
        continue
      }

      if (line.includes('Browserslist: browsers data')) {
        skipBrowserslistLines = 2
        continue
      }

      target.write(`${line}\n`)
    }
  }
}

child.stdout.on('data', createKnownWarningFilter(process.stdout))
child.stderr.on('data', createKnownWarningFilter(process.stderr))

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    child.kill(signal)
  })
}

child.on('close', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code || 0)
})
