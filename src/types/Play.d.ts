import type { EventItem } from '@/types/PublicManagement'
// 页面排序类型
export type SortType = 'composite' | 'dailyHot' | 'enrolling' | 'startTime'

// 趣哪游页面返回类型
export type PlayListItem = Partial<EventItem>

// 分页返回
export interface PlayListPageResponse {
  list: PlayListItem[]
  pageNum: number
  pageSize: number
  totalPages: number
}
