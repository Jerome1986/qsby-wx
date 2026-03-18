<script setup lang="ts"></script>

<template>
  <view class="card pay-row">
    <text class="pay-label">支付方式</text>
    <view class="pay-method">
      <text class="iconfont icon-weixinzhifu" style="color: #07c160; font-size: 40rpx"></text>
      <text class="pay-text">微信支付</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.card {
  background-color: $qs-card-bg;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

.pay-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .pay-label {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .pay-method {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .pay-text {
      font-size: 28rpx;
      color: $qs-font-title;
    }
  }
}
</style>
