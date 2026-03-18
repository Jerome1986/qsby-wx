import type { FeatureItem, FeatureType, MyUtilsItem, myUtilsType } from '@/types/My'
import type { OrderStatus } from '@/types/OrderItem'

// 功能区数据
export const functionData: FeatureItem[] = [
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/frirend/friend.png',
    text: '我的好友',
    type: 'friend',
    iconSize: 58,
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/money.png',
    text: '我的钱包',
    type: 'wallet',
    iconSize: 60,
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/voucher.png',
    text: '代金券',
    type: 'voucher',
    iconSize: 60,
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/score.png',
    text: '我的积分',
    type: 'score',
    iconSize: 60,
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
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/UNPAID.png',
    text: '待付款',
    type: 'pending',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/UNUSED.png',
    text: '待核销',
    type: 'paid',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/USED.png',
    text: '已核销',
    type: 'verified',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/REFUNDED.png',
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
  share: () => {
    console.log('分享')
  },
  group: () => {},
  message: () => {
    uni.navigateTo({ url: '/pagesMember/message/message' })
  },
  suggestion: () => {
    uni.navigateTo({ url: '/pagesMember/suggestion/suggestion' })
  },
  cooperate: () => {},
}

// 我的工具数据
export const utilsData: MyUtilsItem[] = [
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/utils/apply.png',
    text: '申请主理人',
    type: 'manager',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/utils/share.png',
    text: '分享好友',
    type: 'share',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/utils/cityGroup.png',
    text: '同城社群',
    type: 'group',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/utils/message.png',
    text: '消息中心',
    type: 'message',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/utils/suggestion.png',
    text: '建议中心',
    type: 'suggestion',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/utils/cooperate.png',
    text: '咨询合作',
    type: 'cooperate',
  },
]
