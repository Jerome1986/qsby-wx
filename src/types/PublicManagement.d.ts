// 发布管理页面TAB类型，根据该类型请求列表数据
export type PublicType = 'trip' | 'activity' | 'project'
// 发布状态
export type EventStatus = 'pending' | 'active' | 'finished' | 'cancelled'
// 发布行程和活动列表数据类型
export interface EventItem {
  /** mongoId */
  _id: string
  /** 用户Id */
  userId: string
  /** 封面图 */
  cover: string
  /** 行程主题 */
  title: string
  /** 行程类型 */
  type: string
  /** 类型名称 */
  typeName: string
  /** 行程时间 */
  time: string
  /** 行程地点-地图上的商户名 */
  address_name: string
  /** 行程地址-地图上的具体位置 */
  event_address: string
  /** 纬度 */
  latitude: number
  /** 经度 */
  longitude: number
  /** 联系微信 */
  wechat: string
  /** 联系电话 */
  phone: string
  /** 人数限制 */
  maxPeople: string
  /** 男士报名 */
  maleCount: string
  /** 女士报名 */
  femaleCount: string
  /** 用户报名费用 */
  userFee: string
  /** 主理人佣金 */
  commission: string
  /** 行程需求 */
  requirement: string
  /** 内容图片 */
  images: string[]
  /** 行程状态 */
  status: EventStatus
  /** 实际报名总人数 */
  enrollCount: number
  /** 已支付且未退款的累计营收（单位：元） */
  revenue: number
  /** 创建时间 */
  createAt: Date
  /** 更新时间 */
  updateAt: Date
}

// 发布管理页面返回分页类型
export interface PublicManagementPage {
  list: EventItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
