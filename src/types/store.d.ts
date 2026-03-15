/** 门店分类 */
export interface StoreCategoryItem {
  _id: string
  name: string
  sort: number
  status: StoreStatus
  createdAt: Date
  updateAt: Date
}

export interface StoreCategoryListPageResult {
  list: StoreCategoryItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 城市分类 */
export type CityStatus = 'active' | 'disabled'

/** 城市/站点 */
export interface CityItem {
  /** mongoID */
  _id: string
  /** 站点名称 */
  name: string
  /** 城市编码（如行政区划代码） */
  code: string
  /** 状态：启用/禁用 */
  status: CityStatus
  /** 排序，可选 */
  sort?: number
  /** 创建时间 */
  createdAt?: Date | string
  /** 更新时间 */
  updatedAt?: Date | string
}

/** 门店 */
export interface StoreItem {
  _id: string
  /** 站点（城市）ID */
  cityId: string
  /** 站点名称 */
  cityName?: string
  /** 门店分类ID */
  categoryId: string
  /** 门店分类名称 */
  categoryName?: string
  /** 门店封面图 */
  cover: string
  /** 门店名字 */
  name: string
  /** 门店地址 */
  address: string
  /** 纬度 */
  latitude?: number
  /** 经度 */
  longitude?: number
  /** 门店介绍 */
  description: string
  status?: StoreStatus
  createdAt?: string
  updatedAt?: string
}

export interface StoreListPageResult {
  list: StoreItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
