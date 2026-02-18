<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { homeData, HomeJump, type NavType } from '@/pages/home/data.ts'
import { getNavBarHeight, navBarHeight } from '@/pages/my/myConfig.ts'

const shareInfo = ref()

// 跳转页面
const handleGo = (val: NavType) => {
  HomeJump[val]()
}

onShareAppMessage(() => {
  return shareInfo.value
})

onShareTimeline(() => {
  return shareInfo.value
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
      <video
        src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/homebg.mp4"
        class="bg-video"
        :show-progress="false"
        :show-fullscreen-btn="false"
        :show-bottom-progress="false"
        :autoplay="true"
        :loop="true"
        :muted="true"
        object-fit="fill"
        :controls="false"
        :show-play-btn="false"
        :show-center-play-btn="false"
        :enable-progress-gesture="false"
      ></video>
    </view>
    <!--  导航列表主题  -->
    <view class="main">
      <view class="head" :style="{ height: navBarHeight + 'px' }"></view>
      <view class="nav-list">
        <view
          class="nav-item"
          v-for="(item, index) in homeData"
          :key="index"
          @tap="handleGo(item.type)"
        >
          <view class="icon">
            <image :src="item.icon"></image>
          </view>
          <view class="text">
            <view class="dec">{{ item.dec }}</view>
            <view class="title">{{ item.title }}</view>
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
  top: 50rpx;
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
    justify-content: space-evenly;
    align-items: center;
    width: calc((100% - 20rpx) / 2);
    height: 184rpx;
    background-color: $qs-pageBackGroundColor;
    border-radius: 20rpx;
    /*图标*/
    .icon {
      width: 136rpx;
      height: 136rpx;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    /*文字*/
    .text {
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
