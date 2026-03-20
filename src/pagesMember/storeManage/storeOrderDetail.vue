<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaBottom } from '@/utils/system-info'
import type { OrderItem } from '@/types/OrderItem'
import { orderFindOne } from '@/api/order'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/generateMonth'

const userStore = useUserStore()

const statusLabels: Record<string, string> = {
  pending: '待付款',
  paid: '待核销',
  verified: '已核销',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款',
}

const orderId = ref('')
const orderDetail = ref<OrderItem>()
const loading = ref(false)

const orderDetailGet = async (orderId: string) => {
  loading.value = true
  try {
    const res = await orderFindOne(orderId)
    orderDetail.value = res.data
  } catch {
    uni.showToast({ icon: 'none', title: '获取订单失败' })
  } finally {
    loading.value = false
  }
}

// 门店联系客户：拨打电话
const handleCustomerCall = () => {
  const phone = orderDetail.value?.userInfo?.phone || ''
  if (phone) uni.makePhoneCall({ phoneNumber: phone })
}

/** 预览身份证图片 */
const handlePreviewIdCard = (type: 'font' | 'back') => {
  const url = type === 'font' ? orderDetail.value?.userInfo?.icCardFont : orderDetail.value?.userInfo?.icCardBack
  if (url) {
    const urls = [
      orderDetail.value?.userInfo?.icCardFont,
      orderDetail.value?.userInfo?.icCardBack,
    ].filter(Boolean) as string[]
    uni.previewImage({ current: url, urls })
  }
}

onLoad((options) => {
  orderId.value = options?.orderId || ''
  getSafeAreaBottom()
  if (orderId.value) {
    orderDetailGet(orderId.value)
  }
})
</script>

<template>
  <view class="storeOrderDetail">
    <NavHead title="门店订单详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      <view style="padding: 24rpx;" v-else-if="orderDetail">
        <!-- 产品信息卡片 -->
        <view class="card product-card">
          <view class="product-top">
            <view class="cover-wrap">
              <image class="cover" :src="orderDetail.productInfo.cover" mode="aspectFill"></image>
              <view class="type-tag">门店</view>
              <view class="status-tag pending" v-if="orderDetail.status === 'pending'">待付款</view>
              <view class="status-tag verified" v-else-if="orderDetail.status === 'verified'">已核销</view>
            </view>
            <view class="product-info">
              <view class="title">{{ orderDetail.productInfo.title }}</view>
              <view class="info-row" v-if="orderDetail.shopInfo?.shopName">
                <text class="label">店名：</text>
                <text class="value">{{ orderDetail.shopInfo.shopName }}</text>
              </view>
              <view class="info-row" v-if="orderDetail.shopInfo?.address">
                <text class="label">地址：</text>
                <text class="value">{{ orderDetail.shopInfo.address }}</text>
              </view>
              <view class="price-row">
                <text class="label">价格：</text>
                <text class="price">¥{{ orderDetail.payAmount.toFixed(2) }}元/晚</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 订单信息 -->
        <view class="card">
          <view class="section-header">
            <view class="bar"></view>
            <text class="section-title">订单信息</text>
          </view>
          <view class="info-list">
            <view class="info-item" v-if="orderDetail.out_trade_no">
              <text class="label">订单号</text>
              <text class="value">：{{ orderDetail.out_trade_no }}</text>
            </view>
            <view class="info-item" v-if="orderDetail.createdAt">
              <text class="label">下单时间</text>
              <text class="value">：{{ formatTimestamp(orderDetail.createdAt, 2) }}</text>
            </view>
            <view class="info-item">
              <text class="label">订单状态</text>
              <text class="value">：{{ statusLabels[orderDetail.status] || orderDetail.status }}</text>
            </view>
            <view class="info-item" v-if="orderDetail.verifiedTime">
              <text class="label">核销时间</text>
              <text class="value">：{{ formatTimestamp(orderDetail.verifiedTime, 2) }}</text>
            </view>
          </view>
        </view>

        <!-- 入住信息（含身份证，门店联系客户） -->
        <view class="card">
          <view class="section-header">
            <view class="bar"></view>
            <text class="section-title">入住信息</text>
            <view class="dial-btn" @tap="handleCustomerCall" v-if="orderDetail.userInfo?.phone">
              <text class="iconfont icon-dianhuabodadianhua"></text>
              <text>拨打电话</text>
            </view>
          </view>
          <view class="info-list">
            <view class="info-item">
              <text class="label">联系人</text>
              <text class="value">：{{ orderDetail.userInfo?.nickname }}</text>
            </view>
            <view class="info-item">
              <text class="label">联系电话</text>
              <text class="value">：{{ orderDetail.userInfo?.phone }}</text>
            </view>
          </view>
          <view class="id-card-wrap" v-if="orderDetail.userInfo?.icCardFont || orderDetail.userInfo?.icCardBack">
            <view
              v-if="orderDetail.userInfo?.icCardFont"
              class="id-card-img-wrap"
              @tap.stop="() => handlePreviewIdCard('font')"
            >
              <image class="id-card-img" :src="orderDetail.userInfo.icCardFont" mode="aspectFill" />
            </view>
            <view
              v-if="orderDetail.userInfo?.icCardBack"
              class="id-card-img-wrap"
              @tap.stop="() => handlePreviewIdCard('back')"
            >
              <image class="id-card-img" :src="orderDetail.userInfo.icCardBack" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="!loading && !orderDetail" class="empty">
        <text>订单不存在</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.storeOrderDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.card {
  background-color: $qs-card-bg;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .bar {
    width: 6rpx;
    height: 28rpx;
    background-color: $qs-brandColor;
    border-radius: 3rpx;
    margin-right: 12rpx;
  }

  .section-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .dial-btn {
    display: flex;
    align-items: center;
    gap: 6rpx;
    font-size: 28rpx;
    color: $qs-brandColor;

    .iconfont {
      font-size: 32rpx;
    }
  }
}

.product-card {
  .product-top {
    display: flex;
    gap: 20rpx;

    .cover-wrap {
      position: relative;
      width: 200rpx;
      height: 240rpx;
      flex-shrink: 0;
      border-radius: 10rpx;
      overflow: hidden;
      background-color: #f5f5f5;

      .cover {
        width: 100%;
        height: 100%;
      }

      .type-tag {
        position: absolute;
        top: 0;
        left: 0;
        padding: 6rpx 16rpx;
        font-size: 20rpx;
        color: #ffffff;
        background: linear-gradient(135deg, $qs-brandColor, darken($qs-brandColor, 10%));
        border-radius: 10rpx 0 10rpx 0;
        z-index: 1;
      }

      .status-tag {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 6rpx 16rpx;
        font-size: 20rpx;
        color: #ffffff;
        border-radius: 10rpx 0 0 0;
        z-index: 1;

        &.pending {
          background: linear-gradient(135deg, #ff9500, #ff6b00);
        }

        &.verified {
          background: linear-gradient(135deg, #999, #666);
        }
      }
    }

    .product-info {
      flex: 1;
      min-width: 0;
      height: 240rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        font-weight: bold;
        color: $qs-font-title;
        @include ellipsis(2);
      }

      .info-row {
        display: flex;
        font-size: 28rpx;

        .label {
          flex-shrink: 0;
          color: $qs-font-dec2;
        }

        .value {
          flex: 1;
          min-width: 0;
          color: $qs-font-dec;
          @include ellipsis(1);
        }
      }

      .price-row {
        .label {
          font-size: 28rpx;
          color: $qs-font-dec2;
        }

        .price {
          font-size: 28rpx;
          font-weight: bold;
          color: #ff3b3b;
        }
      }
    }
  }
}

.info-list {
  .info-item {
    margin-bottom: 8rpx;
    font-size: 28rpx;

    .label {
      color: $qs-font-dec2;
    }

    .value {
      color: $qs-font-dec;
    }
  }
}

.id-card-wrap {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;

  .id-card-img-wrap {
    width: 200rpx;
    height: 130rpx;
    border-radius: 8rpx;
    overflow: hidden;
    background-color: #f5f5f5;
  }

  .id-card-img {
    width: 100%;
    height: 100%;
  }
}
</style>
