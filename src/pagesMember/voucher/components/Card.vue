<script setup lang="ts">
import { ref, computed } from 'vue'

const total = ref(1000)
const current = 600

//进度条
const progressPercent = computed(() => {
  return Math.min((current / total.value) * 100, 100)
})
</script>

<template>
  <view class="card">
    <!--  当前年月  -->
    <view class="date">2026年11月</view>
    <!--   当前年月对应的额度   -->
    <view class="amount">￥1000.00</view>
    <view class="dec">仅限本月使用，逾期未用自动清理</view>
    <view class="bottom">
      <!--  进度条  -->
      <view class="progress">
        <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </view>
      <view class="text">
        <view class="used">已使用￥{{ current }}</view>
        <view class="total">总￥{{ total }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  background-image: url('https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/myWallet/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 30rpx;
  /*对应当前的年月*/
  .date {
    margin-bottom: 24rpx;
    font-weight: bold;
    font-size: 28rpx;
    color: #0b0a0a;
  }
  /*额度*/
  .amount {
    font-weight: bold;
    font-size: 54rpx;
    color: #0b0a0a;
  }
  /*备注说明*/
  .dec {
    font-size: 24rpx;
    color: #0b0a0a;
  }
  /*底部进度条和信息*/
  .bottom {
    margin-top: 40rpx;
    width: 100%;
    .progress {
      margin-bottom: 10rpx;
      height: 20rpx;
      background: #ffffff;
      border-radius: 10rpx;
      .progress-bar {
        height: 100%;
        background: #0b0a0a;
        border-radius: 6px;
        transition: width 0.3s ease;
      }
    }
    .text {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 24rpx;
      color: #0b0a0a;
    }
  }
}
</style>
