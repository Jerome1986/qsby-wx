// 生成月份选项数据
export const generateMonthOptions = () => {
  const currentYear = new Date().getFullYear()
  const months = []
  for (let month = 1; month <= 12; month++) {
    const monthStr = month < 10 ? `0${month}` : `${month}`
    months.push({
      value: `${currentYear}-${monthStr}`, // 提交接口用的值，如 "2026-02"
      text: `${currentYear}-${monthStr}`, // 显示的文本
    })
  }
  return months
}

// 当前所选择的月份（默认当前月份）
export const getCurrentMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // getMonth() 返回 0-11
  return `${year}-${month < 10 ? '0' + month : month}`
}

// 自定义时间组件的时间显示
// 限制最小时间 = 当前时间
export const minDate = Date.now()

export const displayFormat = (items: any[]) => {
  const year = items[0].label
  const month = items[1].label.padStart(2, '0')
  const day = items[2].label.padStart(2, '0')
  const hour = items[3].label.padStart(2, '0')
  const minute = items[4].label.padStart(2, '0')

  return `${year}年${month}月${day}日 ${hour}:${minute}`
}

// 格式化时间
function padZero(num: number): string {
  return num < 10 ? '0' + num : String(num)
}
type DateFormatType = 1 | 2
export function formatTimestamp(
  timestamp: number | string | Date,
  type: DateFormatType = 1,
): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  // 非法时间戳返回空字符串，避免异常
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1) // 月份是从0开始的，所以需要+1
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())

  // 默认返回年月日
  if (type === 1) return `${year}-${month}-${day}`
  // 如果不是1 就返回到秒
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
