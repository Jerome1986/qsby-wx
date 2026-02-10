import { ref } from 'vue'

// 收入记录类型
interface ConsumptionItem {
  buyerName: string
  amount: string
  orderTime: string
  productName: string
  orderNo: string
  commission: string
  [key: string]: string // 索引签名，允许用字符串索引
}

// 定义字段配置
export const fields: { label: string; key: keyof ConsumptionItem }[] = [
  { label: '购买人', key: 'buyerName' },
  { label: '产品金额', key: 'amount' },
  { label: '下单时间', key: 'orderTime' },
  { label: '产品名称', key: 'productName' },
  { label: '订单编号', key: 'orderNo' },
  { label: '产品佣金', key: 'commission' },
]

// 列表数据（后期从接口获取）
export const listData = ref<ConsumptionItem[]>([
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  // ... 更多数据
])
