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
  /** 用户角色：user 普通用户 / admin 管理员 / manager 主理人 等 */
  role: 'user' | 'admin' | 'manager'
  /** 注册时间 */
  registerTime: Date
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
}
