import { formatTimestamp } from './generateMonth'

/** 按点路径取值，支持嵌套如 productInfo.title */
export const getByPath = (obj: any, path: string) => path.split('.').reduce((o, k) => o?.[k], obj)

/** 格式化字段展示值，createdAt 使用 formatTimestamp */
export const formatFieldValue = (field: { key: string }, item: any) => {
  const val = getByPath(item, field.key)
  if (field.key === 'createdAt' && val) return formatTimestamp(val, 2)
  return val ?? ''
}
