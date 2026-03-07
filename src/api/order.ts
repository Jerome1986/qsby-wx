import type {
  OrderSubmitParams,
  PageOrderStatus,
  PageOrderType,
  OrderPage,
  OrderItem,
  OrderCancelResult,
} from '@/types/OrderItem'
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

/**
 * 待付款订单继续支付（根据订单ID获取支付参数）
 * @param orderId - 订单ID
 * @param openid - 用户微信ID
 */
export const orderPay = (orderId: string, openid: string) => {
  return request<PayResult>({
    method: 'POST',
    url: '/pay/orderPay',
    data: { orderId, openid },
  })
}

/**
 * 订单查询
 * @param orderType - 订单类型
 * @param orderStatus - 订单状态
 * @param openid - 用户微信ID
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const orderFindAll = (
  orderType: PageOrderType,
  orderStatus: PageOrderStatus,
  openid: string,
  pageNum: number,
  pageSize: number,
) => {
  return request<OrderPage>({
    method: 'GET',
    url: '/order/filterOrder',
    data: { orderType, orderStatus, openid, pageNum, pageSize },
  })
}

/**
 * 获取订单详情
 * @param userId - 用户ID
 * @param orderId - 订单ID
 */
export const orderFindOne = (openid: string, orderId: string) => {
  return request<OrderItem>({
    method: 'GET',
    url: '/order/findOne',
    data: { openid, orderId },
  })
}

/**
 * 取消订单（仅待付款订单可取消）
 * @param orderId - 订单ID
 * @param openid - 用户微信ID
 */
export const orderCancel = (orderId: string, openid: string) => {
  return request<OrderCancelResult>({
    method: 'POST',
    url: '/order/cancel',
    data: { orderId, openid },
  })
}
