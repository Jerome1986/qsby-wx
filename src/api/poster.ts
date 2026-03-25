import type { QrScene } from '@/types/Share'
import { request } from '@/utils/http'

/**
 * 获取分享二维码
 * @param referralCode - 当前用户的邀请码
 * @param productId - 商品ID
 * @param proType - 页面商品类型 trip activity
 */
export const posterCodeApi = (referralCode: string, productId: string, proType: string) => {
  return request<{ qrCodeUrl: string }>({
    method: 'GET',
    url: '/share/qrcode',
    data: { referralCode, productId, proType },
  })
}

/**
 * 根据分享码获取分享参数
 * @param scene - 分享码
 */
export const sceneFindOneApi = (scene: string) => {
  return request<QrScene>({
    method: 'GET',
    url: '/share/sceneFindOne',
    data: { scene },
  })
}
