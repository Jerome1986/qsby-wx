import { ref } from 'vue'

// 收入积分类型
interface ConsumptionIncomeItem {
  buyerName: string
  amount: string
  orderTime: string
  productName: string
  orderNo: string
  score: string
  [key: string]: string // 索引签名，允许用字符串索引
}

// 支出积分类型
interface ConsumptionOutItem {
  orderNo: string
  exchangeTime: string
  exchangeNum: string
  productName: string
  [key: string]: string // 索引签名，允许用字符串索引
}

// 积分订单类型
interface ScoreOrderItem {
  cover: string
  productName: string
  storeName: string
  address: string
  scoreNum: string
  scoreStatus: 'UNUSED' | 'USED'
}

// 定义积分收入字段配置
export const fieldsIncome: { label: string; key: keyof ConsumptionIncomeItem }[] = [
  { label: '购买人', key: 'buyerName' },
  { label: '产品金额', key: 'amount' },
  { label: '下单时间', key: 'orderTime' },
  { label: '产品名称', key: 'productName' },
  { label: '订单编号', key: 'orderNo' },
  { label: '赠送积分', key: 'score' },
]

// 定义积分支出字段配置
export const fieldsOut: { label: string; key: keyof ConsumptionOutItem }[] = [
  { label: '订单编号', key: 'orderNo' },
  { label: '兑换时间', key: 'exchangeTime' },
  { label: '兑换数量', key: 'exchangeNum' },
  { label: '产品名称', key: 'productName' },
]

// 定义积分订单字段配置
export const fieldsScoreOrder: { label: string; key: keyof ScoreOrderItem }[] = [
  { label: '门店', key: 'storeName' },
  { label: '地址', key: 'address' },
  { label: '积分价格', key: 'scoreNum' },
]

// 列表数据（后期从接口获取）-- 收入
export const listDataIncome = ref<ConsumptionIncomeItem[]>([
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    score: '100积分',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    score: '100积分',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    score: '100积分',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    score: '100积分',
  },
  // ... 更多数据
])

// 列表数据（后期从接口获取）-- 收入
export const listDataOut = ref<ConsumptionOutItem[]>([
  {
    orderNo: '79045578151551',
    exchangeTime: '2026-2-08 17:16',
    exchangeNum: '100积分',
    productName: '12.27体验冬日里的庐山2天1晚',
  },
  {
    orderNo: '79045578151551',
    exchangeTime: '2026-2-08 17:16',
    exchangeNum: '100积分',
    productName: '12.27体验冬日里的庐山2天1晚',
  },
  {
    orderNo: '79045578151551',
    exchangeTime: '2026-2-08 17:16',
    exchangeNum: '100积分',
    productName: '12.27体验冬日里的庐山2天1晚',
  },
  {
    orderNo: '79045578151551',
    exchangeTime: '2026-2-08 17:16',
    exchangeNum: '100积分',
    productName: '12.27体验冬日里的庐山2天1晚',
  },
  {
    orderNo: '79045578151551',
    exchangeTime: '2026-2-08 17:16',
    exchangeNum: '100积分',
    productName: '12.27体验冬日里的庐山2天1晚',
  },
  // ... 更多数据
])

// 积分订单列表数据
export const scoreOrderItems = ref<ScoreOrderItem[]>([
  {
    cover: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    productName: '湖景大床房',
    address: '武昌司门口',
    scoreNum: '500积分',
    storeName: '武汉千宿百院',
    scoreStatus: 'USED',
  },
  {
    cover: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    productName: '湖景大床房',
    address: '武昌司门口',
    scoreNum: '500积分',
    storeName: '武汉千宿百院',
    scoreStatus: 'UNUSED',
  },
  {
    cover: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    productName: '湖景大床房',
    address: '武昌司门口',
    scoreNum: '500积分',
    storeName: '武汉千宿百院',
    scoreStatus: 'USED',
  },
  {
    cover: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    productName: '湖景大床房',
    address: '武昌司门口',
    scoreNum: '500积分',
    storeName: '武汉千宿百院',
    scoreStatus: 'USED',
  },
  {
    cover: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    productName: '湖景大床房',
    address: '武昌司门口',
    scoreNum: '500积分',
    storeName: '武汉千宿百院',
    scoreStatus: 'UNUSED',
  },
  {
    cover: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    productName: '湖景大床房',
    address: '武昌司门口',
    scoreNum: '500积分',
    storeName: '武汉千宿百院',
    scoreStatus: 'USED',
  },
])
