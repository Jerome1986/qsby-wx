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
  storeId: string
  storeName: string
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
