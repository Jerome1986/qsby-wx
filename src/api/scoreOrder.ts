import type { ScoreWriteResult } from '@/types/Score'
import { request } from '@/utils/http'

/** 积分订单独立核销，权限由服务端验证。 */
export const writeScoreOrder = (verifyCode: string, publicUserId: string) => {
  return request<ScoreWriteResult>({
    method: 'POST',
    url: '/scoreOrder/write',
    data: { verifyCode, publicUserId },
  })
}
