<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { orderFindByProduct } from '@/api/order'
import type { OrderItem, OrderType, PageOrderStatus } from '@/types/OrderItem'
import { formatTimestamp } from '@/utils/generateMonth'

const statusTabs: { label: string; value: PageOrderStatus }[] = [
  { label: '全部', value: 'all' },
  { label: '待核销', value: 'paid' },
  { label: '已核销', value: 'verified' },
]

const statusLabels: Record<string, string> = {
  pending: '待付款',
  paid: '待核销',
  verified: '已核销',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款',
}

const itemId = ref('')
const orderType = ref<OrderType>('activity')
const activityTitle = ref('')
const currentStatus = ref<PageOrderStatus>('all')
const orderList = ref<OrderItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finish = ref(false)
const hasFetched = ref(false)

const decodeTitle = (title?: string) => {
  if (!title) return ''
  try {
    return decodeURIComponent(title)
  } catch {
    return title
  }
}

const reset = () => {
  pageNum.value = 1
  orderList.value = []
  finish.value = false
  loading.value = false
  hasFetched.value = false
}

const fetchList = async () => {
  if (!itemId.value || finish.value || loading.value) return
  loading.value = true
  try {
    const res = await orderFindByProduct(
      itemId.value,
      orderType.value,
      currentStatus.value,
      pageNum.value,
      pageSize.value,
    )
    const list = res.data?.list ?? []
    orderList.value.push(...list)
    if (pageNum.value < (res.data?.totalPage ?? 0)) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } catch (err) {
    uni.showToast({ icon: 'none', title: '获取核销列表失败' })
    console.error(err)
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

const handleStatusTab = (status: PageOrderStatus) => {
  if (currentStatus.value === status) return
  currentStatus.value = status
  reset()
  fetchList()
}

const handleMore = () => {
  if (!finish.value) fetchList()
}

const handleViewDetail = (item: OrderItem) => {
  uni.navigateTo({
    url: `/pagesMember/publishManagement/verificationOrderDetail?orderId=${item._id}`,
    events: {
      'order-updated': (updatedOrder: OrderItem) => {
        const index = orderList.value.findIndex((order) => order._id === updatedOrder._id)
        if (index < 0) return
        if (currentStatus.value !== 'all' && updatedOrder.status !== currentStatus.value) {
          orderList.value.splice(index, 1)
          return
        }
        orderList.value.splice(index, 1, { ...orderList.value[index], ...updatedOrder })
      },
    },
  })
}

const hasAmount = (amount?: number | null) => {
  return typeof amount === 'number' && Number.isFinite(amount)
}

const formatAmount = (amount?: number | null) => {
  return hasAmount(amount) ? amount?.toFixed(2) : '0.00'
}

const getStatusText = (status: string) => statusLabels[status] || status

const getUserName = (item: OrderItem) => {
  return item.userInfo?.realName || item.userInfo?.nickname || '未知'
}

onLoad((options) => {
  itemId.value = options?.itemId ?? ''
  orderType.value = ((options?.type as OrderType) || 'activity') as OrderType
  activityTitle.value = decodeTitle(options?.title)
  if (!itemId.value) {
    hasFetched.value = true
    uni.showToast({ icon: 'none', title: '缺少活动信息' })
    return
  }
  fetchList()
})
</script>

<template>
  <view class="verificationList">
    <NavHead title="核销列表" :show-back="true"></NavHead>

    <view class="page-header" v-if="activityTitle">
      <text class="header-label">当前活动</text>
      <text class="header-title">{{ activityTitle }}</text>
    </view>

    <view class="filter-wrap">
      <view class="status-tabs">
        <view class="status-tab-item" v-for="item in statusTabs" :key="item.value"
          :class="{ active: currentStatus === item.value }" @tap="handleStatusTab(item.value)">
          {{ item.label }}
        </view>
      </view>
    </view>

    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <view class="content-inner">
        <view v-if="loading && !orderList.length" class="loading">
          <text>加载中...</text>
        </view>
        <view v-else-if="hasFetched && !loading && !orderList.length" class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="aspectFit"></image>
          <text class="empty-text">暂无核销订单</text>
        </view>
        <view v-else class="order-list">
          <view class="order-card" v-for="item in orderList" :key="item._id" @tap="handleViewDetail(item)">
            <view class="cover-wrap">
              <image class="cover"
                :src="item.productInfo?.cover || 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cover.jpg'"
                mode="aspectFill"></image>
              <view class="status-tag" :class="item.status">{{ getStatusText(item.status) }}</view>
            </view>
            <view class="order-info">
              <view class="title">{{ item.productInfo?.title || activityTitle || '活动订单' }}</view>
              <view class="info-row">
                <text class="label">报名人：</text>
                <text class="value">{{ getUserName(item) }}</text>
              </view>
              <view class="info-row" v-if="item.userInfo?.phone">
                <text class="label">手机号：</text>
                <text class="value">{{ item.userInfo.phone }}</text>
              </view>
              <view class="info-row" v-if="item.createdAt">
                <text class="label">下单时间：</text>
                <text class="value">{{ formatTimestamp(item.createdAt, 2) }}</text>
              </view>
              <view class="info-row" v-if="item.verifiedTime">
                <text class="label">核销时间：</text>
                <text class="value">{{ formatTimestamp(item.verifiedTime, 2) }}</text>
              </view>
              <view class="price-group">
                <view class="amount-row" v-if="hasAmount(item.totalAmount)">
                  <text class="label">订单金额：</text>
                  <text class="price">¥{{ formatAmount(item.totalAmount) }}元</text>
                </view>
                <view class="amount-row" v-if="hasAmount(item.payAmount)">
                  <text class="label">实付：</text>
                  <text class="price paid-price">¥{{ formatAmount(item.payAmount) }}元</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="load-more-tip" v-if="orderList.length && (loading || !finish)">
          <text v-if="loading">加载中...</text>
          <text v-else>上拉加载更多</text>
        </view>
        <view class="bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.verificationList {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin: 24rpx 24rpx 0;
  padding: 24rpx;
  border-radius: 24rpx;
  background-color: $qs-card-bg;
  @include customShadow();

  .header-label {
    font-size: 24rpx;
    color: $qs-font-dec;
  }

  .header-title {
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
    @include ellipsis(2);
  }
}

.filter-wrap {
  padding: 24rpx;
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background-color: $qs-card-bg;
  @include customShadow();
}

.status-tab-item {
  position: relative;
  padding-bottom: 14rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: $qs-font-dec;

  &.active {
    color: $qs-font-title;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 32rpx;
      height: 6rpx;
      border-radius: 3rpx;
      background-color: $qs-brandColor;
      transform: translateX(-50%);
    }
  }
}

.content {
  flex: 1;
  min-height: 0;
}

.content-inner {
  padding: 0 24rpx;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .empty-img {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 24rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: $qs-font-dec;
  }
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.order-card {
  display: flex;
  align-items: stretch;
  padding: 24rpx;
  border-radius: 24rpx;
  background-color: $qs-card-bg;
  @include customShadow();
}

.cover-wrap {
  position: relative;
  flex-shrink: 0;
  width: 200rpx;
  height: 240rpx;
  margin-right: 24rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background-color: #f5f5f5;

  .cover {
    width: 100%;
    height: 100%;
  }
}

.status-tag {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 6rpx 16rpx;
  border-radius: 16rpx 0 16rpx 0;
  background: linear-gradient(135deg, $qs-brandColor, #f2b800);
  font-size: 20rpx;
  color: #ffffff;

  &.paid {
    background: linear-gradient(135deg, #ff9500, #ff6b00);
  }

  &.verified {
    background: linear-gradient(135deg, #999999, #666666);
  }

  &.cancelled,
  &.refunding,
  &.refunded {
    background: linear-gradient(135deg, #b8b8b8, #8f8f8f);
  }
}

.order-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    margin-bottom: 8rpx;
    font-weight: bold;
    color: $qs-font-title;
    @include ellipsis(1);
  }

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 4rpx;
    font-size: 26rpx;

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

  .price-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4rpx;

    .amount-row {
      display: flex;
      align-items: center;
    }

    .label {
      font-size: 28rpx;
      color: $qs-font-dec2;
    }

    .price {
      font-size: 28rpx;
      font-weight: bold;
      color: $qs-font-title;
    }

    .paid-price {
      color: #ff3b3b;
    }
  }
}

.load-more-tip {
  padding: 24rpx 0;
  text-align: center;
  font-size: 24rpx;
  color: $qs-font-dec;
}

.bottom-placeholder {
  height: 60rpx;
}
</style>
