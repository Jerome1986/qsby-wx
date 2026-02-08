// 用户基础信息
export interface UserItem {
  /** mongoId */
  _id: string
  /** 微信用户唯一标识 */
  openid: string
  /** 用户手机号（微信授权获取） */
  mobile: string
  /** 用户昵称 */
  nickname: string
  /** 用户头像地址 */
  avatarUrl: string
  /** 性别：0-未知 1-男 2-女 */
  gender: number
  /** 年龄 */
  age: string
  /** 用户角色：user 普通用户 / admin 管理员 / manager 主理人 等 */
  role: 'user' | 'admin' | 'manager'
  /** 注册时间 */
  registerTime: Date
  /** 主理人开始时间 */
  managerStartTime?: Date
  /** 主理人到期时间 */
  managerEndTime?: Date
  /** 用户状态：active 正常 / disabled 禁用 */
  status: 'active' | 'disabled'
  /** 用户自己的邀请码 */
  referralCode: string
  /** 上级邀请人的邀请码 */
  inviterCode?: string
  /** 好友邀请二维码链接 */
  myCodeUrl: string
  /** 平台积分 */
  score: number
  /** 待结算余额（单位：分） */
  balance: number
  /** 用户更新头像的次数，超过1天后会重置 */
  avatarUpdateCount?: number
  /** 更新头像的时间 */
  avatarUpdateAt?: Date
}

//用户更换头像返回类型
export interface ChangerAvatarResult {
  avatarUrl: string
}
