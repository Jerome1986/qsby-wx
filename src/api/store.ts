import type { CityItem, StoreCategoryListPageResult, StoreListPageResult } from '@/types/store'
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
