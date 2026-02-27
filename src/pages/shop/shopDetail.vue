<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import BookFlow from '@/components/BookFlow.vue'
import NavTitle from '@/components/NavTitle.vue'

const handleDetail = () => {
  uni.navigateTo({
    url: '/pages/shop/shopProductDetail',
  })
}
</script>
<template>
  <view class="shopDetail">
    <NavHead title="门店详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  封面图  -->
      <view class="cover">
        <image
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
          mode="aspectFill"
        ></image>
      </view>
      <!-- 快捷入口 -->
      <view class="nav-entry">
        <view class="nav-item">
          <view class="nav-icon">
            <image
              mode="aspectFit"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/shop/jieshao.png"
            ></image>
          </view>
          <view class="nav-label">门店介绍</view>
        </view>
        <view class="nav-item">
          <view class="nav-icon">
            <image
              mode="aspectFit"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/shop/tuijian.png"
            ></image>
          </view>
          <view class="nav-label">周边旅游路线推荐</view>
        </view>
      </view>
      <!-- 门店办理入住 -->
      <view class="checkIn" @tap="">办理入住</view>
      <!--   预约流程   -->
      <BookFlow type="shop"></BookFlow>
      <view class="title" style="margin: 20rpx 0">
        <NavTitle title="门店商品"></NavTitle>
      </view>
      <!--   门店商品列表   -->
      <view class="product-list">
        <view class="product-item" v-for="index in 5" :key="index" @tap="handleDetail">
          <view class="product-cover">
            <image
              mode="aspectFill"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            ></image>
          </view>
          <view class="product-info">
            <view class="product-head">
              <view class="product-name">标准大床房</view>
              <view class="product-desc">含早餐 · 免费WiFi · 可加床</view>
            </view>
            <view class="product-foot">
              <view class="product-price">￥200.00</view>
              <view class="product-btn">立即购买</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部占位 -->
      <view class="scroll-bottom-placeholder"></view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.shopDetail {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  .scroll-bottom-placeholder {
    height: 20rpx;
  }

  /* 封面图 */
  .cover {
    height: 400rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }

  /* 快捷入口 */
  .nav-entry {
    display: flex;
    justify-content: space-between;
    gap: 24rpx;
    margin-top: 24rpx;

    .nav-item {
      flex: 1;
      height: 173rpx;
      background: #fff7e2;
      border-radius: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16rpx;
      @include customShadow();

      &:first-child .nav-icon {
        width: 96rpx;
        height: 81rpx;
      }

      &:last-child .nav-icon {
        width: 73rpx;
        height: 75rpx;
      }

      &:last-child .nav-label {
        width: 120rpx;
      }

      .nav-label {
        font-size: 30rpx;
        color: #0b0a0a;
      }
    }
  }

  /* 办理入住 */
  .checkIn {
    margin-top: 24rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    font-weight: 600;
    color: $qs-brandColor;
    background: #fff7e2;
    border-radius: 30rpx;
    @include customShadow();
  }

  /* 门店商品列表 */
  .product-list {
    .product-item {
      display: flex;
      gap: 20rpx;
      padding: 24rpx;
      margin-bottom: 24rpx;
      background-color: #ffffff;
      border-radius: 20rpx;
      @include customShadow();

      .product-cover {
        width: 200rpx;
        height: 240rpx;
        border-radius: 10rpx;
        overflow: hidden;
        flex-shrink: 0;
      }

      .product-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .product-head {
          .product-name {
            font-size: 28rpx;
            font-weight: bold;
            color: $qs-font-title;
            margin-bottom: 12rpx;
            @include ellipsis(1);
          }

          .product-desc {
            font-size: 24rpx;
            color: $qs-font-dec;
            @include ellipsis(2);
          }
        }

        .product-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .product-price {
            font-size: 32rpx;
            font-weight: bold;
            color: #ff3b3b;
          }

          .product-btn {
            padding: 10rpx 32rpx;
            background-color: $qs-brandColor;
            border-radius: 30rpx;
            font-size: 24rpx;
            color: $qs-font-title;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
