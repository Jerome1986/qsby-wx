<script setup lang="ts">
defineProps<{
  listData: any
  fields: any
}>()

// 跳转订单详情
const goDetail = () => {
  console.log('goDetail')
}
</script>

<template>
  <view class="item" v-for="(order, index) in listData" :key="index" @tap="goDetail">
    <!--  封面   -->
    <view class="cover">
      <image :src="order.cover" mode="aspectFill"></image>
    </view>
    <!--  订单信息   -->
    <view class="orderInfo">
      <view class="productName">{{ order.productName }}</view>
      <view class="content" v-for="(item, index) in fields" :key="index">
        <view class="label">{{ item.label }}:</view>
        <view class="value" :class="{ price: item.key === 'scoreNum' }">{{ order[item.key] }}</view>
      </view>
    </view>
    <!--  状态图标   -->
    <view class="statusIcon" v-show="order.scoreStatus === 'USED'">
      <image
        src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/used.png"
        mode="aspectFill"
      ></image>
    </view>
  </view>
</template>

<style scoped lang="scss">
.item {
  position: relative;
  margin-bottom: 24rpx;
  display: flex;
  padding: 24rpx;
  background: #ffffff;
  border-radius: 30rpx;
  @include customShadow();
  &:nth-last-child(1) {
    box-shadow: none;
  }
  /*封面图*/
  .cover {
    margin-right: 24rpx;
    width: 192rpx;
    height: 192rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }
  /*订单文字信息*/
  .orderInfo {
    .productName {
      margin-bottom: 20rpx;
      font-weight: bold;
      font-size: 28rpx;
      color: $qs-font-title;
    }
    .content {
      margin-bottom: 8rpx;
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
