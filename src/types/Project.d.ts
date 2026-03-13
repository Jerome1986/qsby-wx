import type { BaseTypeItem } from './Public'

/** 项目分类类型（接口返回） */
export interface ProjectCate {
  typeList: BaseTypeItem[]
  modeList: BaseTypeItem[]
  scaleList: BaseTypeItem[]
}

/** 项目发布状态 */
export type ProjectStatus = 'pending' | 'active' | 'finished'

/** 项目列表项（完整数据） */
export interface ProjectItem {
  /** mongoId */
  _id: string
  /** 用户Id */
  userId: string
  /** 封面图 */
  cover: string
  /** 项目标题 */
  title: string
  /** 行业类别（对应 typeList 的 _id） */
  industry: string
  /** 合作方式（对应 modeList 的 _id） */
  cooperationMode: string
  /** 合作规模（对应 scaleList 的 _id） */
  cooperationScale: string
  /** 行程地点-地图上的商户名 */
  address_name?: string
  /** 行程地址-地图上的具体位置 */
  event_address?: string
  /** 纬度 */
  latitude?: number
  /** 经度 */
  longitude?: number
  /** 项目地址（兼容，可与 event_address 共用） */
  address?: string
  /** 联系微信 */
  wechat: string
  /** 联系电话 */
  phone: string
  /** 项目介绍 */
  introduction: string
  /** 项目图片 */
  images: string[]
  /** 发布状态 */
  status: ProjectStatus
  /** 创建时间 */
  createAt: Date
  /** 更新时间 */
  updateAt: Date
}

/** 发布项目表单数据类型 */
export type ProjectFormData = Partial<ProjectItem>

/** 提交项目表单数据类型（含 userId） */
export interface SubmitProjectFormData extends ProjectFormData {
  userId: string
}

/** 发布项目接口返回类型 */
export interface ProjectSubmitResponse {
  insertedId: string
}

/** 项目列表分页返回类型 */
export interface ProjectListPageResponse {
  list: ProjectItem[]
  pageNum: number
  pageSize: number
  totalPage: number
  total: number
}
