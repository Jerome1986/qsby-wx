<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义 props
const props = defineProps<{
  title?: string
  showBack?: boolean
  bgColor?: string
}>()

// 定义 emits
const emit = defineEmits<{
  (e: 'height', height: number): void
}>()

// 导航栏高度
const statusBarHeight = ref(0)
const navBarHeight = ref(44)
const totalHeight = ref(0)

// 返回上一页
const handleBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/home/home' })
    },
  })
}

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect()

  statusBarHeight.value = systemInfo.statusBarHeight || 0
  navBarHeight.value = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight.value) * 2
  totalHeight.value = statusBarHeight.value + navBarHeight.value

  // 向父组件传递高度
  emit('height', totalHeight.value)
})
</script>

<template>
  <!-- 固定定位的导航栏 -->
  <view
    class="nav-head"
    :style="{ height: totalHeight + 'px', backgroundColor: props.bgColor || 'transparent' }"
  >
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 导航栏内容 -->
    <view class="nav-bar" :style="{ height: navBarHeight + 'px' }">
      <!-- 左侧返回按钮 -->
      <view v-if="props.showBack" @tap="handleBack">
        <uni-icons type="back" size="20"></uni-icons>
      </view>
      <view v-else>
        <uni-icons type="back" size="20"></uni-icons>
      </view>
      <!-- 中间标题 -->
      <view class="center">
        <text class="title">{{ props.title || '' }}</text>
      </view>
      <!-- 右侧占位 -->
      <view class="right"></view>
    </view>
  </view>
  <!-- 占位元素，防止内容被遮挡 -->
  <view class="nav-placeholder" :style="{ height: totalHeight + 'px' }"></view>
</template>

<style scoped lang="scss">
.nav-head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  .status-bar {
    width: 100%;
  }

  .nav-bar {
    display: flex;
    align-items: center;
    padding: 0 24rpx;

    .left {
      width: 80rpx;
      display: flex;
      align-items: center;

      .back-icon {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48rpx;
        font-weight: 300;
        color: #333;
      }
    }

    .center {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .title {
        font-size: 32rpx;
        font-weight: 500;
        color: #1a1a1a;
      }
    }

    .right {
      width: 80rpx;
    }
  }
}

/* 占位元素 */
.nav-placeholder {
  width: 100%;
}
</style>
