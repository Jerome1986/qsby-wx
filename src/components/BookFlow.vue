<script setup lang="ts">
withDefaults(
  defineProps<{
    type: string
  }>(),
  {
    type: 'score',
  },
)
</script>

<template>
  <view class="info">
    <!--   积分   -->
    <view class="price" v-if="type === 'score'">
      <text class="iconfont icon-shijian"></text>
      <view class="value">积分：100积分</view>
    </view>
    <!--   价格   -->
    <view class="product-price" v-if="type === 'product'">
      <view class="left">
        <text class="iconfont icon-shijian"></text>
        <view class="value">价格：400/晚</view>
      </view>
      <view class="commission">佣金：200</view>
    </view>
    <!--   位置和商家名称   -->
    <view class="info-row">
      <view class="info-main">
        <view class="info-title">
          <text class="iconfont icon-dingwei"></text>
          <text class="title-text" style="margin-left: 10rpx">千宿百院</text>
        </view>
        <view class="info-desc">
          武汉市场口区区京汉大道668号恒隆广场场 东区L4层L444号INS室内蹦极
        </view>
      </view>
      <view class="info-action">
        <text class="iconfont icon-ditu" style="color: #f7821a; font-size: 40rpx"></text>
        <view style="font-size: 24rpx; color: #919191">地图</view>
      </view>
    </view>
    <!--   预约流程   -->
    <view class="info-row">
      <view class="info-main">
        <view class="info-title">
          <text class="iconfont icon-shoucang"></text>
          <text class="title-text" style="margin-left: 10rpx">预约流程</text>
        </view>
        <view class="info-desc"> 购买商品→致电商家预约→商家确认→进店消费 </view>
      </view>
      <view class="info-action">
        <text
          class="iconfont icon-dianhuabodadianhua"
          style="color: #f7821a; font-size: 40rpx"
        ></text>
        <view style="font-size: 24rpx; color: #919191">预约</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 50rpx;
  padding: 39rpx 37rpx;
  margin-top: 20rpx;
  background: #ffffff;
  border-radius: 20rpx;
  @include customShadow();

  /* 积分/价格行 */
  .price {
    display: flex;
    align-items: center;
    gap: 10rpx;
    color: $qs-font-title;
    font-weight: bold;
  }

  /* 商品价格行（左右布局） */
  .product-price {
    display: flex;
    align-items: center;
    color: $qs-font-title;
    font-weight: bold;

    .left {
      margin-right: 50rpx;
      display: flex;
      align-items: center;
      gap: 10rpx;
    }
    .commission {
      font-size: 28rpx;
      color: $qs-font-dec2;
    }
  }
  /*通用信息行*/
  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .info-main {
      flex: 1;
      .info-title {
        margin-bottom: 10rpx;
        font-weight: bold;
        color: $qs-font-title;
      }
      .info-desc {
        font-size: 24rpx;
        color: $qs-font-dec;
      }
    }
    .info-action {
      margin-left: 30rpx;
      text-align: center;
    }
  }
}
</style>
