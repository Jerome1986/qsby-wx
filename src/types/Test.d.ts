/** 活动内容图片 */
export interface TestEventContentImage {
  /** 图片地址 */
  url: string
  /** 图片大小 */
  size: number
  /** 图片域名 */
  domain: string
  /** 上传状态 */
  status: string
  /** 响应信息 */
  response: string
  /** 文件路径 */
  file_path: string
}
/** 活动地区信息 */
export interface TestEventRegion {
  /** 地区ID */
  id: number
  /** 父级ID */
  pid: number
  /** 地区名称 */
  name: string
  /** 完整名称 */
  full_name: string
  /** 行政区划代码 */
  adcode: string
  /** 首字母 */
  first: string | null
  /** 经度 */
  lng: string
  /** 纬度 */
  lat: string
  /** 状态 */
  status: number
  /** 是否已保存 */
  is_save: number
  /** 层级 */
  level: number
  /** 总人数 */
  total_house: number
}
/** 活动用户信息 */
export interface TestEventUser {
  /** 用户ID */
  id: number
  /** 用户昵称 */
  nickname: string
  /** 用户电话 */
  telphone: string
  /** 用户头像 */
  avatar: string
  /** 微信号 */
  wechat_number: string | null
  /** 是否管理员 */
  is_admin: number
  /** 是否系统用户 */
  is_system: number
}
/** 活动类型声明 */
export interface TestEvent {
  /** 活动ID */
  id: number
  /** 事件类型 */
  event_type: string
  /** 地区ID */
  region_id: number
  /** 会员ID */
  member_id: number
  /** 分组ID */
  group_id: number
  /** 活动名称 */
  event_name: string
  /** 活动图片 */
  event_image: string
  /** 活动日期 */
  event_day: string
  /** 活动时间 */
  event_time: string | null
  /** 活动地址 */
  event_address: string
  /** 地址名称 */
  address_name: string
  /** 是否需要支付 */
  is_needpay: number
  /** 价格 */
  price: string
  /** VIP价格 */
  vip_price: string
  /** 内容图片 */
  content_images: string | TestEventContentImage[]
  /** 活动内容 */
  event_content: string
  /** 是否多人 */
  is_more: number
  /** 最小年龄限制 */
  limit_age: string
  /** 最大年龄限制 */
  max_age: string
  /** 性别限制 */
  is_gender: string
  /** 是否主理人 */
  is_manger: number
  /** 人数限制 */
  num_member: number
  /** 状态 */
  status: number
  /** 状态备注 */
  status_note: string | null
  /** 申请总人数 */
  total_apply: number
  /** 总金额 */
  total_money: string
  /** 纬度 */
  lat: string
  /** 经度 */
  lng: string
  /** 创建时间 */
  createtime: string
  /** 更新时间 */
  updatetime: string
  /** 申请状态 */
  apply_status: number
  /** 微信号 */
  wechat: string
  /** 联系电话 */
  telphone: string
  /** 虚拟男性人数 */
  virtual_men: number
  /** 虚拟女性人数 */
  virtual_female: number
  /** 地区信息 */
  region: TestEventRegion
  /** 用户信息 */
  user: TestEventUser
}
