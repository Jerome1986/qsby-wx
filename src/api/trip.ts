import { request } from '@/utils/http.ts'
import type { PublicResponse, SubmitFormData, TripTypeItem } from '@/types/Public'

// 获取行程分类
export const tripTypeGetAllApi = () => {
  return request<TripTypeItem[]>({
    method: 'GET',
    url: '/trip/getType',
  })
}

// 发布行程
export const sendTripApi = (data: SubmitFormData) => {
  return request<PublicResponse>({
    method: 'POST',
    url: '/trip/add',
    data,
  })
}
