<script setup lang="ts"></script>

<template>
  <!-- 表头 -->
  <view class="table-header">
    <view class="th">时间</view>
    <view class="th">已使用余额</view>
    <view class="th">已清零余额</view>
  </view>
  <!-- 表格数据 -->
  <view class="table-body">
    <view class="table-row" v-for="index in 6" :key="index">
      <view class="td">2020-10-20</view>
      <view class="td">￥100.00</view>
      <view class="td red">￥900.00</view>
    </view>
  </view>
  <!--   提示   -->
  <view class="tips"
    >注：代金券仅限本月使用，逾期未用自动清理 已过期代金券不可恢复，详细规划请查看使用说明</view
  >
</template>

<style scoped lang="scss">
.table-header {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;

  .th {
    flex: 1;
    text-align: center;
    font-size: 24rpx;
    font-weight: bold;
    color: #999;
  }
}

.table-body {
  .table-row {
    display: flex;
    padding: 24rpx 0;
    border-bottom: none;

    .td {
      flex: 1;
      text-align: center;
      font-size: 26rpx;
      color: $qs-font-title;

      &.red {
        color: #ff3232;
      }
    }
  }
}

.tips {
  position: absolute;
  bottom: 60rpx;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 80%;
  font-size: 24rpx;
  color: $qs-font-dec2;
}
</style>
