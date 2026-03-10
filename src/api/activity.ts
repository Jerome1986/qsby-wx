import type { ActivityListItem, ActivityPageResponse } from '@/types/Activity'
import type { SortType } from '@/types/Play'
import type { ActivityTypeItem } from '@/types/Public'
import { request } from '@/utils/http'

/**
 * 获取活动类型
 */
export const activityTypeFindAll = () => {
  return request<ActivityTypeItem[]>({
    method: 'GET',
    url: '/activity/typeFindAll',
  })
}

/**
 * 根据类型获取所有活动列表
 * @param activityTypeId  - 分类ID
 * @param sortType - 排序规则
 * @param pageNum - 页码
 * @param pageSize - 条数
 * @returns
 */
export const activityListFindAll = (
  activityTypeId: string,
  sortType: SortType,
  pageNum: number,
  pageSize: number,
) => {
  return request<ActivityPageResponse>({
    method: 'GET',
    url: '/activity/findAll',
    data: { activityTypeId, sortType, pageNum, pageSize },
  })
}

/**
 * 获取活动详情
 * @param activityId - 活动ID
 */
export const activityDetail = (activityId: string) => {
  return request<ActivityListItem>({
    method: 'GET',
    url: '/activity/detail',
    data: { activityId },
  })
}
