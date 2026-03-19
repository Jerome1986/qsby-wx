import type {
  CityItem,
  ProductItem,
  StoreCategoryListPageResult,
  StoreDetail,
  StoreListPageResult,
} from '@/types/store'
import { request } from '@/utils/http'

/**
 * 获取门店分类
 * @param pageNum
 * @param pageSize
 */
export const storeCate = (pageNum: number, pageSize: number) => {
  return request<StoreCategoryListPageResult>({
    method: 'GET',
    url: '/store/cateFindAll',
    data: { pageNum, pageSize },
  })
}

/** 获取所有城市站点 */
export const cityDataApi = () => {
  return request<CityItem[]>({
    method: 'GET',
    url: '/store/cityFindAll',
  })
}

/**
 * 关联获取城市列表
 * @param name - 门店名称
 * @param cityId - 城市ID
 * @param categoryId - 分类ID
 */
export const filterSotreListAll = (
  name: string,
  cityId: string,
  categoryId: string,
  pageNum: number,
  pageSize: number,
) => {
  return request<StoreListPageResult>({
    method: 'GET',
    url: '/store/filterFindAll',
    data: { name, cityId, categoryId, pageNum, pageSize },
  })
}

/**
 * 获取门店详情和门店内的产品
 * @param shopId - 门店ID
 */
export const shopDetailApi = (shopId: string) => {
  return request<StoreDetail>({
    method: 'GET',
    url: '/store/shopDetail',
    data: { shopId },
  })
}

/**
 * 门店商品详情
 * @param productId - 商品ID
 */
export const shopPorductByOne = (productId: string) => {
  return request<ProductItem>({
    method: 'GET',
    url: '/store/productFindOne',
    data: { productId },
  })
}

/**
 *
 * @param userId - 用户ID
 * @param orderId - 业务订单号
 * @param icCardFont - 身份证正面
 * @param icCardBack - 身份证反面
 * @param shopId - 门店ID
 * @returns
 */
export const checkInShopApi = (
  userId: string,
  orderId: string,
  icCardFont: string,
  icCardBack: string,
) => {
  return request({
    method: 'POST',
    url: '/checkIn/updateOrder',
    data: { userId, orderId, icCardFont, icCardBack },
  })
}

/**
 *
 * @param userId - 用户ID
 * @param orderId - 业务订单号
 */
export const checkInInspectApi = (userId: string, orderId: string) => {
  return request<{ isOrder: boolean }>({
    method: 'GET',
    url: '/checkIn/inspect',
    data: { userId, orderId },
  })
}
