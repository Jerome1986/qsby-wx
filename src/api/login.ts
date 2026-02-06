import { request } from '@/utils/http.ts'
import type { UserItem } from '@/types/UserItem'

/**
 * 微信手机号登录
 * @param code
 * @param encryptedData
 * @param iv
 * @param inviterCode  - 用户邀请码
 */
export const wxLogin = (code: string, encryptedData: string, iv: string, inviterCode: string) => {
  return request<UserItem>({
    method: 'POST',
    url: '/wx/login',
    data: { code, encryptedData, iv, inviterCode },
  })
}
