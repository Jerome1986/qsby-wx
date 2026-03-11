// 代金券订单明细字段配置（key 支持点路径，如 productInfo.address_name）
export const fields: { label: string; key: string }[] = [
  { label: '产品金额', key: 'discountAmount' },
  { label: '下单时间', key: 'createdAt' },
  { label: '产品名称', key: 'productInfo.address_name' },
  { label: '订单编号', key: 'out_trade_no' },
]
