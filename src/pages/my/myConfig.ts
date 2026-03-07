import type { FeatureItem, FeatureType, MyUtilsItem, myUtilsType } from '@/types/My'
import type { OrderStatus } from '@/types/OrderItem'

// 功能区数据
export const functionData: FeatureItem[] = [
  {
    icon: '/static/my/friend.png',
    text: '我的好友',
    type: 'friend',
  },
  {
    icon: '/static/my/money.png',
    text: '我的钱包',
    type: 'wallet',
  },
  {
    icon: '/static/my/voucher.png',
    text: '代金券',
    type: 'voucher',
  },
  {
    icon: '/static/my/score.png',
    text: '我的积分',
    type: 'score',
  },
]

// 功能区跳转函数
export const functionJumpMap: Record<FeatureType, () => void> = {
  friend: () => {
    uni.navigateTo({ url: '/pagesMember/myFriend/myFriend' })
  },
  score: () => {
    uni.navigateTo({ url: '/pagesMember/myScore/myScore' })
  },
  voucher: () => {
    uni.navigateTo({ url: '/pagesMember/voucher/voucher' })
  },
  wallet: () => {
    uni.navigateTo({ url: '/pagesMember/myWallet/myWallet' })
  },
}

interface OrderData {
  icon: string
  text: string
  type: Partial<OrderStatus>
}

// 订单区数据
export const OrderData: OrderData[] = [
  {
    icon: '/static/my/UNPAID.png',
    text: '待付款',
    type: 'pending',
  },
  {
    icon: '/static/my/UNUSED.png',
    text: '待核销',
    type: 'paid',
  },
  {
    icon: '/static/my/USED.png',
    text: '已核销',
    type: 'verified',
  },
  {
    icon: '/static/my/REFUNDED.png',
    text: '退款/售后',
    type: 'refunded',
  },
]

// 跳转封装
const Jump = (status: OrderStatus) => {
  uni.navigateTo({
    url: `/pagesMember/orderManage/orderManage?orderStatus=${status}`,
  })
}

// 订单对应的跳转函数
export const orderJumpMap: Partial<Record<OrderStatus, (status: OrderStatus) => void>> = {
  pending: (status) => Jump(status),
  paid: (status) => Jump(status),
  verified: (status) => Jump(status),
  refunded: (status) => Jump(status),
}

// 我的工具跳转函数
export const utilsJumpMap: Record<myUtilsType, () => void> = {
  manager: () => {
    uni.navigateTo({ url: '/pagesMember/applyFor/applyFor' })
  },
  share: () => {},
  group: () => {},
  message: () => {},
  suggestion: () => {
    uni.navigateTo({ url: '/pagesMember/suggestion/suggestion' })
  },
  cooperate: () => {},
}

// 我的工具数据
export const utilsData: MyUtilsItem[] = [
  {
    icon: '/static/my/utils/apply.png',
    text: '申请主理人',
    type: 'manager',
  },
  {
    icon: '/static/my/utils/share.png',
    text: '分享好友',
    type: 'share',
  },
  {
    icon: '/static/my/utils/cityGroup.png',
    text: '同城社群',
    type: 'group',
  },
  {
    icon: '/static/my/utils/message.png',
    text: '消息中心',
    type: 'message',
  },
  {
    icon: '/static/my/utils/suggestion.png',
    text: '建议中心',
    type: 'suggestion',
  },
  {
    icon: '/static/my/utils/cooperate.png',
    text: '咨询合作',
    type: 'cooperate',
  },
]
