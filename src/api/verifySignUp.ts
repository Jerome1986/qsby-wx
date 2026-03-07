import type { PublicType } from '@/types/PublicManagement'
import { request } from '@/utils/http'

/**
 * 该页面接口为公共报名验证接口
 */

// 返回类型
interface verifyResult {
  isSignUp: boolean
}

/**
 * 报名验证接口
 * @param queryType - 验证类型
 * @param targetId  - 行程/活动/项目ID
 * @param userId - 用户ID
 */
export const verifySignUpApi = (queryType: PublicType, targetId: string, userId: string) => {
  return request<verifyResult>({
    method: 'GET',
    url: '/verify/verifySignUp',
    data: { queryType, targetId, userId },
  })
}
