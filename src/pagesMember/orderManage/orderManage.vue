<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import type { OrderItem, OrderStatus, PageOrderStatus, PageOrderType } from '@/types/OrderItem'
import { orderFindAll } from '@/api/order'
import { useUserStore } from '@/stores'
import { activityTypeFindAll } from '@/api/activity'
import type { ActivityTypeItem } from '@/types/Public'
import { formatTimestamp } from '@/utils/generateMonth'

// store
const userStore = useUserStore()

type OrderTabType = 'all' | 'activityCategory' | 'shop'

interface OrderTypeTab {
  label: string
  value: string
  type: OrderTabType
  activityTypeId?: string
}

// 一级Tab：全部 + 活动分类 + 门店
const orderTypes = ref<OrderTypeTab[]>([
  { label: '全部', value: 'all', type: 'all' },
  { label: '门店', value: 'shop', type: 'shop' },
])

const currentOrderType = ref('all')
const handleTypeTab = (item: OrderTypeTab) => {
  currentOrderType.value = item.value
  refreshOrders()
}

// 二级Tab：订单状态
const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待核销', value: 'paid' },
  { label: '已核销', value: 'verified' },
  { label: '退款/售后', value: 'afterSale' },
] as const

// 当前订单状态
const currentStatus = ref<PageOrderStatus>('all')
const handleStatusTab = (value: PageOrderStatus) => {
  currentStatus.value = value
  refreshOrders()
}


// 获取订单列表
const orderList = ref<OrderItem[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false)
const initialized = ref(false)

const loadActivityTabs = async () => {
  try {
    const res = await activityTypeFindAll()
    const activityTypes = Array.isArray(res.data) ? res.data : []
    const activityTabs = activityTypes.map((item: ActivityTypeItem) => ({
      label: item.name,
      value: item._id,
      type: 'activityCategory' as const,
      activityTypeId: item._id,
    }))

    orderTypes.value = [
      { label: '全部', value: 'all', type: 'all' },
      ...activityTabs,
      { label: '门店', value: 'shop', type: 'shop' },
    ]
  } catch (error) {
    // 活动分类加载失败不能阻断“全部”和“门店”订单查询
    console.error('获取活动分类失败', error)
  }
}

const getCurrentTypeTab = () => {
  return orderTypes.value.find((item) => item.value === currentOrderType.value) ?? orderTypes.value[0]
}

const refreshOrders = async () => {
  orderList.value = []
  pageNum.value = 1
  finish.value = false
  await fetchOrders()
}

// TODO: 分页查询
const fetchOrders = async () => {
  if (loading.value || finish.value) return

  loading.value = true
  try {
    const openid = userStore.profile?.openid
    if (!openid) {
      orderList.value = []
      finish.value = true
      uni.showToast({ icon: 'none', title: '请先登录' })
      return
    }

    const currentTypeTab = getCurrentTypeTab()
    const orderType: PageOrderType =
      currentTypeTab.type === 'activityCategory' ? 'activity' : currentTypeTab.type

    const res = await orderFindAll(
      orderType,
      currentStatus.value,
      openid,
      pageNum.value,
      pageSize.value,
      currentTypeTab.activityTypeId,
    )

    const page = res.data
    const list = Array.isArray(page?.list) ? page.list : []

    orderList.value = pageNum.value === 1 ? list : [...orderList.value, ...list]
    finish.value = list.length < pageSize.value || pageNum.value >= Number(page?.totalPage || 0)

    if (!finish.value) pageNum.value++
  } catch (error) {
    console.error('获取订单列表失败', error)
    uni.showToast({ icon: 'none', title: '订单加载失败，请重试' })
  } finally {
    loading.value = false
  }
}

const loadMoreOrders = () => {
  if (!loading.value && !finish.value) fetchOrders()
}

const handleOrderUpdated = (updatedOrder: OrderItem) => {
  const index = orderList.value.findIndex((item) => item._id === updatedOrder._id)
  if (index < 0) return

  const matchesAfterSale =
    currentStatus.value === 'afterSale' &&
    ['refunding', 'refunded'].includes(updatedOrder.status)

  if (
    currentStatus.value !== 'all' &&
    !matchesAfterSale &&
    updatedOrder.status !== currentStatus.value
  ) {
    orderList.value.splice(index, 1)
    return
  }

  orderList.value.splice(index, 1, { ...orderList.value[index], ...updatedOrder })
}

// 查看订单详情
const handleViewDetail = (item: OrderItem) => {
  uni.navigateTo({
    url: `/pagesMember/orderDetail/orderDetail?orderId=${item._id}&type=${item.orderType}`,
    events: {
      'order-updated': handleOrderUpdated,
    },
  })
}

// 获取订单类型标签
const getOrderTypeLabel = (item: OrderItem) => {
  if (item.orderType === 'activity') return item.productInfo.typeName || '趣活动'
  if (item.orderType === 'shop') return '门店'
  return ''
}

const orderStatusMap: Record<OrderStatus, string> = {
  pending: '待付款',
  payment_processing: '支付处理中',
  paid: '待核销',
  verified: '已核销',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款',
  payment_exception: '支付异常',
}

const getOrderStatusLabel = (status: OrderStatus) => orderStatusMap[status]

const formatMoney = (amount: unknown) => {
  const value = Number(amount)
  return Number.isFinite(value) ? value.toFixed(2) : '0.00'
}

onLoad(async (options) => {
  if (options?.orderStatus) {
    currentStatus.value = options.orderStatus as PageOrderStatus
  }
  if (options?.orderType === 'shop') {
    currentOrderType.value = 'shop'
  }
  await loadActivityTabs()
  await refreshOrders()
  initialized.value = true
})

onShow(() => {
  // 从订单详情返回时重新获取当前筛选条件下的数据
  if (initialized.value) refreshOrders()
})
</script>

<template>
  <view class="orderManage">
    <NavHead title="我的订单" :show-back="true"></NavHead>

    <!-- 筛选区域 -->
    <view style="padding: 24rpx;">
      <view class="filter-section">
        <!-- 一级Tab：订单类型 -->
        <scroll-view class="type-tabs-scroll" :scroll-x="true" enable-flex :show-scrollbar="false">
          <view class="type-tabs">
            <view v-for="item in orderTypes" :key="item.value" class="type-tab-item"
              :class="{ active: currentOrderType === item.value }" @tap="handleTypeTab(item)">
              {{ item.label }}
            </view>
          </view>
        </scroll-view>
        <!-- 二级Tab：订单状态 -->
        <view class="status-tabs">
          <view v-for="item in statusTabs" :key="item.value" class="status-tab-item"
            :class="{ active: currentStatus === item.value }" @tap="handleStatusTab(item.value)">
            {{ item.label }}
          </view>
        </view>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false"
      lower-threshold="100" @scrolltolower="loadMoreOrders">
      <view style="padding:0 24rpx;">
        <view v-if="loading" class="loading">
          <text>加载中...</text>
        </view>
        <view v-else-if="orderList.length === 0" class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="aspectFit"></image>
          <text class="empty-text">暂无订单</text>
        </view>
        <view v-else class="order-list">
          <view class="order-card" v-for="item in orderList" :key="item._id" @tap="handleViewDetail(item)">
            <!-- 封面图 -->
            <view class="cover-wrap">
              <image class="cover" :src="item.productInfo.cover" mode="aspectFill"></image>
              <view class="type-tag">{{ getOrderTypeLabel(item) }}</view>
            </view>
            <!-- 订单信息：标题、每条信息、价格+按钮 各为独立 view -->
            <view class="order-info">
              <view class="order-status-tag" :class="`is-${item.status}`">
                {{ getOrderStatusLabel(item.status) }}
              </view>
              <!-- 已核销印章 -->
              <view class="status" v-if="item.status === 'verified'">
                <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/hx.png"
                  mode="aspectFit" />
              </view>
              <view class="title">{{ item.productInfo.title }}</view>
              <view class="info-row" v-if="item.createdAt">
                <text class="label">下单时间：</text>
                <text class="value">{{ formatTimestamp(item.createdAt, 2) }}</text>
              </view>
              <view class="info-row" v-if="item.status === 'verified' && item.verifiedTime">
                <text class="label">核销时间：</text>
                <text class="value">{{ formatTimestamp(item.verifiedTime, 2) }}</text>
              </view>
              <!-- 门店类型 -->
              <template>
                <view class="info-row" v-if="item.orderType !== 'shop'">
                  <text class="label">{{ item.orderType === 'trip' ? '行程日期：' : '活动日期：' }}</text>
                  <text class="value">{{ item.productInfo.time }}</text>
                </view>
                <view class="info-row" v-if="item.productInfo.address_name || item.shopInfo?.shopName">
                  <text class="label">店名：</text>
                  <text class="value">{{ item.productInfo.address_name ?? item.shopInfo?.shopName }}</text>
                </view>
                <view class="info-row" v-if="item.productInfo.event_address || item.shopInfo?.address">
                  <text class="label">地址：</text>
                  <text class="value">{{ item.productInfo.event_address ?? item.shopInfo?.address }}</text>
                </view>
              </template>

              <!-- 价格 + 按钮 同一 view -->
              <view class="price-btn-row">
                <view class="price-part">
                  <template v-if="item.orderType === 'shop'">
                    <template>
                      <text class="label">订单价格：</text>
                      <text class="price">￥{{ formatMoney(item.payAmount) }}</text>
                    </template>
                  </template>
                  <template v-else>
                    <template>
                      <text class="label">报名金额：</text>
                      <text class="price">￥{{ formatMoney(item.payAmount) }}</text>
                    </template>
                  </template>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="loading && orderList.length > 0" class="load-more">加载中...</view>
        <view v-else-if="finish && orderList.length > 0" class="load-more">没有更多了</view>
        <view class="bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.orderManage {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

/* 筛选区域 */
.filter-section {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
}

/* 一级Tab：订单类型 */
.type-tabs-scroll {
  width: 100%;
  height: 60rpx;
}

.type-tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 16rpx;
  white-space: nowrap;
}

.type-tab-item {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: $qs-font-dec;
  background-color: rgba($qs-brandColor, 0.08);
  border-radius: 30rpx;
  font-weight: 500;

  &.active {
    color: $qs-font-title;
    background-color: $qs-brandColor;
    font-weight: bold;
  }
}

/* 二级Tab：订单状态 */
.status-tabs {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba($qs-brandColor, 0.1);
  gap: 32rpx;
}

.status-tab-item {
  position: relative;
  font-size: 26rpx;
  color: $qs-font-dec;
  padding-bottom: 14rpx;
  font-weight: 500;

  &.active {
    color: $qs-font-title;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 32rpx;
      height: 6rpx;
      background-color: $qs-brandColor;
      border-radius: 3rpx;
    }
  }
}

/* 内容区域 */
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

.load-more {
  padding: 28rpx 0 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: $qs-font-dec2;
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

/* 订单列表 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.order-card {
  display: flex;
  align-items: stretch;
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
}

.cover-wrap {
  position: relative;
  width: 200rpx;
  height: 240rpx;
  flex-shrink: 0;
  margin-right: 24rpx;
  background-color: #f5f5f5;
  border-radius: 16rpx;
  overflow: hidden;

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
    background: linear-gradient(135deg, $qs-brandColor, color.adjust($qs-brandColor, $lightness: -10%));
    border-radius: 16rpx 0 16rpx 0;
    z-index: 1;
  }
}

/* 订单信息：标题、每条信息、价格+按钮 各为独立 view */
.order-info {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .status {
    position: absolute;
    right: 30rpx;
    bottom: 70rpx;
    width: 160rpx;
    height: 160rpx;
    overflow: hidden;
  }

  .title {
    padding-right: 112rpx;
    margin-bottom: 8rpx;
    font-weight: bold;
    color: $qs-font-title;
    @include ellipsis(1);
  }

  .order-status-tag {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    padding: 6rpx 14rpx;
    border-radius: 18rpx;
    font-size: 22rpx;
    line-height: 1.4;
    color: #ffffff;
    background-color: $qs-brandColor;

    &.is-paid {
      background-color: #ff9f1c;
    }

    &.is-payment_processing {
      background-color: #ff9f1c;
    }

    &.is-verified {
      background-color: #35a873;
    }

    &.is-cancelled {
      background-color: #999999;
    }

    &.is-refunding {
      background-color: #f07b3f;
    }

    &.is-refunded {
      background-color: #8a78b5;
    }

    &.is-payment_exception {
      background-color: #e5484d;
    }
  }

  .info-row {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    margin-bottom: 4rpx;

    .label {
      flex-shrink: 0;
      color: $qs-font-dec2;
    }

    .value {
      flex: 1;
      color: $qs-font-dec;
      @include ellipsis(1);
    }
  }

  .price-btn-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price-part {
      display: flex;
      align-items: center;

      .label {
        font-size: 28rpx;
        color: $qs-font-dec2;
      }

      .price {
        font-size: 28rpx;
        font-weight: bold;
        color: #ff3b3b;
      }

      .points {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-brandColor;
      }
    }

  }
}

.bottom-placeholder {
  height: 60rpx;
}
</style>
