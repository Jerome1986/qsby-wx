import type { EventItem } from '@/types/PublicManagement'
// 发布行程表单和发布活动表单数据类型 (共用)
export type PublicFormData = Partial<EventItem>

// 提交表单数据类型
export interface SubmitFormData extends PublicFormData {
  userId: string
}

// 行程分类类型
export interface TripTypeItem {
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

// 发布行程状态类型
export type PublicStatus = 'pending' | 'active' | 'finished' | 'cancelled'

// 发布接口返回类型
export interface PublicResponse {
  tripId: string
  status: PublicStatus
}
