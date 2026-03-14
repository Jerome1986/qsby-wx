import type { ActivityListItem, ActivityPageResponse } from '@/types/Activity'
import type { DelResult } from '@/types/Gobal'
import type { SortType } from '@/types/Play'
import type { ActivityTypeItem, PublicActivityResponse, SubmitFormData } from '@/types/Public'
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
 * 发布活动
 * @param data - 表单参数
 */
export const activitySendApi = (data: SubmitFormData) => {
  return request<PublicActivityResponse>({
    method: 'POST',
    url: '/activity/add',
    data,
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

/** 编辑活动 */
export const activityEditApi = (data: SubmitFormData & { _id: string }) => {
  return request<{ code: number; message: string }>({
    method: 'POST',
    url: '/activity/edit',
    data,
  })
}

/**
 * 删除活动
 * @param userId - 用户ID
 * @param activityId - 活动ID
 */
export const activityDelApi = (userId: string, activityId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/activity/del',
    data: { userId, activityId },
  })
}
