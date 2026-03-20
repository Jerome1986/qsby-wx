import type {
  OrderSubmitParams,
  PageOrderStatus,
  PageOrderType,
  OrderPage,
  OrderItem,
  OrderCancelResult,
  CreateQrCodeResult,
  CreateOrderFreeResult,
  WriteOrderResult,
} from '@/types/OrderItem'
import type { PayResult } from '@/types/Pay'
import type { UserRole } from '@/types/UserItem'
import { request } from '@/utils/http'

/**
 * 统一下单支付订单创建---支付
 * @param params - 订单参数
 */
export const orderAdd = (params: OrderSubmitParams) => {
  return request<PayResult>({
    method: 'POST',
    url: '/pay/commonPay',
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
 * 按门店查询订单（店长管理门店订单）
 * @param shopId - 门店ID
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const orderFindByShop = (shopId: string, pageNum: number, pageSize: number) => {
  return request<OrderPage>({
    method: 'GET',
    url: '/order/byShop',
    data: { shopId, pageNum, pageSize },
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
 * @param orderId - 订单ID（MongoDB _id）
 */
export const orderFindOne = (orderId: string) => {
  return request<OrderItem>({
    method: 'GET',
    url: '/order/findOne',
    data: { orderId },
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

/**
 * 创建核销码
 * @param orderId - 订单ID
 * @param openid - 用户微信ID
 */
export const createQrCode = (orderId: string, openid: string) => {
  return request<CreateQrCodeResult>({
    method: 'GET',
    url: '/utils/qrcode',
    data: { orderId, openid },
  })
}

/**
 * 当前用户抵扣完支付金额为0时，走下单流程，不用支付
 * @param params - 订单参数
 */
export const createOrderFree = (params: OrderSubmitParams) => {
  return request<CreateOrderFreeResult>({
    method: 'POST',
    url: '/order/createOrderFree',
    data: { params },
  })
}

/**
 * 核销订单
 * @param verifyCode
 */
export const writeOrder = (verifyCode: string, publicUserId: string, role: UserRole) => {
  return request<WriteOrderResult>({
    method: 'POST',
    url: '/order/write',
    data: { verifyCode, publicUserId, role },
  })
}
