<script setup lang="ts">
import { OrderData } from './myConfig.ts'
import NavTitle from '@/components/NavTitle.vue'
</script>

<template>
  <view class="order">
    <view class="order-head">
      <NavTitle title="我的订单"> </NavTitle>
      <view class="dec">全部订单 </view>
    </view>
    <view class="orderList">
      <view class="order-item" v-for="(item, index) in OrderData" :key="index">
        <image class="icon" :src="item.icon" mode="aspectFit"></image>
        <view class="text">{{ item.text }} </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.order {
  margin-top: 30rpx;
  padding: 24rpx 30rpx;
  height: 232rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  .order-head {
    display: flex;
    justify-content: space-between;

    .dec {
      font-size: 26rpx;
      color: $qs-font-dec2;
    }
  }
  .orderList {
    display: flex;
    justify-content: space-around;
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 45rpx;
      .icon {
        margin-bottom: 16rpx;
        width: 54rpx;
        height: 54rpx;
        overflow: hidden;
      }
      .text {
        font-size: 24rpx;
        color: $qs-font-title;
      }
    }
  }
}
</style>
