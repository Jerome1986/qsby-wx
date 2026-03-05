// 订单类型
export type OrderType = 'play' | 'activity' | 'projuect' | 'shop' | 'score'

// 订单状态
// pending: 待支付, paid: 已支付（待核销）, verified: 已核销（已完成）, cancelled: 已取消, refunding: 退款中, refunded: 已退款
export type OrderStatus = 'pending' | 'paid' | 'verified' | 'cancelled' | 'refunding' | 'refunded'

// 订单支付方式
export type OrderPaymentMethod = 'wechat' | 'alipay' | 'bank'

// 报名人信息
export interface OrderUserInfo {
  /** 昵称 */
  nickname: string
  /** 性别 */
  gender: string | number
  /** 手机号 */
  phone: string
  /** 真实姓名 */
  realName?: string
  /** 身份证号 */
  idCard?: string
}

// 抵扣类型
export type DiscountType = 'none' | 'voucher' | 'commission'

// 订单提交参数
export interface OrderSubmitParams {
  /** 微信用户唯一标识 */
  openid: string
  /** 订单类型 */
  orderType: OrderType
  /** 产品ID */
  productId: string
  /** 报名人信息 */
  userInfo: OrderUserInfo
  /** 原价 */
  totalAmount: number
  /** 主理人佣金/折扣 */
  commission: number
  /** 抵扣金额 */
  discountAmount: number
  /** 抵扣类型 */
  discountType: DiscountType
  /** 实际支付金额 */
  payAmount: number
  /** 订单描述 */
  description: string
}
