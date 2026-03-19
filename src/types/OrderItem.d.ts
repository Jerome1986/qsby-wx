import type { EventItem } from '@/types/PublicManagement'

// 订单类型
export type OrderType = 'trip' | 'activity' | 'project' | 'shop'

// 页面展示订单类型
export type PageOrderType = OrderType | 'all'

// 订单状态
// pending: 待支付, paid: 已支付（待核销）, verified: 已核销（已完成）, cancelled: 已取消, refunding: 退款中, refunded: 已退款
export type OrderStatus = 'pending' | 'paid' | 'verified' | 'cancelled' | 'refunding' | 'refunded'
// 页面展示订单状态类型
export type PageOrderStatus = OrderStatus | 'all'

// 订单支付方式
export type OrderPaymentMethod = 'wechat' | 'alipay' | 'bank'

// 报名人信息
export interface OrderUserInfo {
  /** 用户ID */
  userId: string
  /** 昵称 */
  nickname: string
  /** 性别 */
  gender: string | number
  /** 手机号 */
  phone: string
  /** 真实姓名 */
  realName?: string
  /** 身份证号 */
  icCardFont?: string
  icCardBack?: string
}

// 门店信息
export interface ShopInfo {
  shopId: string
  /** 门店名称 */
  shopName: string
  /** 门店地址 */
  address: string
  /** 门店电话 */
  phone: string
  /** 纬度 */
  latitude?: number
  /** 经度 */
  longitude?: number
}

// 抵扣类型
export type DiscountType = 'cash' | 'voucher' | 'commission' | 'points'

// 订单提交参数
export interface OrderSubmitParams {
  /** 微信用户唯一标识 */
  openid: string
  /** 订单类型 */
  orderType: OrderType
  /** 产品信息嵌套对象 */
  productInfo: ProductInfo
  /** 项目扩展：行业类别名称（仅 orderType === 'project'） */
  industryCategory?: string
  /** 项目扩展：合作方式名称 */
  cooperationMode?: string
  /** 项目扩展：合作规模名称 */
  cooperationScale?: string
  /** 项目扩展：基地/地点名称 */
  baseName?: string
  /** 项目扩展：基地/详细地址 */
  baseAddress?: string
  /** 项目扩展：查看费用（元） */
  viewFee?: number
  /** 报名人信息 */
  userInfo: OrderUserInfo
  /** 发起人信息 */
  initiatorInfo?: InitiatorInfo
  shopInfo?: ShopInfo
  /** 原价 */
  totalAmount: number
  /** 主理人佣金/折扣 */
  commission: number
  /** 抵扣金额 */
  discountAmount: number
  /** 抵扣类型 */
  discountType: DiscountType
  /** 实际支付金额 */
  payAmount: number
  /** 订单描述 */
  description: string
}

// 订单列表
/**
 * 订单主类型
 * 包含订单核心信息、用户信息、金额信息等
 */
export interface OrderItem {
  /** 订单唯一标识（MongoDB ObjectId） */
  _id: string
  /** 业务订单号（外部交易单号，如支付单号） */
  out_trade_no: string
  /** 用户微信开放ID（唯一标识用户） */
  openid: string
  /** 订单类型（play-旅游/activity-活动/project-项目） */
  orderType: OrderType
  /** 产品信息嵌套对象 */
  productInfo: ProductInfo
  /** 用户信息嵌套对象(报名人信息) */
  userInfo: {
    /** 用户对应的ID */
    userId: string
    /** 用户昵称 */
    nickname: string
    /** 性别（1-男/2-女/0-未知） */
    gender: number
    /** 用户手机号（脱敏前） */
    phone: string
  }
  shopInfo?: ShopInfo
  /** 发起人信息 */
  initiatorInfo?: InitiatorInfo
  /** 订单总金额（原价，单位：元） */
  totalAmount: number
  /** 佣金金额（推广返佣，单位：元） */
  commission: number
  /** 优惠金额（抵扣金额，单位：元） */
  discountAmount: number
  /** 优惠类型（'cash' | 'voucher' | 'commission' | 'points'） */
  discountType: DiscountType
  /** 实际支付金额（单位：元，0表示免支付） */
  payAmount: number
  /** 实际支付积分 只用于积分订单 */
  payScore: number
  /** 订单状态（pending-待付款/verifying-待核销/verified-已核销/refunded-退款） */
  status: OrderStatus
  /** 核销码 - 用于记录和手动核销 */
  verifyCode?: string
  /** 是否已核销 */
  isVerified?: boolean
  /** 核销人ID */
  verifiedBy?: string
  /** 核销时间 */
  verifiedTime?: Date
  /** 订单创建时间（ISO格式字符串） */
  createdAt?: string
  /** 订单更新时间（ISO格式字符串，空表示未更新） */
  updatedAt?: string
  /** 项目扩展：行业类别名称（仅 orderType === 'project'） */
  industryCategory?: string
  /** 项目扩展：合作方式名称 */
  cooperationMode?: string
  /** 项目扩展：合作规模名称 */
  cooperationScale?: string
  /** 项目扩展：基地/地点名称 */
  baseName?: string
  /** 项目扩展：基地/详细地址 */
  baseAddress?: string
  /** 项目扩展：查看费用（元） */
  viewFee?: number
}

// 订单对应的产品信息类型
export interface ProductInfo {
  /** 产品ID */
  productId: string
  /** 产品封面 */
  cover: string
  /** 产品名称 */
  title: string
  /** 产品时间 行程、活动等，项目不包括时间，长期有效 */
  time?: string
  /** 产品对应的门店名称 */
  address_name?: string
  /** 产品对应的门店地址 */
  event_address?: string
}

// 订单对应的发起人信息 酒店类订单除外，默认空对象
export interface InitiatorInfo {
  /** 发起人ID */
  initiatorId: string
  /** 真实姓名 */
  username: string
  /** 手机号 */
  mobile: string
  /** 微信号 */
  wechat: string
}

export interface OrderPage {
  list: OrderItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 取消订单接口返回 */
export interface OrderCancelResult {
  orderId: string
  cancelled: boolean
}

// 创建核销码接口返回
export interface CreateQrCodeResult {
  /** 订单ID */
  orderId: string
  /** 核销码 */
  verifyCode: string
}

// 当前用户抵扣完支付金额为0时，走下单流程，不用支付接口返回
export interface CreateOrderFreeResult {
  orderId: string
}

// 核销订单接口返回
export interface WriteOrderResult {
  out_trade_no: string
  isVerified: boolean
}
