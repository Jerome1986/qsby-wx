<script setup lang="ts">
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const userStore = useUserStore()

// 获取导航栏高度
const navBarHeight = ref(0)

const getNavBarHeight = () => {
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

const handleLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login',
  })
}

onLoad(() => {
  getNavBarHeight()
})
</script>

<template>
  <view class="myPage">
    <view class="head" :style="{ height: navBarHeight + 'px' }"></view>
    <view class="content"> 123 </view>
  </view>
</template>

<style scoped lang="scss">
.myPage {
  position: relative;
  height: 100vh;
  background: linear-gradient(to bottom right, #ffeba4, #feeca6, #f6f2d2, #ebf1f4, #e7f1f9);
  filter: saturate(1.6);
  overflow: hidden;
  z-index: -1;
}

/* 页面背景遮罩 */
.myPage::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background:
    /* 底部背景色覆盖 */ linear-gradient(
      to bottom,
      transparent 45%,
      rgba(248, 248, 248, 0.4) 50%,
      $qs-pageBackGroundColor 55%
    ),
    /* 虚化效果 */
      linear-gradient(
        to bottom,
        transparent 25%,
        rgba(255, 255, 255, 0.2) 45%,
        rgba(255, 255, 255, 0.4) 50%
      ),
    /* 边缘虚化 */ radial-gradient(circle at top left, rgba(255, 255, 255, 0.4), transparent 70%),
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.4), transparent 70%),
    radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1), transparent 90%),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.1), transparent 90%);
  pointer-events: none;
}

.content {
}
</style>
