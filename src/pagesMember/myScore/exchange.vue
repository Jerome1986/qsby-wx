<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'

// todo该页面根据订单ID获取订单信息并展示核销码
</script>

<template>
  <view class="exchange">
    <NavHead title="积分兑换" :show-back="true"></NavHead>
    <view class="content">
      <!--  商品和使用期限  -->
      <view class="usedTime">
        <view class="productName">湖景大床房</view>
        <view class="time">请在2026.01.12（含）前使用</view>
      </view>
      <!--  使用流程  -->
      <view class="progress">
        <NavTitle title="使用流程"></NavTitle>
        <view class="progress-text">购买后→联系店家→确认预约→再进店（不接受没有预约）</view>
        <view class="code">
          <image
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/code.png"
            mode="aspectFill"
          ></image>
        </view>
        <view class="number"
          >券号 1077 0939 3724 258·<text style="color: #6897ed; font-size: 24rpx">复制</text></view
        >
      </view>
      <!--  温馨提示  -->
      <view class="tips">
        <NavTitle title="温馨提示"></NavTitle>
        <view class="tips-list">
          <view class="tips-item">1. 本券一经兑换，不支持退换，请确认后再兑换</view>
          <view class="tips-item">2. 使用前请提前致电商家预约，避免到店无房</view>
          <view class="tips-item">3. 本券仅限本人使用，不可转让或转售</view>
          <view class="tips-item">4. 如遇节假日或特殊时段，请以商家实际安排为准</view>
          <view class="tips-item">5. 本券过期后自动作废，请在有效期内使用</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.exchange {
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

/* 内容卡片 */
.content {
  padding: 24rpx;
  height: 90%;
  background-color: #ffffff;
  border-radius: 30rpx;
  @include customShadow();
}

/* 商品信息和使用期限 */
.usedTime {
  /* 商品名称 */
  .productName {
    font-weight: bold;
    font-size: 28rpx;
    color: $qs-font-title;
  }
  /* 使用期限 */
  .time {
    margin: 16rpx 0;
    font-size: 24rpx;
    color: $qs-font-dec;
  }
}

/* 使用流程 */
.progress {
  /* 流程说明文字 */
  .progress-text {
    margin: 16rpx 0;
    font-size: 24rpx;
    color: $qs-font-dec;
  }
  /* 二维码区域 */
  .code {
    margin: 40rpx 0;
    text-align: center;
    width: 100%;
    border-radius: 20rpx;
    image {
      width: 216rpx;
      height: 216rpx;
    }
  }
  /* 券号 */
  .number {
    text-align: center;
    width: 100%;
    font-size: 24rpx;
    color: $qs-font-dec;
  }
}

/* 温馨提示 */
.tips {
  margin-top: 30rpx;

  /* 提示列表 */
  .tips-list {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    /* 提示项 */
    .tips-item {
      font-size: 24rpx;
      color: $qs-font-dec;
      line-height: 1.6;
    }
  }
}
</style>
