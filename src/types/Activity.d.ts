import type { EventItem } from '@/types/PublicManagement'

// 趣哪游页面返回类型
export type ActivityListItem = Partial<EventItem>

// 分页返回
export interface ActivityPageResponse {
  list: ActivityListItem[]
  pageNum: number
  pageSize: number
  totalPage: number
}
