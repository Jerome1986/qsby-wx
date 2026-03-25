import { request } from '@/utils/http'

export interface groupCodeData {
  _id: string
  qrImage: string
  remark: string
  createdAt: Date
  updatedAt: Date
}

/** 群聊二维码列表（findAll） */
export const groupCodeFindApi = () => {
  return request<groupCodeData[]>({
    method: 'GET',
    url: '/groupChat/findAll',
  })
}
