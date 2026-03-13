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

/** 将各种格式转为可解析的时间戳/字符串，供 Date 解析 */
export function normalizeTimestamp(val: unknown): string | number | Date | null {
  if (val == null) return null
  if (val instanceof Date) return val
  // MongoDB Extended JSON: { $date: "2026-03-10T15:53:45.123Z" } 或 { $date: { $numberLong: "1739050000000" } }
  if (typeof val === 'object' && val !== null && '$date' in val) {
    const d = (val as { $date: string | { $numberLong: string } }).$date
    if (typeof d === 'string') return d
    if (typeof d === 'object' && d !== null && '$numberLong' in d) {
      return Number((d as { $numberLong: string }).$numberLong)
    }
  }
  if (typeof val === 'number') {
    // 秒级时间戳（10 位）转毫秒
    if (val < 1e12 && val > 0) return val * 1000
    return val
  }
  if (typeof val === 'string') return val
  return null
}

export function formatTimestamp(
  timestamp: number | string | Date | unknown,
  type: DateFormatType = 1,
): string {
  const normalized = normalizeTimestamp(timestamp)
  if (normalized == null) return ''
  const date = normalized instanceof Date ? normalized : new Date(normalized)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())

  if (type === 1) return `${year}-${month}-${day}`
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
