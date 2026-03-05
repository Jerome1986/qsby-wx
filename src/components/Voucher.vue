<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'

// 定义 props
const props = defineProps<{
  amount: number
  useVoucher: boolean
}>()

// 定义 emits
const emit = defineEmits<{
  (e: 'update:useVoucher', value: boolean): void
}>()

const toggleVoucher = () => {
  emit('update:useVoucher', !props.useVoucher)
}
</script>

<template>
  <view class="card voucher-card">
    <view class="voucher-header">
      <NavTitle title="代金券余额"></NavTitle>
      <text class="voucher-amount">¥ {{ amount.toFixed(2) }}</text>
    </view>
    <view class="voucher-tips">
      <view class="voucher-tip-item">
        <text class="iconfont icon-duigou tip-icon"></text>
        <text class="tip-text">全额抵扣</text>
      </view>
      <view class="voucher-tip-item">
        <text class="iconfont icon-duigou tip-icon"></text>
        <text class="tip-text">余额不足时，可以补缴差价。</text>
      </view>
    </view>
    <view class="voucher-toggle" @tap="toggleVoucher">
      <view class="radio" :class="{ active: useVoucher }">
        <view class="radio-inner" v-if="useVoucher"></view>
      </view>
      <text class="voucher-toggle-text">使用代金券抵扣</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

.voucher-card {
  .voucher-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .voucher-amount {
      font-size: 32rpx;
      font-weight: bold;
      color: #ff3b3b;
    }
  }

  .voucher-tips {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 12rpx;

    .voucher-tip-item {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .tip-icon {
        font-size: 24rpx;
        color: $qs-brandColor;
      }

      .tip-text {
        font-size: 24rpx;
        color: $qs-font-dec;
      }
    }
  }

  .voucher-toggle {
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid $qs-border;
    display: flex;
    align-items: center;
    gap: 12rpx;

    .radio {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      border: 2rpx solid $qs-font-dec2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;

      &.active {
        border-color: $qs-brandColor;
      }

      .radio-inner {
        width: 18rpx;
        height: 18rpx;
        border-radius: 50%;
        background: $qs-brandColor;
      }
    }

    .voucher-toggle-text {
      font-size: 26rpx;
      color: $qs-font-title;
    }
  }
}
</style>
