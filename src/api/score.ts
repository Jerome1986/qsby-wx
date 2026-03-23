import type { ScoreProduct, ScoreProductPage } from '@/types/Score'
import { request } from '@/utils/http'

/** 积分流水列表项（收入/支出展示结构） */
export interface ScoreFlowListItem {
  [key: string]: string
}

/** 积分流水分页结果 */
export interface ScoreFlowPageResult {
  list: ScoreFlowListItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/**
 * 积分流水列表（按收入/支出、月份分页）
 * @param tabType - income | expense
 * @param time - 月份 "YYYY-MM"
 * @param userId - 用户ID
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const scoreFlowFindAll = (
  tabType: string,
  time: string,
  userId: string,
  pageNum: number,
  pageSize: number,
) => {
  return request<ScoreFlowPageResult>({
    method: 'GET',
    url: '/scoreFlow/findAll',
    data: { tabType, time, userId, pageNum, pageSize },
  })
}

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
