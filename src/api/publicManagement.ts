import { request } from '@/utils/http.ts'
import type { PublicManagementPage, PublicType } from '@/types/PublicManagement'

/**
 * 根据当前用户获取发布列表
 * @param userId - 用户ID
 * @param publicType - 发布的类型 'trip' | 'activity' | 'project'  行程、活动、项目
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const publicListGetAll = (
  userId: string,
  publicType: PublicType,
  pageNum: number,
  pageSize: number,
) => {
  return request<PublicManagementPage>({
    method: 'GET',
    url: '/publishManagement/findAll',
    data: { userId, publicType, pageNum, pageSize },
  })
}

export const testApi = () => {
  return request({
    method: 'GET',
    url: 'http://localhost/mp.php/plays/getEventList',
    header: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}
