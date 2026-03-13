import type { UserItem } from '@/types/UserItem'
/** 发布管理 /send/findAll 接口类型 */

/** 发布类型：行程、活动、项目 */
export type SendType = 'trip' | 'activity' | 'project'

/** 发布状态 */
export type SendStatus = 'pending' | 'active' | 'finished'

/**
 * 发布列表项（统一格式）
 * trip/activity 来自 TripList、Activity 表
 * project 来自 ProjectList 表，后端将 viewFee 映射为 userFee，signUpList.length 映射为 revenue
 */
export interface SendListItem {
  _id: string
  userId: string
  cover: string
  title: string
  /** 行程/活动时间，项目无此字段 */
  time?: string
  /** 地点/基地名称 */
  address_name?: string
  /** 详细地址 */
  event_address?: string
  /** 项目兼容：event_address 或 address */
  address?: string
  /** 报名费用/查看费用（项目为 viewFee 映射） */
  userFee?: number
  /** 报名人数（项目为 signUpList.length 映射） */
  revenue?: number
  /** 项目：查看费用（后端可能同时返回） */
  viewFee?: number
  /** 项目：报名人 ID 列表 */
  signUpList?: string[]
  status?: SendStatus
  createAt?: string | Date
  updateAt?: string | Date
  [key: string]: unknown
}

/** /send/findAll 分页返回 */
export interface SendListPage {
  list: SendListItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

export interface SignUpListPage {
  list: UserItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
