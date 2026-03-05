import type { OrderSubmitParams } from '@/types/OrderItem'
import type { PayResult } from '@/types/Pay'
import { request } from '@/utils/http'

/**
 * 行程订单创建---支付
 * @param params - 订单参数
 */
export const tripOrderAdd = (params: OrderSubmitParams) => {
  return request<PayResult>({
    method: 'POST',
    url: '/pay/tripPay',
    data: params,
  })
}
