import type { ApplyForCashFormData, WithdrawPageResult } from '@/types/Cash'
import type { BalanceFlowPage, UserBalanceFlow } from '@/types/UserBalanceFlow'
import { request } from '@/utils/http'

export type WalletIncomeBusinessType = Extract<UserBalanceFlow['business_type'], 'commission' | 'activity'>

/**
 * 获取钱包收入流水列表
 * @param userId - 用户ID
 * @param time - 时间段
 * @param businessType - 收入类型 commission=佣金收入 activity=活动收入
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const incomeFlowListGetApi = (
  userId: string,
  time: string,
  businessType: WalletIncomeBusinessType,
  pageNum: number,
  pageSize: number,
) => {
  return request<BalanceFlowPage>({
    method: 'GET',
    url: '/cashWithdraw/commissionList',
    data: { userId, time, business_type: businessType, pageNum, pageSize },
  })
}

/**
 * 获取佣金收入流水列表
 * @param userId - 用户ID
 * @param time - 时间段
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const commissionIncomeListGetApi = (
  userId: string,
  time: string,
  pageNum: number,
  pageSize: number,
) => {
  return incomeFlowListGetApi(userId, time, 'commission', pageNum, pageSize)
}

export const incomeListGetApi = commissionIncomeListGetApi

/**
 * 获取活动收入流水列表
 * @param userId - 用户ID
 * @param time - 时间段
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const activityIncomeListGetApi = (
  userId: string,
  time: string,
  pageNum: number,
  pageSize: number,
) => {
  return incomeFlowListGetApi(userId, time, 'activity', pageNum, pageSize)
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
