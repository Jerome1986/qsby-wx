import type { UserItem } from "@/types/UserItem";
import { request } from "@/utils/http";

/**
 * 获取用户信息
 * @param userId - 用户ID
 * @returns 
 */
export const userInfoGetApi = (userId: string) => {
  return request<UserItem>({
    method: 'GET',
    url: '/user/byOne',
    data: { userId }
  })
}

