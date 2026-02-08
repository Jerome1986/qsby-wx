import { ref } from 'vue'

// 获取导航栏高度
export const navBarHeight = ref(0)

export const getNavBarHeight = () => {
  const systemInfo = uni.getSystemInfoSync()
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect()

  // 状态栏高度
  const statusBarHeight = systemInfo.statusBarHeight || 0

  // 导航栏高度 = 胶囊按钮bottom + (胶囊按钮top - 状态栏高度)
  const navBarHeightCalc =
    (menuButtonInfo.bottom || 0) + (menuButtonInfo.top || 0) - statusBarHeight

  navBarHeight.value = navBarHeightCalc
  console.log('导航栏高度:', navBarHeightCalc)
}

// 功能区数据
export const functionData = [
  {
    icon: '/static/my/friend.png',
    text: '我的好友',
  },
  {
    icon: '/static/my/money.png',
    text: '我的钱包',
  },
  {
    icon: '/static/my/voucher.png',
    text: '代金券',
  },
  {
    icon: '/static/my/score.png',
    text: '我的积分',
  },
]

// 订单区数据
export const OrderData = [
  {
    icon: '/static/my/UNPAID.png',
    text: '待付款',
  },
  {
    icon: '/static/my/UNUSED.png',
    text: '待核销',
  },
  {
    icon: '/static/my/USED.png',
    text: '已核销',
  },
  {
    icon: '/static/my/REFUNDED.png',
    text: '退款/售后',
  },
]

// 我的工具
export const utilsData = [
  {
    icon: '/static/my/utils/apply.png',
    text: '申请主理人',
  },
  {
    icon: '/static/my/utils/share.png',
    text: '分享好友',
  },
  {
    icon: '/static/my/utils/cityGroup.png',
    text: '同城社群',
  },
  {
    icon: '/static/my/utils/message.png',
    text: '消息中心',
  },
  {
    icon: '/static/my/utils/suggestion.png',
    text: '建议中心',
  },
  {
    icon: '/static/my/utils/cooperate.png',
    text: '咨询合作',
  },
]
