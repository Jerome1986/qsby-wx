<script setup lang="ts">
import type { ScoreOrder } from '@/types/Score'
import type { ScoreOrderFieldConfig } from '@/pagesMember/myScore/dataConfig'

defineProps<{
  listData: ScoreOrder[]
  fields: ScoreOrderFieldConfig[]
}>()

// 跳转订单详情
const goDetail = (orderId: string) => {
  console.log('goDetail')
  uni.navigateTo({
    url: `/pagesMember/myScore/exchange?orderId=${orderId}`,
  })
}
</script>

<template>
  <view class="item" v-for="(order, index) in listData" :key="index" @tap="goDetail(order._id)">
    <!--  封面   -->
    <view class="cover">
      <image :src="order.productCover" mode="aspectFill"></image>
    </view>
    <!--  订单信息   -->
    <view class="orderInfo">
      <view class="productName">{{ order.productName }}</view>
      <view class="content" v-for="(item, index) in fields" :key="index">
        <view class="label">{{ item.label }}:</view>
        <view class="value" :class="{ price: item.key === 'payScore' }">{{
          item.formatter ? item.formatter((order as unknown as Record<string, unknown>)[item.key]) :
            (order as unknown as Record<string, unknown>)[item.key] }}</view>
      </view>
    </view>
    <!--  状态图标   -->
    <view class="statusIcon" v-show="order.status === 'verified'">
      <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/status/used.png" mode="aspectFill">
      </image>
    </view>
  </view>
</template>

<style scoped lang="scss">
.item {
  position: relative;
  margin-bottom: 24rpx;
  display: flex;
  padding: 24rpx;
  background: $qs-card-bg;
  border-radius: 30rpx;
  @include customShadow();

  /*封面图*/
  .cover {
    margin-right: 24rpx;
    width: 192rpx;
    height: 192rpx;
    flex-shrink: 0;
    border-radius: 20rpx;
    overflow: hidden;
  }

  /*订单文字信息（与封面等高，垂直 space-between）*/
  .orderInfo {
    flex: 1;
    min-width: 0;
    height: 192rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .productName {
      font-weight: bold;
      font-size: 28rpx;
      color: $qs-font-title;
      @include ellipsis(2);
    }

    .content {
      display: flex;
      gap: 10rpx;
      font-size: 24rpx;
      color: $qs-font-dec;

      .price {
        color: #da1417;
        font-weight: bold;
      }
    }
  }

  /*订单状态图标*/
  .statusIcon {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    width: 130rpx;
    height: 97rpx;
  }
}
</style>
