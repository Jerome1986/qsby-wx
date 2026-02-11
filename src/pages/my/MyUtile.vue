<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { utilsData } from '@/pages/my/myConfig.ts'
</script>

<template>
  <view class="myUtils">
    <NavTitle title="我的工具"></NavTitle>
    <view class="utils">
      <view class="utils-item" v-for="(item, index) in utilsData" :key="index">
        <image class="icon" :src="item.icon" mode="aspectFit"></image>
        <view class="text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.myUtils {
  margin-top: 30rpx;
  padding: 26rpx 30rpx;
  background: #ffffff;
  border-radius: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  .utils {
    margin-top: 30rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    .utils-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10rpx;
      .icon {
        width: 61rpx;
        height: 61rpx;
        overflow: hidden;
      }
      .text {
        font-size: 24rpx;
        color: $qs-font-title;
        text-align: center;
      }
    }
  }
}
</style>
