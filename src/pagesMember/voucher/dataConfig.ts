import { ref } from 'vue'

// 代金券订单明细类型
interface VoucherOrderItem {
  amount: string
  orderTime: string
  productName: string
  orderNo: string
  [key: string]: string // 索引签名，允许用字符串索引
}

// 定义字段配置
export const fields: { label: string; key: keyof VoucherOrderItem }[] = [
  { label: '产品金额', key: 'amount' },
  { label: '下单时间', key: 'orderTime' },
  { label: '产品名称', key: 'productName' },
  { label: '订单编号', key: 'orderNo' },
]

// 模拟代金券订单数据
export const listData = ref<VoucherOrderItem[]>([
  {
    amount: '4950.00',
    orderTime: '2025-11-27  17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
  },
  {
    amount: '420.00',
    orderTime: '2025-11-27  17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
  },
  {
    amount: '385.00',
    orderTime: '2025-11-27  17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
  },
  {
    amount: '4950.00',
    orderTime: '2025-11-27  17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
  },
  {
    amount: '420.00',
    orderTime: '2025-11-27  17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
  },
  {
    amount: '385.00',
    orderTime: '2025-11-27  17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
  },
])
