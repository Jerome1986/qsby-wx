export interface ScoreProduct {
  /** mongoId */
  _id: string
  /** 商品名称 */
  name: string
  /** 封面图 */
  cover: string
  /** 详情图 */
  images: string[]
  /** 分类ID */
  category: string
  /** 分类名称 */
  categoryName: string
  /** 积分价格 */
  scorePrice: number
  /** 商品状态 */
  status: 'active' | 'disabled'
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

export interface ScoreProductPage {
  /** 商品列表 */
  list: ScoreProduct[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}

// 订单状态
// pending: 待支付, paid: 已支付（待核销）, verified: 已核销（已完成）, cancelled: 已取消, refunding: 退款中, refunded: 已退款
export type OrderStatus = 'paid' | 'verified'

// 积分订单
export interface ScoreOrder {
  /** 订单唯一标识 ID (MongoDB ObjectId) */
  _id: string
  /** 商户订单号 (外部交易号) */
  out_trade_no: string
  /** 用户微信开放平台唯一标识 */
  openid: string
  /** 商品名称 */
  productName: string
  /** 商品封面图片 URL */
  productCover: string
  /** 支付所需积分 */
  payScore: number
  /** 订单状态 (paid: 已支付, unpaid: 未支付, cancelled: 已取消 等) */
  status: OrderStatus
  /** 核销码 (支付成功后生成的验证码，未生成时为空字符串) */
  verifyCode: string
  /** 订单创建时间 (ISO 8601 格式) */
  createdAt: string
  /** 订单更新时间 (ISO 8601 格式) */
  updatedAt: string
}

export interface ScoreOrderPage {
  /** 商品列表 */
  list: ScoreOrder[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}
