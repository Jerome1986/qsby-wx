import type { OrderPage } from '@/types/OrderItem'
import type { VoucherBill } from '@/types/UserBalanceFlow'
import { request } from '@/utils/http'

/**
 * 根据用户筛选半年代金券流水明细
 * @param userId - 用户ID
 */
export const filterVoucherFlow = (userId: string) => {
  return request<VoucherBill[]>({
    method: 'GET',
    url: '/voucher/filterFlow',
    data: { userId },
  })
}

/**
 * 根据用户id和年月获取代金券已核销订单列表
 * @param userId - 用户ID
 * @param time - 年月时间
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const voucherOrderListGet = (
  userId: string,
  time: string,
  pageNum: number,
  pageSize: number,
) => {
  return request<OrderPage>({
    method: 'GET',
    url: '/order/filterTime',
    data: { userId, time, pageNum, pageSize },
  })
}
