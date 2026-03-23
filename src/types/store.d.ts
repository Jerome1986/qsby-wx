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
  /** 门店电话 */
  phone: string
  /** 店长手机号码 */
  managerPhone?: string
  /** 纬度 */
  latitude?: number
  /** 经度 */
  longitude?: number
  /** 门店介绍内容ID */
  storeIntroId?: string
  /** 周边推荐内容ID */
  surroundingId?: string
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

/** 产品（住宿：大床房、双床房等，可扩展） */
export interface ProductItem {
  _id: string
  /** 关联门店ID */
  storeId: string
  /** 产品类型ID */
  prodcutTypeId: string
  /** 产品名称，如：大床房、双床房 */
  name: string
  /** 价格 */
  price: number
  /** 主理人佣金/折扣 固定值 */
  commission: number
  /** 封面图 */
  cover?: string
  /** 详情图片 */
  images?: string[]
  /** tag标签 比如房间 有WIFI的说明 */
  tag?: string
  /** 简介 */
  description?: string
  /** 排序 */
  sort?: number
  status?: StoreStatus
  createdAt?: string
  updatedAt?: string
}

/** 门店详情+产品 */
export interface StoreDetail {
  shopInfo: StoreItem
  product: ProductItem[]
}

/** 门店介绍 - 区块类型 */
export type StoreIntroBlockType = 'text' | 'image'

/** 门店介绍 - 单个区块 */
export interface StoreIntroBlock {
  type: StoreIntroBlockType
  /** 文本内容或图片 URL */
  content: string
}

/** 门店介绍扩展数据（按 storeId 存储） */
export interface StoreIntroData {
  _id?: string
  type: 'store-intro'
  storeId: string
  blocks: StoreIntroBlock[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

/** 周边推荐扩展数据（按 storeId 存储，结构同门店介绍） */
export interface StoreSurroundData {
  _id?: string
  type: 'surrounding'
  storeId: string
  blocks: StoreIntroBlock[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

/** 抖音/外部订单办理入住参数（无 orderId） */
export interface CheckInExternalParams {
  userId: string
  shopId: string
  icCardFont: string
  icCardBack: string
  nickname?: string
  phone?: string
  roomNumber: string
  source?: 'douyin' | 'miniprogram' | 'offline'
}

/** 外部入住记录（CheckInExternal 集合文档） */
export interface CheckInExternalItem {
  _id: string
  userId: string
  shopId: string
  icCardFont: string
  icCardBack: string
  nickname?: string
  phone?: string
  roomNumber?: string
  source?: 'douyin' | 'miniprogram' | 'offline'
  createdAt?: Date | string
}

/** 外部入住分页结果 */
export interface CheckInExternalPageResult {
  list: CheckInExternalItem[]
  totalPage: number
}
