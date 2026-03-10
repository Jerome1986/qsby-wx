import type { FriendListPageResult } from '@/types/Friend'
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
