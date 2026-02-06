<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { navBarHeight, getNavBarHeight } from './myConfig'
import UserInfo from './UserInfo.vue';



onLoad(() => {
  getNavBarHeight()
})
</script>

<template>
  <view class="myPage">
    <view class="head" :style="{ height: navBarHeight + 'px' }"></view>
    <!-- 头部内容 -->
    <view class="user-head">
      <!-- 用户信息 -->
      <UserInfo></UserInfo>
      <!-- 扫码核销 -->
      <view class="code">
        <image class="icon" src="../../static/my/code.png" mode="aspectFit" />
        <view class="text">扫码核销</view>
      </view>
    </view>
    <view class="content">
      <!-- 功能区 -->
      <view class="function">
        功能区
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.myPage {
  position: relative;
  height: 100vh;
  background: linear-gradient(to bottom right, #ffeba4, #feeca6, #f5f2dc, #eff3f0, #ebf1f4, #e7f1f9);
  filter: saturate(1.6);
  overflow: hidden;
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
    /* 底部背景色覆盖 */
    linear-gradient(to bottom,
      transparent 45%,
      rgba(248, 248, 248, 0.4) 50%,
      $qs-pageBackGroundColor 55%),
    /* 虚化效果 */
    linear-gradient(to bottom,
      transparent 25%,
      rgba(255, 255, 255, 0.2) 45%,
      rgba(255, 255, 255, 0.4) 50%),
    /* 边缘虚化 */
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.4), transparent 70%),
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.4), transparent 70%),
    radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1), transparent 90%),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.1), transparent 90%);
}


/*内容头部*/
.user-head {
  display: flex;
  justify-content: space-between;
  padding-left: 24rpx;
  position: relative;
  z-index: 1;

  /*核销扫码*/
  .code {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 236rpx;
    height: 71rpx;
    border-radius: 35.5rpx 0rpx 0rpx 35.5rpx;
    background-color: #1A1A1A;

    .icon {
      margin-right: 14rpx;
      width: 40rpx;
      height: 39rpx;
    }

    .text {
      font-size: 29rpx;
      color: #F1EFC5;
    }
  }
}

.content {
  margin-top: 48rpx;
  padding: 24rpx;

  /*功能区*/
  .function {
    width: 100%;
    height: 179rpx;
    background: #FFFFFF;
    border-radius: 30rpx;
  }
}
</style>
