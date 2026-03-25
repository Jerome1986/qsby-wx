// 分享参数类型
export interface QrScene {
  /** mongoId */
  _id: string
  /** 分享码 */
  sceneCode: string
  /** 分享类型 product 等等 */
  type: string
  /** 用户的邀请码 */
  inviterCode: string
  /** 分享的商品ID */
  productId: string
  /** 分享的商品归属类型 */
  proType: string
  /** 二维码 */
  qrCodeUrl: string
  /** 创建时间 */
  createdAt: Date
}
