<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'

const handleScroll = () => {
  console.log('触底')
}

// 积分商品详情
const goDetail = (index: number) => {
  console.log(index)
  uni.navigateTo({
    url: `/pagesMember/myScore/scoreProductDetail?productId=${index}`,
  })
}

//  处理TAP跳转
const handelGo = (val: string) => {
  switch (val) {
    case 'detail':
      uni.navigateTo({
        url: '/pagesMember/myScore/scoreDetail',
      })
      break
    case 'order':
      console.log('积分订单')
      uni.navigateTo({
        url: '/pagesMember/myScore/scoreOrder',
      })
      break
  }
}
</script>
<template>
  <view class="myScore">
    <NavHead title="我的积分" :show-back="true"></NavHead>
    <!-- 积分展示   -->
    <view class="head">
      <view class="title">我的积分</view>
      <view class="value">
        <view class="score">1299</view>
        <view class="btn">
          <view class="details item" @tap="handelGo('detail')">积分明细</view>
          <view class="order item" @tap="handelGo('order')">积分订单</view>
        </view>
      </view>
    </view>
    <!-- 积分商品   -->
    <scroll-view
      class="productScore"
      :scroll-y="true"
      @scrolltolower="handleScroll"
      :enhanced="true"
      :show-scrollbar="false"
    >
      <view class="product-item" v-for="index in 10" :key="index" @tap="goDetail(index)">
        <view class="cover">
          <image
            class="img"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            mode="aspectFill"
          ></image>
        </view>
        <view class="info">
          <view class="title">湖景大床房</view>
          <view class="content">
            <view class="needScore">100积分</view>
            <view class="bottom">
              <view class="price">价值199元</view>
              <view class="exchange">立即兑换</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.myScore {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}
/*积分展示*/
.head {
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  @include customShadow();
  .title {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #0b0a0a;
  }
  .value {
    display: flex;
    justify-content: space-between;
    .score {
      font-weight: bold;
      font-size: 41rpx;
      color: #0b0a0a;
    }
    /*按钮区域*/
    .btn {
      display: flex;
      .item {
        text-align: center;
        width: 150rpx;
        height: 47rpx;
        line-height: 47rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
      }
      .details {
        margin-right: 10rpx;
        border: 1px solid #e6b908;
        color: #ffd018;
      }
      .order {
        background-color: #ffd018;
        color: #121212;
      }
    }
  }
}
/*积分商品*/
.productScore {
  flex: 1;
  margin-top: 20rpx;
  .product-item {
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    padding: 24rpx;
    background-color: #ffffff;
    border-radius: 30rpx;
    @include customShadow();
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
    /*封面*/
    .cover {
      margin-right: 20rpx;
      width: 180rpx;
      height: 180rpx;
      border-radius: 24rpx;
      overflow: hidden;
    }
    /*商品信息*/
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 180rpx;
      /*商品名称*/
      .title {
        font-size: 29rpx;
        color: #0b0a0a;
      }
      /*积分兑换*/
      .content {
        .needScore {
          font-size: 28rpx;
          color: #da1417;
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          .price {
            font-size: 21rpx;
            color: $qs-font-dec2;
          }
          .exchange {
            text-align: center;
            width: 150rpx;
            height: 47rpx;
            line-height: 47rpx;
            background: #ffd018;
            border-radius: 24rpx;
            font-size: 24rpx;
            color: $qs-font-title;
          }
        }
      }
    }
  }
}
</style>
