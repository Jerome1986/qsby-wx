<script setup lang="ts">
import Card from './components/Card.vue'
import NavTitle from '@/components/NavTitle.vue'
import Table from './components/Table.vue'
import NavHead from '@/components/NavHead.vue'

const goDetail = () => {
  uni.navigateTo({
    url: '/pagesMember/voucher/voucherDetail',
  })
}
</script>
<template>
  <view class="voucher">
    <NavHead title="代金券" :show-back="true"></NavHead>
    <!--  代金券卡片信息  -->
    <Card></Card>
    <!--  title    -->
    <view class="title">
      <NavTitle title="代金券"></NavTitle>
      <view class="dec" @tap="goDetail">查看明细</view>
    </view>
    <!--  月份汇总列表--只显示最近半年   -->
    <view class="list">
      <!--  汇总表格组件  -->
      <Table></Table>
    </view>
  </view>
</template>

<style scoped lang="scss">
.voucher {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

.title {
  margin: 30rpx 0;
  display: flex;
  justify-content: space-between;
  .dec {
    padding: 8rpx 16rpx;
    text-align: center;
    background: $qs-brandColor;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: $qs-font-title;
  }
}

.list {
  position: relative;
  flex: 1;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}
</style>
