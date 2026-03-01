// 发布行程表单数据类型
export interface PublicFormData {
  /** 封面图 */
  cover: string
  /** 行程主题 */
  title: string
  /** 行程类型 */
  type: string
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
}
