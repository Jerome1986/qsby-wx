import { formatTimestamp } from './generateMonth'

const flowStatusMap: Record<string, string> = {
  pending: '处理中',
  success: '成功',
  failed: '失败',
}

/** 按点路径取值，支持嵌套如 productInfo.title */
export const getByPath = (obj: any, path: string) => path.split('.').reduce((o, k) => o?.[k], obj)

/** 格式化字段展示值，时间字段使用 formatTimestamp */
export const formatFieldValue = (field: { key: string }, item: any) => {
  const val = getByPath(item, field.key)
  if ((field.key === 'createdAt' || field.key === 'created_at') && val) return formatTimestamp(val, 2)
  if (field.key === 'status' && val) return flowStatusMap[String(val)] ?? val
  return val ?? ''
}
