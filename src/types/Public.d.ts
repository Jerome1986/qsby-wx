import type { EventItem } from '@/types/PublicManagement'
// 发布行程表单和发布活动表单数据类型 (共用)
export type PublicFormData = Partial<EventItem>

// 提交表单数据类型
export interface SubmitFormData extends PublicFormData {
  userId: string
}

// 分类类型
export interface BaseTypeItem {
  /** mongoDB id */
  _id: string
  /** 分类名称 */
  name: string
  /** 排序 */
  sort?: number
  /** 创建时间 */
  createdAt?: Date
  /** 更新时间 */
  updatedAt?: Date
}

export interface TripTypeItem extends BaseTypeItem {}
export interface ActivityTypeItem extends BaseTypeItem {}

// 发布行程状态类型
export type PublicStatus = 'pending' | 'active' | 'finished'

// 发布行程接口返回类型
export interface PublicTripResponse {
  tripId: string
  status: PublicStatus
}

// 发布活动接口返回类型
export interface PublicActivityResponse {
  activityId: string
  status: PublicStatus
}
