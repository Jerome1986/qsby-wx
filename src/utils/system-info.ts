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

// 获取底部安全区域高度
export const safeAreaBottom = ref(0)

export const getSafeAreaBottom = () => {
  const systemInfo = uni.getSystemInfoSync()
  // 优先使用 safeAreaInsets.bottom（兼容性更好）
  const insetsBottom = systemInfo.safeAreaInsets?.bottom || 0
  // 计算值作为备选
  const calcBottom =
    systemInfo.screenHeight - (systemInfo.safeArea?.bottom || systemInfo.screenHeight)
  // 取较大值，若都为0则兜底20px（适配大部分全面屏）
  const result = Math.max(insetsBottom, calcBottom)
  safeAreaBottom.value = result > 0 ? result : 20
  console.log('底部安全区域高度:', safeAreaBottom.value)
}
