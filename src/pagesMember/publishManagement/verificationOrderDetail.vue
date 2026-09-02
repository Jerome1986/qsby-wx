<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import NavHead from '@/components/NavHead.vue'
import { orderFindOne } from '@/api/order'
import type { OrderItem } from '@/types/OrderItem'
import { formatTimestamp } from '@/utils/generateMonth'

const statusLabels: Record<string, string> = {
  pending: '待付款',
  paid: '待核销',
  verified: '已核销',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款',
}

const orderDetail = ref<OrderItem>()
const loading = ref(false)
const hasFetched = ref(false)
let openerEventChannel: UniApp.EventChannel | undefined

const applicantName = computed(() => {
  return orderDetail.value?.userInfo?.realName || orderDetail.value?.userInfo?.nickname || '未知'
})

const formatAmount = (amount?: number | null) => {
  const value = Number(amount)
  return Number.isFinite(value) ? value.toFixed(2) : '0.00'
}

const handleCall = (phone?: string) => {
  if (!phone) {
    uni.showToast({ icon: 'none', title: '暂无联系电话' })
    return
  }
  uni.makePhoneCall({ phoneNumber: phone })
}

const handleViewAddress = () => {
  const product = orderDetail.value?.productInfo
  if (product?.latitude == null || product.longitude == null) {
    uni.showToast({ icon: 'none', title: '暂无位置信息' })
    return
  }
  uni.openLocation({
    latitude: Number(product.latitude),
    longitude: Number(product.longitude),
    name: product.address_name || product.title,
    address: product.event_address || '',
  })
}

const fetchDetail = async (orderId: string) => {
  loading.value = true
  try {
    const res = await orderFindOne(orderId)
    orderDetail.value = res.data
  } catch (err) {
    uni.showToast({ icon: 'none', title: '获取核销订单失败' })
    console.error(err)
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

onLoad((options) => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as unknown as {
    getOpenerEventChannel?: () => UniApp.EventChannel
  }
  openerEventChannel = currentPage?.getOpenerEventChannel?.()
  const orderId = options?.orderId ?? ''
  if (!orderId) {
    hasFetched.value = true
    uni.showToast({ icon: 'none', title: '缺少订单信息' })
    return
  }
  fetchDetail(orderId)
})

onUnload(() => {
  if (orderDetail.value) openerEventChannel?.emit('order-updated', orderDetail.value)
})
</script>

<template>
  <view class="verificationOrderDetail">
    <NavHead title="核销订单详情" :show-back="true"></NavHead>

    <view v-if="loading" class="state-wrap">加载中...</view>
    <view v-else-if="hasFetched && !orderDetail" class="state-wrap">暂无订单信息</view>

    <scroll-view v-else-if="orderDetail" class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="content-inner">
        <view class="card product-card">
          <image class="cover" :src="orderDetail.productInfo?.cover" mode="aspectFill"></image>
          <view class="product-info">
            <view class="title">{{ orderDetail.productInfo?.title || '活动订单' }}</view>
            <view class="status" :class="orderDetail.status">
              {{ statusLabels[orderDetail.status] || orderDetail.status }}
            </view>
            <view class="info-line" v-if="orderDetail.productInfo?.time">
              活动时间：{{ formatTimestamp(orderDetail.productInfo.time, 2) }}
            </view>
            <view class="info-line" v-if="orderDetail.productInfo?.address_name">
              活动地点：{{ orderDetail.productInfo.address_name }}
            </view>
            <view class="address-line" v-if="orderDetail.productInfo?.event_address" @tap="handleViewAddress">
              <text>{{ orderDetail.productInfo.event_address }}</text>
              <text class="link">查看地图</text>
            </view>
          </view>
        </view>

        <view class="card">
          <view class="section-title">订单信息</view>
          <view class="row"><text class="label">订单号</text><text class="value">{{ orderDetail.out_trade_no }}</text>
          </view>
          <view class="row"><text class="label">订单金额</text><text class="value amount">¥{{
            formatAmount(orderDetail.totalAmount) }}</text></view>
          <view class="row"><text class="label">实付金额</text><text class="value amount">¥{{
            formatAmount(orderDetail.payAmount) }}</text></view>
          <view class="row" v-if="orderDetail.createdAt">
            <text class="label">下单时间</text><text class="value">{{ formatTimestamp(orderDetail.createdAt, 2) }}</text>
          </view>
          <view class="row" v-if="orderDetail.verifiedTime">
            <text class="label">核销时间</text><text class="value">{{ formatTimestamp(orderDetail.verifiedTime, 2) }}</text>
          </view>
        </view>

        <view class="card">
          <view class="section-header">
            <view class="section-title">报名人信息</view>
            <view class="small-btn" v-if="orderDetail.userInfo?.phone" @tap="handleCall(orderDetail.userInfo.phone)">拨号
            </view>
          </view>
          <view class="row"><text class="label">姓名</text><text class="value">{{ applicantName }}</text></view>
          <view class="row"><text class="label">手机号</text><text class="value">{{ orderDetail.userInfo?.phone || '未填写'
          }}</text></view>
        </view>

        <view class="bottom-space"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.verificationOrderDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24rpx 24rpx 0;
  @include page-background();
}

.content {
  flex: 1;
  min-height: 0;
  height: 0;
}

.content-inner {
  padding: 12rpx 10rpx 0;
}

.state-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $qs-font-dec;
  font-size: 28rpx;
}

.card {
  padding: 28rpx;
  margin-bottom: 20rpx;
  background: $qs-card-bg;
  border-radius: 30rpx;
  @include customShadow();
}

.product-card {
  display: flex;
  gap: 28rpx;
  padding: 40rpx 28rpx 28rpx;

  .cover {
    flex-shrink: 0;
    width: 190rpx;
    height: 190rpx;
    border-radius: 20rpx;
  }

  .product-info {
    flex: 1;
    min-width: 0;
  }

  .title {
    padding-right: 100rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: $qs-font-title;
    @include ellipsis(2);
  }

  .status {
    float: right;
    margin-top: -62rpx;
    padding: 8rpx 16rpx;
    border-radius: 18rpx;
    font-size: 22rpx;
    color: #8a6200;
    background: #fff1b8;

    &.verified {
      color: #16845b;
      background: #ddf7ed;
    }
  }

  .info-line,
  .address-line {
    margin-top: 14rpx;
    font-size: 24rpx;
    color: $qs-font-dec;
  }

  .address-line {
    display: flex;
    justify-content: space-between;
    gap: 12rpx;

    .link {
      flex-shrink: 0;
      color: #d99b00;
    }
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  padding-left: 16rpx;
  margin-bottom: 22rpx;
  border-left: 8rpx solid #f4c21f;
  font-size: 30rpx;
  font-weight: bold;
  color: $qs-font-title;
}

.section-header .section-title {
  margin-bottom: 22rpx;
}

.small-btn {
  margin-bottom: 22rpx;
  padding: 8rpx 22rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #7b5900;
  background: #fff1b8;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24rpx;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #f1f1f1;
  font-size: 27rpx;

  &:last-child {
    border-bottom: 0;
  }

  .label {
    flex-shrink: 0;
    color: $qs-font-dec2;
  }

  .value {
    text-align: right;
    color: $qs-font-title;
    word-break: break-all;
  }

  .amount {
    color: #e69a00;
    font-weight: bold;
  }

  .address {
    color: #d99b00;
  }
}

.bottom-space {
  height: 60rpx;
}
</style>
