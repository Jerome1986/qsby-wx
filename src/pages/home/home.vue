<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

const shareInfo = ref()

onShareAppMessage(() => {
  return shareInfo.value
})

onShareTimeline(() => {
  return shareInfo.value
})

onLoad(() => {})
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
      <view class="nav-list">
        <view class="nav-item" v-for="index in 4" :key="index">
          <view class="icon">
            <image src="/static/images/home/jinpin.png"></image>
          </view>
          <view class="text">
            <view class="dec">WHERE TO PLAY</view>
            <view class="title">趣哪游</view>
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
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    width: calc((100% - 20rpx) / 2);
    height: 184rpx;
    background-color: #ffffffc7;
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
        margin-bottom: 20rpx;
        color: #999999;
        font-size: 20rpx;
      }
      .title {
        font-weight: bold;
      }
    }
  }
}
</style>
