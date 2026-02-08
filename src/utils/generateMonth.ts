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
