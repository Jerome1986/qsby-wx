<script setup lang="ts"></script>

<template>
  <view class="list" v-for="index in 6" :key="index">
    <view class="image">
      <image
        src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/myWallet/hongbao.png"
        mode="aspectFit"
      ></image>
    </view>
    <view class="right">
      <view class="title">
        <view class="orderNo">提现 -18335465496050</view>
        <view class="amount">-188.0</view>
      </view>
      <view class="content">
        <view class="balance">余额：1054.5</view>
        <view class="time">2026-01-02 12:44</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*提现记录*/

.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 30rpx;
  height: 166rpx;
  background: #ffffff;
  border-radius: 30rpx;
  &:last-of-type {
    margin-bottom: 0;
  }
  .image {
    margin-right: 20rpx;
    width: 85rpx;
    height: 83rpx;
    overflow: hidden;
  }
  .right {
    flex: 1;
    .title {
      margin-bottom: 10rpx;
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
      color: #0b0a0a;
    }
    .content {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #919191;
    }
  }
}
</style>
