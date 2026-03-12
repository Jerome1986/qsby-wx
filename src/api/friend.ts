import type { FriendDetailOrderResult, FriendListPageResult } from '@/types/Friend'
import { request } from '@/utils/http'

/**
 * 好友列表
 * @param userId - 当前用户ID
 * @param pageNum  - 页码
 * @param pageSize - 条数
 */
export const friendListApi = (userId: string, pageNum: number, pageSize: number) => {
  return request<FriendListPageResult>({
    method: 'GET',
    url: '/friend/findAll',
    data: { userId, pageNum, pageSize },
  })
}

/**
 * 好友详情订单
 * @param userId - 用户ID
 * @param time - 时间（年月）
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const friendDetailOrderApi = (
  userId: string,
  time: string,
  pageNum: number,
  pageSize: number,
) => {
  return request<FriendDetailOrderResult>({
    method: 'GET',
    url: '/friend/detial',
    data: { userId, time, pageNum, pageSize },
  })
}
