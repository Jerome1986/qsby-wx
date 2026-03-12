import type { ApplyForCashFormData, WithdrawPageResult } from '@/types/Cash'
import type { OrderPage } from '@/types/OrderItem'
import { request } from '@/utils/http'

/**
 * 获取佣金收入订单列表
 * @param userId - 用户ID
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const incomeListGetApi = (
  userId: string,
  time: string,
  pageNum: number,
  pageSize: number,
) => {
  return request<OrderPage>({
    method: 'GET',
    url: '/cashWithdraw/commissionList',
    data: { userId, time, pageNum, pageSize },
  })
}

/**
 * 用户佣金提现申请
 * @param data
 */
export const cashWithdrawApi = (form: ApplyForCashFormData) => {
  return request({
    method: 'POST',
    url: '/cashWithdraw/add',
    data: { form },
  })
}

interface ApplyFor {
  isApplyFor: boolean
}

/**
 * 查询用户是有提现申请
 * @param userId - 用户ID
 */
export const checkApplyForCash = (userId: string) => {
  return request<ApplyFor>({
    method: 'GET',
    url: '/cashWithdraw/findOne',
    data: { userId },
  })
}

/**
 * 提现记录列表
 * @param userId - 用户ID
 * @param time - 时间段
 * @param pageNum - 页码
 * @param pageSize - 条数
 * @returns
 */
export const cashWithdrawListApi = (
  userId: string,
  time: string,
  pageNum: number,
  pageSize: number,
) => {
  return request<WithdrawPageResult>({
    method: 'GET',
    url: '/cashWithdraw/findListAll',
    data: { userId, time, pageNum, pageSize },
  })
}
