import { request } from '@/utils/http.ts'
import type { PublicTripResponse, SubmitFormData, TripTypeItem } from '@/types/Public'
import type { PlayListItem, PlayListPageResponse, SortType } from '@/types/Play'
import type { DelResult } from '@/types/Gobal'

// 获取行程分类
export const tripTypeGetAllApi = () => {
  return request<TripTypeItem[]>({
    method: 'GET',
    url: '/trip/getType',
  })
}

// 发布行程
export const sendTripApi = (data: SubmitFormData) => {
  return request<PublicTripResponse>({
    method: 'POST',
    url: '/trip/add',
    data,
  })
}

/**
 * 趣哪游页面-行程列表获取
 * @param tripTypeId - 行程分类
 * @param sortType - 排序
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const tripListGetAllApi = (
  tripTypeId: string,
  sortType: SortType,
  pageNum: number,
  pageSize: number,
) => {
  return request<PlayListPageResponse>({
    method: 'GET',
    url: '/trip/tripListFindAll',
    data: { tripTypeId, sortType, pageNum, pageSize },
  })
}

/**
 * 根据行程ID获取行程详情
 * @param tripId - 行程ID
 */
export const tripDetailGetApi = (tripId: string) => {
  return request<PlayListItem>({
    method: 'GET',
    url: '/trip/tripListFindDetail',
    data: { tripId },
  })
}

/** 编辑行程（占位） */
export const tripEditApi = (data: SubmitFormData & { _id: string }) => {
  return request<{ code: number; message: string }>({
    method: 'POST',
    url: '/trip/edit',
    data,
  })
}

/**
 * 删除指定行程
 * @param userId - 用户ID
 * @param tripId - 行程ID
 */
export const tripDelApi = (userId: string, tripId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/trip/del',
    data: { userId, tripId },
  })
}
