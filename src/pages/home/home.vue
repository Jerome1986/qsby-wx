<script setup lang="ts">
import { computed } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { homeData, HomeJump, type NavType } from '@/pages/home/data.ts'
import { getNavBarHeight, navBarHeight } from '@/utils/system-info.ts'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const visibleHomeData = computed(() => homeData.filter((item) => item.type !== 'interesting'))

const getInviterCode = () => userStore.profile?.referralCode

const getInviteLoginPath = () => {
  const inviterCode = getInviterCode()
  return inviterCode
    ? `/pages/login/login?inviterCode=${encodeURIComponent(inviterCode)}`
    : '/pages/login/login'
}

const getInviteTimelineQuery = () => {
  const inviterCode = getInviterCode()
  return inviterCode ? `inviterCode=${encodeURIComponent(inviterCode)}` : ''
}

const getHomeTitle = (item: (typeof homeData)[number]) => {
  return item.type === 'play' ? '同城趣玩' : item.title
}

// 跳转页面
const handleGo = (val: NavType) => {
  HomeJump[val]()
}

onShareAppMessage(() => {
  return {
    title: '千宿百院',
    path: getInviteLoginPath(),
  }
})

onShareTimeline(() => {
  const query = getInviteTimelineQuery()
  return {
    title: '千宿百院',
    ...(query ? { query } : {}),
  }
})

onLoad(() =>
  // 获取导航栏高度
  getNavBarHeight(),
)
</script>

<template>
  <view class="home-page">
    <view style="overflow: hidden; height: 100vh">
      <!-- 背景视频-->
      <video src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/homebg.mp4" class="bg-video"
        :show-progress="false" :show-fullscreen-btn="false" :show-bottom-progress="false" :autoplay="true" :loop="true"
        :muted="true" object-fit="fill" :controls="false" :show-play-btn="false" :show-center-play-btn="false"
        :enable-progress-gesture="false"></video>
    </view>
    <!--  导航列表主题  -->
    <view class="main">
      <view class="head" :style="{ height: navBarHeight + 'px' }"></view>
      <view class="nav-list">
        <view
          class="nav-item"
          :class="`nav-item--${item.type}`"
          v-for="(item, index) in visibleHomeData"
          :key="index"
          @tap="handleGo(item.type)"
        >
          <view class="icon">
            <image :src="item.icon"></image>
          </view>
          <view class="text">
            <view class="dec">{{ item.dec }}</view>
            <view class="title">{{ getHomeTitle(item) }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  background-color: #fcfefe;
}

.bg-video {
  width: 100vw;
  height: 105vh;
  overflow: hidden;
  /* 隐藏超出内容 */
  overscroll-behavior: contain;
  /* 阻止滚动链 */
  touch-action: none;
  /* 禁止触摸操作 */
  -webkit-overflow-scrolling: auto;
  /* 禁用 iOS 弹性滚动 */
}

/* 内容主体 */
.main {
  position: absolute;
  width: 100vw;
  top: 40rpx;
  border-radius: 30rpx 30rpx 0 0;
}

/* 导航 */
.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  width: 100%;
  justify-content: space-between;
  padding: 0 24rpx;

  .nav-item {
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    gap: 16rpx;
    width: calc((100% - 20rpx) / 2);
    height: 184rpx;
    padding: 20rpx 18rpx;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20rpx;

    &--city {
      width: 100%;
      height: 196rpx;
      gap: 28rpx;
      background-color: rgba(255, 255, 255, 0.86);

      .icon {
        width: 144rpx;
        height: 144rpx;
      }

      .text {
        min-width: 180rpx;
      }
    }

    /*图标*/
    .icon {
      flex-shrink: 0;
      width: 128rpx;
      height: 128rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

    /*文字*/
    .text {
      flex-shrink: 0;
      min-width: 112rpx;
      text-align: center;

      .dec {
        margin-bottom: 10rpx;
        color: $qs-font-dec2;
        font-size: 20rpx;
      }

      .title {
        font-weight: bold;
      }
    }
  }
}
</style>
