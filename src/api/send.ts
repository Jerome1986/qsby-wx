import { request } from '@/utils/http'
import type { SendListPage, SendType, SignUpListPage } from '@/types/Send'

/**
 * 获取发布列表（支持切换 trip/activity/project）
 * @param userId - 用户ID
 * @param publicType - 类型：trip-趣哪游 | activity-同城活动 | project-有趣的项目
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const sendFindAll = (
  userId: string,
  publicType: SendType,
  pageNum: number,
  pageSize: number,
) => {
  return request<SendListPage>({
    method: 'GET',
    url: '/send/findAll',
    data: { userId, publicType, pageNum, pageSize },
  })
}

/**
 * 获取报名人数
 * @param productId  - 产品ID
 * @param publicType - 产品类型
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const signUpFindAllApi = (
  productId: string,
  publicType: SendType,
  pageNum: number,
  pageSize: number,
) => {
  return request<SignUpListPage>({
    method: 'GET',
    url: '/send/findSignUp',
    data: { productId, publicType, pageNum, pageSize },
  })
}
