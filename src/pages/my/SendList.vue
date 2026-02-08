<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
</script>

<template>
  <view class="sendList">
    <NavTitle title="管理发布"></NavTitle>
    <view class="dec">已经发布的内容丨有趣的项目丨同城活动丨社交旅行</view>
    <view class="bg">
      <image src="/static/my/send.png" mode="aspectFit"></image>
    </view>
  </view>
</template>

<style scoped lang="scss">
.sendList {
  position: relative;
  padding: 36rpx 30rpx;
  margin-top: 30rpx;
  height: 168rpx;
  background: linear-gradient(0deg, #fcfcfc 0%, #fff9ca 100%);
  border-radius: 30rpx;
  .dec {
    padding-left: 12rpx;
    margin-top: 24rpx;
    font-size: 22rpx;
    color: #6a6451;
  }
  .bg {
    position: absolute;
    right: 18rpx;
    top: 11rpx;
    width: 124rpx;
    height: 147rpx;
  }
}
</style>
