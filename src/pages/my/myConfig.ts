import { ref } from "vue"

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