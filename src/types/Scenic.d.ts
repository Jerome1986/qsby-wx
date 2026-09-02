export interface ScenicDetailBlock {
  type: 'text' | 'image'
  content: string
}

export interface ScenicItem {
  /** mongoId */
  _id: string
  /** 所属门店ID */
  storeId: string
  /** 景区名称 */
  name: string
  /** 景区封面图 */
  cover: string
  /** 景区地址 */
  address: string
  /** 景区标签 */
  tag: string
  /** 距离门店距离 */
  distance: string
  /** 门票价格 */
  price: string
  /** 景区评分 */
  score?: string | number | null
  /** 景区介绍 */
  introduction: string
  /** 景区详情图 */
  images: string[]
  /** 图文混排详情 */
  detailBlocks?: ScenicDetailBlock[]
  createdAt?: string | number
  updatedAt?: string | number
}

export interface ScenicListPageResult {
  list: ScenicItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
