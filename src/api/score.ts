import type { ScoreProduct, ScoreProductPage } from '@/types/Score'
import { request } from '@/utils/http'

/**
 * 积分商品获取
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const scoreProductGetApi = (pageNum: number, pageSize: number) => {
  return request<ScoreProductPage>({
    method: 'GET',
    url: '/scoreProduct/findAll',
    data: { pageNum, pageSize },
  })
}

/**
 * 获取商品详情
 * @param productId - 商品ID
 */
export const scoreProductFindOneApi = (productId: string) => {
  return request<ScoreProduct[]>({
    method: 'GET',
    url: '/scoreProduct/findOne',
    data: { productId },
  })
}
