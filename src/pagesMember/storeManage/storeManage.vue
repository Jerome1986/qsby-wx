<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { onHide, onLoad, onShow } from '@dcloudio/uni-app'
import NavHead from '@/components/NavHead.vue'
import { orderFindByShop, orderShopPerformance } from '@/api/order'
import { shopDetailApi } from '@/api/store'
import { userInfoGetApi } from '@/api/user'
import { useUserStore } from '@/stores'
import type {
  OrderItem,
  OrderStatus,
  PageOrderStatus,
  StorePerformanceSummary,
} from '@/types/OrderItem'

type DateRangeType = 'today' | 'yesterday' | 'last7Days' | 'month' | 'custom'
type OrderDateRangeType = DateRangeType | 'all'

interface DateRangeOption {
  label: string
  value: DateRangeType
}

interface ManagedStoreOption {
  _id: string
  name: string
}

const userStore = useUserStore()
const shopId = ref('')
const managedStores = ref<ManagedStoreOption[]>([])
const currentStoreIndex = ref(0)
const today = formatDate(new Date())
const dateRangeOptions: DateRangeOption[] = [
  { label: '今日', value: 'today' },
  { label: '昨日', value: 'yesterday' },
  { label: '近7天', value: 'last7Days' },
  { label: '本月', value: 'month' },
  { label: '自定义', value: 'custom' },
]
const orderDateRangeOptions: Array<{ label: string; value: OrderDateRangeType }> = [
  { label: '全部', value: 'all' },
  ...dateRangeOptions,
]
const selectedDateType = ref<DateRangeType>('today')
const selectedDateLabel = ref('今日')
const startDate = ref(today)
const endDate = ref(today)
const customStartDate = ref(today)
const customEndDate = ref(today)
const showDatePanel = ref(false)
const showCustomDate = ref(false)
const orderSelectedDateType = ref<OrderDateRangeType>('all')
const orderSelectedDateLabel = ref('全部')
const orderStartDate = ref('')
const orderEndDate = ref('')
const orderCustomStartDate = ref(today)
const orderCustomEndDate = ref(today)
const showOrderDatePanel = ref(false)
const showOrderCustomDate = ref(false)

const performance = ref<StorePerformanceSummary>({
  verifiedRevenue: 0,
  verifiedOrderCount: 0,
  pendingVerificationCount: 0,
  refundAmount: 0,
  comparisonRate: null,
})
const performanceLoading = ref(false)
const performanceError = ref(false)

const orderStatusTabs = [
  { label: '全部', value: 'all' },
  { label: '待核销', value: 'paid' },
  { label: '已核销', value: 'verified' },
  { label: '退款/售后', value: 'refunded' },
] as const
const currentOrderStatus = ref<PageOrderStatus>('all')
const orderList = ref<OrderItem[]>([])
const orderTotal = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finish = ref(false)
const hasFetched = ref(false)
const refreshing = ref(false)
const currentScrollTop = ref(0)
const savedScrollTop = ref(0)
const controlledScrollTop = ref(0)
const shouldRestoreScroll = ref(false)

const revenueFontClass = computed(() => {
  const length = formatAmount(performance.value.verifiedRevenue).length
  if (length > 13) return 'is-small'
  if (length > 10) return 'is-medium'
  return ''
})

const comparisonText = computed(() => {
  if (selectedDateType.value === 'custom' || performance.value.comparisonRate == null) {
    return '自定义日期暂不提供环比'
  }
  const rate = Number(performance.value.comparisonRate) || 0
  const prefix = rate > 0 ? '+' : ''
  const periodMap: Record<Exclude<DateRangeType, 'custom'>, string> = {
    today: '较昨日',
    yesterday: '较前日',
    last7Days: '较前7天',
    month: '较上月同期',
  }
  return `${periodMap[selectedDateType.value]} ${prefix}${rate.toFixed(1)}%`
})

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shiftDate(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const hasAmount = (amount?: number | null) => {
  return typeof amount === 'number' && Number.isFinite(amount)
}

const formatAmount = (amount?: number | null) => {
  return hasAmount(amount) ? Number(amount).toFixed(2) : '0.00'
}

const orderStatusMap: Record<OrderStatus, string> = {
  pending: '待付款',
  paid: '待核销',
  verified: '已核销',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款',
}

const getOrderStatusLabel = (status: OrderStatus) => orderStatusMap[status]

const getManagedShopIds = () => {
  const profileShopId = userStore.profile?.shopId
  const profileShopIds = Array.isArray(profileShopId)
    ? profileShopId
    : profileShopId
      ? [profileShopId]
      : []
  return [...new Set(profileShopIds.filter(Boolean))]
}

const refreshCurrentUser = async () => {
  const userId = userStore.profile?._id
  if (!userId) {
    uni.showToast({ icon: 'none', title: '请先登录' })
    return false
  }

  try {
    const res = await userInfoGetApi(userId)
    if (res.code !== 200 || !res.data) {
      throw new Error(res.message || '用户信息获取失败')
    }
    userStore.setProfile(res.data)
    return true
  } catch (err) {
    uni.showToast({ icon: 'none', title: '用户信息更新失败' })
    console.error('更新当前用户信息失败', err)
    return false
  }
}

const loadManagedStores = async (shopIds: string[]) => {
  const stores = await Promise.all(
    shopIds.map(async (id, index) => {
      try {
        const res = await shopDetailApi(id)
        return { _id: id, name: res.data.shopInfo?.name || `门店${index + 1}` }
      } catch (err) {
        console.error(`获取门店 ${id} 信息失败`, err)
        return { _id: id, name: `门店${index + 1}` }
      }
    }),
  )
  managedStores.value = stores
  currentStoreIndex.value = Math.max(
    0,
    stores.findIndex((item) => item._id === shopId.value),
  )
}

const handleStoreChange = async (event: { detail: { value: string | number } }) => {
  const index = Number(event.detail.value)
  const selectedStore = managedStores.value[index]
  if (!selectedStore || selectedStore._id === shopId.value) return
  currentStoreIndex.value = index
  shopId.value = selectedStore._id
  await Promise.all([fetchPerformance(), refreshOrders()])
}

const fetchPerformance = async () => {
  if (!shopId.value || performanceLoading.value) return
  performanceLoading.value = true
  performanceError.value = false
  try {
    const res = await orderShopPerformance({
      shopId: shopId.value,
      startDate: startDate.value,
      endDate: endDate.value,
    })
    if (!res.data) throw new Error(res.message || '经营概览数据为空')
    performance.value = {
      verifiedRevenue: Number(res.data.verifiedRevenue) || 0,
      verifiedOrderCount: Number(res.data.verifiedOrderCount) || 0,
      pendingVerificationCount: Number(res.data.pendingVerificationCount) || 0,
      refundAmount: Number(res.data.refundAmount) || 0,
      comparisonRate:
        res.data.comparisonRate == null ? null : Number(res.data.comparisonRate) || 0,
    }
  } catch (err) {
    performanceError.value = true
    console.error('获取门店经营概览失败', err)
  } finally {
    performanceLoading.value = false
  }
}

const resetOrders = () => {
  pageNum.value = 1
  orderList.value = []
  orderTotal.value = 0
  finish.value = false
  loading.value = false
  hasFetched.value = false
}

const orderListGet = async () => {
  if (!shopId.value || finish.value || loading.value) return
  loading.value = true
  try {
    const res = await orderFindByShop(
      shopId.value,
      pageNum.value,
      pageSize.value,
      currentOrderStatus.value,
      orderStartDate.value,
      orderEndDate.value,
    )
    orderTotal.value = Number(res.data.total) || 0
    orderList.value.push(...res.data.list)
    if (pageNum.value < res.data.totalPage) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } catch (err) {
    uni.showToast({ icon: 'none', title: '获取订单失败' })
    console.error('获取门店订单失败', err)
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

const refreshOrders = async () => {
  resetOrders()
  await orderListGet()
}

const handleRefresh = async () => {
  if (refreshing.value) return
  refreshing.value = true
  await Promise.all([fetchPerformance(), refreshOrders()])
  refreshing.value = false
}

const handleOrderStatusTab = (value: PageOrderStatus) => {
  if (currentOrderStatus.value === value) return
  currentOrderStatus.value = value
  refreshOrders()
}

const handleMore = () => {
  if (!finish.value) orderListGet()
}

const handleScroll = (event: { detail: { scrollTop: number } }) => {
  currentScrollTop.value = event.detail.scrollTop
}

const selectDateRange = (option: DateRangeOption) => {
  if (option.value === 'custom') {
    showCustomDate.value = true
    return
  }
  showCustomDate.value = false
  const now = new Date()
  if (option.value === 'today') {
    startDate.value = formatDate(now)
    endDate.value = formatDate(now)
  } else if (option.value === 'yesterday') {
    const yesterday = formatDate(shiftDate(now, -1))
    startDate.value = yesterday
    endDate.value = yesterday
  } else if (option.value === 'last7Days') {
    startDate.value = formatDate(shiftDate(now, -6))
    endDate.value = formatDate(now)
  } else {
    startDate.value = formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
    endDate.value = formatDate(now)
  }
  selectedDateType.value = option.value
  selectedDateLabel.value = option.label
  showDatePanel.value = false
  fetchPerformance()
}

const handleStartDateChange = (event: { detail: { value: string } }) => {
  customStartDate.value = event.detail.value
}

const handleEndDateChange = (event: { detail: { value: string } }) => {
  customEndDate.value = event.detail.value
}

const confirmCustomDate = () => {
  if (customStartDate.value > customEndDate.value) {
    uni.showToast({ icon: 'none', title: '开始日期不能晚于结束日期' })
    return
  }
  if (customEndDate.value > today) {
    uni.showToast({ icon: 'none', title: '结束日期不能晚于今天' })
    return
  }
  startDate.value = customStartDate.value
  endDate.value = customEndDate.value
  selectedDateType.value = 'custom'
  selectedDateLabel.value = `${customStartDate.value} 至 ${customEndDate.value}`
  showCustomDate.value = false
  showDatePanel.value = false
  fetchPerformance()
}

const selectOrderDateRange = (option: { label: string; value: OrderDateRangeType }) => {
  if (option.value === 'custom') {
    showOrderCustomDate.value = true
    return
  }
  showOrderCustomDate.value = false
  const now = new Date()
  if (option.value === 'all') {
    orderStartDate.value = ''
    orderEndDate.value = ''
  } else if (option.value === 'today') {
    orderStartDate.value = formatDate(now)
    orderEndDate.value = formatDate(now)
  } else if (option.value === 'yesterday') {
    const yesterday = formatDate(shiftDate(now, -1))
    orderStartDate.value = yesterday
    orderEndDate.value = yesterday
  } else if (option.value === 'last7Days') {
    orderStartDate.value = formatDate(shiftDate(now, -6))
    orderEndDate.value = formatDate(now)
  } else {
    orderStartDate.value = formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
    orderEndDate.value = formatDate(now)
  }
  orderSelectedDateType.value = option.value
  orderSelectedDateLabel.value = option.label
  showOrderDatePanel.value = false
  refreshOrders()
}

const handleOrderStartDateChange = (event: { detail: { value: string } }) => {
  orderCustomStartDate.value = event.detail.value
}

const handleOrderEndDateChange = (event: { detail: { value: string } }) => {
  orderCustomEndDate.value = event.detail.value
}

const confirmOrderCustomDate = () => {
  if (orderCustomStartDate.value > orderCustomEndDate.value) {
    uni.showToast({ icon: 'none', title: '开始日期不能晚于结束日期' })
    return
  }
  if (orderCustomEndDate.value > today) {
    uni.showToast({ icon: 'none', title: '结束日期不能晚于今天' })
    return
  }
  orderStartDate.value = orderCustomStartDate.value
  orderEndDate.value = orderCustomEndDate.value
  orderSelectedDateType.value = 'custom'
  orderSelectedDateLabel.value = `${orderCustomStartDate.value} 至 ${orderCustomEndDate.value}`
  showOrderCustomDate.value = false
  showOrderDatePanel.value = false
  refreshOrders()
}

const handleViewDetail = (item: OrderItem) => {
  uni.navigateTo({
    url: `/pagesMember/storeManage/storeOrderDetail?orderId=${item._id}`,
  })
}

const handlePreviewIdCard = (item: OrderItem, type: 'font' | 'back') => {
  const url = type === 'font' ? item.userInfo?.icCardFont : item.userInfo?.icCardBack
  if (!url) return
  const urls = [item.userInfo?.icCardFont, item.userInfo?.icCardBack].filter(Boolean) as string[]
  uni.previewImage({ current: url, urls })
}

onLoad(async (options) => {
  const refreshed = await refreshCurrentUser()
  if (!refreshed) return

  const routeShopId = options?.shopId || ''
  const shopIds = getManagedShopIds()
  if (!shopIds.length) {
    uni.showToast({ icon: 'none', title: '暂无关联门店' })
    return
  }

  shopId.value = routeShopId && shopIds.includes(routeShopId) ? routeShopId : shopIds[0]
  await loadManagedStores(shopIds)
  Promise.all([fetchPerformance(), orderListGet()])
})

onHide(() => {
  savedScrollTop.value = currentScrollTop.value
  shouldRestoreScroll.value = true
})

onShow(() => {
  if (!shouldRestoreScroll.value) return
  shouldRestoreScroll.value = false
  nextTick(() => {
    controlledScrollTop.value = savedScrollTop.value
  })
})

</script>

<template>
  <view class="storeManage">
    <NavHead title="门店管理" :show-back="true"></NavHead>

    <scroll-view
      class="content"
      :scroll-y="true"
      :scroll-top="controlledScrollTop"
      :enhanced="true"
      :show-scrollbar="false"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      @refresherrefresh="handleRefresh"
      @scroll="handleScroll"
      @scrolltolower="handleMore"
    >
      <view class="content-inner">
        <picker
          :value="currentStoreIndex"
          :range="managedStores"
          range-key="name"
          :disabled="managedStores.length <= 1"
          @change="handleStoreChange"
        >
          <view class="store-switcher">
            <view class="store-switcher-content">
              <text class="store-switcher-label">当前门店</text>
              <text class="store-switcher-name">
                {{ managedStores[currentStoreIndex]?.name || '门店' }}
              </text>
            </view>
            <text v-if="managedStores.length > 1" class="store-switcher-action">切换门店</text>
          </view>
        </picker>

        <view class="performance-card">
          <view class="performance-header">
            <view>
              <view class="performance-title">经营概览</view>
              <view class="performance-date">{{ startDate }} 至 {{ endDate }}</view>
            </view>
            <view class="date-trigger" @tap="showDatePanel = true">
              <text>{{ selectedDateLabel }}</text>
            </view>
          </view>

          <view v-if="performanceError" class="performance-error" @tap="fetchPerformance">
            <text>数据加载失败，点击重试</text>
          </view>
          <template v-else>
            <view class="revenue-section">
              <text class="revenue-label">已核销实收</text>
              <view v-if="performanceLoading" class="skeleton skeleton-revenue"></view>
              <view v-else class="revenue-value" :class="revenueFontClass">
                <text class="currency">¥</text>
                <text>{{ formatAmount(performance.verifiedRevenue) }}</text>
              </view>
            </view>

            <view class="metric-grid">
              <view class="metric-item">
                <view v-if="performanceLoading" class="skeleton skeleton-number"></view>
                <text v-else class="metric-value">{{ performance.verifiedOrderCount }}</text>
                <text class="metric-label">已核销订单</text>
              </view>
              <view class="metric-item">
                <view v-if="performanceLoading" class="skeleton skeleton-number"></view>
                <text v-else class="metric-value pending-value">
                  {{ performance.pendingVerificationCount }}
                </text>
                <text class="metric-label">待核销订单</text>
              </view>
              <view class="metric-item">
                <view v-if="performanceLoading" class="skeleton skeleton-number"></view>
                <text v-else class="metric-value">¥{{ formatAmount(performance.refundAmount) }}</text>
                <text class="metric-label">退款金额</text>
              </view>
            </view>

            <view class="comparison-row">
              <text>{{ comparisonText }}</text>
            </view>
          </template>
        </view>

        <view class="order-section">
          <view class="order-section-header">
            <text class="section-title">门店订单</text>
            <view class="order-header-actions">
              <view class="date-trigger order-date-trigger" @tap="showOrderDatePanel = true">
                <text>{{ orderSelectedDateLabel }}</text>
              </view>
              <text class="order-count">共 {{ orderTotal }} 单</text>
            </view>
          </view>
          <view class="status-tabs">
            <view
              v-for="item in orderStatusTabs"
              :key="item.value"
              class="status-tab-item"
              :class="{ active: currentOrderStatus === item.value }"
            @tap="handleOrderStatusTab(item.value)"
          >
            <text>{{ item.label }}</text>
          </view>
          </view>
        </view>

        <view v-if="loading && !orderList.length" class="loading">
          <text>加载中...</text>
        </view>
        <view v-else-if="hasFetched && !loading && orderList.length === 0" class="empty">
          <image
            class="empty-img"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="aspectFit"
          />
          <text class="empty-text">暂无门店订单</text>
        </view>
        <view v-else class="order-list">
          <view
            v-for="item in orderList"
            :key="item._id"
            class="order-card"
            @tap="handleViewDetail(item)"
          >
            <view class="cover-wrap">
              <image class="cover" :src="item.productInfo.cover" mode="aspectFill"></image>
              <view class="type-tag">门店</view>
            </view>
            <view class="order-info">
              <view
                v-if="item.status !== 'verified'"
                class="order-status-tag"
                :class="`is-${item.status}`"
              >
                {{ getOrderStatusLabel(item.status) }}
              </view>
              <view v-if="item.status === 'verified'" class="status">
                <image
                  src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/hx.png"
                  mode="aspectFit"
                />
              </view>
              <view class="title">{{ item.productInfo.title }}</view>
              <view v-if="item.shopInfo?.shopName" class="info-row">
                <text class="label">店名：</text>
                <text class="value">{{ item.shopInfo.shopName }}</text>
              </view>
              <view v-if="item.shopInfo?.address" class="info-row">
                <text class="label">地址：</text>
                <text class="value">{{ item.shopInfo.address }}</text>
              </view>
              <view
                v-if="item.userInfo?.icCardFont || item.userInfo?.icCardBack"
                class="id-card-wrap"
              >
                <view
                  v-if="item.userInfo?.icCardFont"
                  class="id-card-img-wrap"
                  @tap.stop="handlePreviewIdCard(item, 'font')"
                >
                  <image class="id-card-img" :src="item.userInfo.icCardFont" mode="aspectFill" />
                </view>
                <view
                  v-if="item.userInfo?.icCardBack"
                  class="id-card-img-wrap"
                  @tap.stop="handlePreviewIdCard(item, 'back')"
                >
                  <image class="id-card-img" :src="item.userInfo.icCardBack" mode="aspectFill" />
                </view>
              </view>
              <view class="price-btn-row">
                <view class="price-part">
                  <view v-if="hasAmount(item.totalAmount)" class="amount-row">
                    <text class="label">订单价格：</text>
                    <text class="price">¥{{ formatAmount(item.totalAmount) }}</text>
                  </view>
                  <view v-if="hasAmount(item.payAmount)" class="amount-row">
                    <text class="label">实付：</text>
                    <text class="price paid-price">¥{{ formatAmount(item.payAmount) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="orderList.length && (loading || !finish)" class="load-more-tip">
          <text v-if="loading">加载中...</text>
          <text v-else>上拉加载更多</text>
        </view>
        <view class="bottom-placeholder"></view>
      </view>
    </scroll-view>

    <view v-if="showDatePanel" class="date-mask" @tap="showDatePanel = false">
      <view class="date-panel" @tap.stop>
        <view class="panel-header">
          <text class="panel-title">选择统计日期</text>
          <text class="panel-close" @tap="showDatePanel = false">×</text>
        </view>
        <view class="quick-options">
          <view
            v-for="item in dateRangeOptions"
            :key="item.value"
            class="quick-option"
            :class="{
              active:
                item.value === 'custom'
                  ? showCustomDate || selectedDateType === 'custom'
                  : !showCustomDate && selectedDateType === item.value,
            }"
            @tap="selectDateRange(item)"
          >
            {{ item.label }}
          </view>
        </view>
        <view v-if="showCustomDate" class="custom-date">
          <view class="date-picker-row">
            <picker
              mode="date"
              :value="customStartDate"
              :end="today"
              @change="handleStartDateChange"
            >
              <view class="date-picker-value">
                <text class="picker-label">开始日期</text>
                <text>{{ customStartDate }}</text>
              </view>
            </picker>
            <text class="date-separator">至</text>
            <picker
              mode="date"
              :value="customEndDate"
              :start="customStartDate"
              :end="today"
              @change="handleEndDateChange"
            >
              <view class="date-picker-value">
                <text class="picker-label">结束日期</text>
                <text>{{ customEndDate }}</text>
              </view>
            </picker>
          </view>
          <view class="confirm-date" @tap="confirmCustomDate">确认</view>
        </view>
      </view>
    </view>

    <view
      v-if="showOrderDatePanel"
      class="date-mask"
      @tap="showOrderDatePanel = false"
    >
      <view class="date-panel" @tap.stop>
        <view class="panel-header">
          <text class="panel-title">选择订单日期</text>
          <text class="panel-close" @tap="showOrderDatePanel = false">×</text>
        </view>
        <view class="quick-options">
          <view
            v-for="item in orderDateRangeOptions"
            :key="item.value"
            class="quick-option"
            :class="{
              active:
                item.value === 'custom'
                  ? showOrderCustomDate || orderSelectedDateType === 'custom'
                  : !showOrderCustomDate && orderSelectedDateType === item.value,
            }"
            @tap="selectOrderDateRange(item)"
          >
            {{ item.label }}
          </view>
        </view>
        <view v-if="showOrderCustomDate" class="custom-date">
          <view class="date-picker-row">
            <picker
              mode="date"
              :value="orderCustomStartDate"
              :end="today"
              @change="handleOrderStartDateChange"
            >
              <view class="date-picker-value">
                <text class="picker-label">开始日期</text>
                <text>{{ orderCustomStartDate }}</text>
              </view>
            </picker>
            <text class="date-separator">至</text>
            <picker
              mode="date"
              :value="orderCustomEndDate"
              :start="orderCustomStartDate"
              :end="today"
              @change="handleOrderEndDateChange"
            >
              <view class="date-picker-value">
                <text class="picker-label">结束日期</text>
                <text>{{ orderCustomEndDate }}</text>
              </view>
            </picker>
          </view>
          <view class="confirm-date" @tap="confirmOrderCustomDate">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.storeManage {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  min-height: 0;
}

.content-inner {
  padding: 24rpx;
}

.store-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  margin-bottom: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
}

.store-switcher-content {
  display: flex;
  align-items: center;
  min-width: 0;
}

.store-switcher-label {
  flex-shrink: 0;
  margin-right: 24rpx;
  font-size: 24rpx;
  color: $qs-font-dec;
}

.store-switcher-name {
  font-size: 30rpx;
  font-weight: bold;
  color: $qs-font-title;
  @include ellipsis(1);
}

.store-switcher-action {
  flex-shrink: 0;
  margin-left: 24rpx;
  font-size: 24rpx;
  color: color.adjust($qs-brandColor, $lightness: -28%);
}

.performance-card {
  padding: 30rpx 28rpx 26rpx;
  color: $qs-font-title;
  background-color: $qs-card-bg;
  border-radius: 30rpx;
  @include customShadow();
}

.performance-header,
.order-section-header,
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.performance-title {
  font-size: 32rpx;
  font-weight: bold;
}

.performance-date {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $qs-font-dec;
}

.date-trigger {
  display: flex;
  align-items: center;
  max-width: 330rpx;
  padding: 12rpx 18rpx;
  font-size: 24rpx;
  color: $qs-font-title;
  background-color: rgba($qs-brandColor, 0.16);
  border-radius: 26rpx;

  text:first-child {
    @include ellipsis(1);
  }
}

.revenue-section {
  padding: 38rpx 0 32rpx;
  text-align: left;
}

.revenue-label {
  font-size: 25rpx;
  color: $qs-font-dec2;
}

.revenue-value {
  display: flex;
  align-items: baseline;
  margin-top: 10rpx;
  font-size: 54rpx;
  line-height: 1.2;
  font-weight: bold;
  color: $qs-font-title;
  white-space: nowrap;

  &.is-medium {
    font-size: 48rpx;
  }

  &.is-small {
    font-size: 38rpx;
  }

  .currency {
    margin-right: 8rpx;
    font-size: 34rpx;
    font-weight: 700;
  }
}

.metric-grid {
  display: flex;
  padding: 28rpx 0 8rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
}

.metric-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 8rpx;
    right: 0;
    width: 1rpx;
    height: 54rpx;
    background: rgba(0, 0, 0, 0.07);
  }
}

.metric-value {
  max-width: 100%;
  font-size: 29rpx;
  font-weight: bold;
  color: $qs-font-title;
  @include ellipsis(1);
}

.pending-value {
  color: color.adjust($qs-brandColor, $lightness: -28%);
}

.metric-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $qs-font-dec;
}

.comparison-row {
  margin-top: 22rpx;
  font-size: 23rpx;
  color: $qs-font-dec;
}

.performance-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260rpx;
  font-size: 27rpx;
  color: #8a3e24;
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f2f2f2,
    #fafafa,
    #f2f2f2
  );
  background-size: 200% 100%;
  border-radius: 12rpx;
  animation: skeleton-loading 1.4s infinite;
}

.skeleton-revenue {
  width: 320rpx;
  height: 66rpx;
  margin-top: 12rpx;
}

.skeleton-number {
  width: 74rpx;
  height: 34rpx;
  margin-bottom: 5rpx;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.order-section {
  padding: 28rpx 24rpx 20rpx;
  margin-top: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $qs-font-title;
}

.order-count {
  font-size: 24rpx;
  color: $qs-font-dec;
  white-space: nowrap;
}

.order-header-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.order-date-trigger {
  flex-shrink: 0;
  padding: 10rpx 18rpx;
}

.status-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 28rpx;
}

.status-tab-item {
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 14rpx;
  font-size: 25rpx;
  color: $qs-font-dec;
  font-weight: 500;

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
      background-color: $qs-brandColor;
      border-radius: 3rpx;
      transform: translateX(-50%);
    }
  }
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.empty-img {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 24rpx;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-top: 24rpx;
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
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 16rpx;

  .cover {
    width: 100%;
    height: 100%;
  }

  .type-tag {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 6rpx 16rpx;
    font-size: 20rpx;
    color: #fff;
    background: linear-gradient(
      135deg,
      $qs-brandColor,
      color.adjust($qs-brandColor, $lightness: -10%)
    );
    border-radius: 16rpx 0 16rpx 0;
  }
}

.order-info {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;

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
    font-size: 22rpx;
    line-height: 1.4;
    color: #fff;
    background-color: $qs-brandColor;
    border-radius: 18rpx;

    &.is-paid {
      background-color: #ff9f1c;
    }

    &.is-cancelled {
      background-color: #999;
    }

    &.is-refunding {
      background-color: #f07b3f;
    }

    &.is-refunded {
      background-color: #8a78b5;
    }
  }

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 4rpx;
    font-size: 28rpx;

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

  .id-card-wrap {
    display: flex;
    gap: 16rpx;
    margin: 12rpx 0 8rpx;
  }

  .id-card-img-wrap {
    width: 120rpx;
    height: 80rpx;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 8rpx;
  }

  .id-card-img {
    width: 100%;
    height: 100%;
  }

  .price-part {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4rpx;
  }

  .amount-row {
    display: flex;
    align-items: center;
  }

  .price-btn-row .label {
    font-size: 28rpx;
    color: $qs-font-dec2;
  }

  .price {
    font-size: 28rpx;
    font-weight: bold;
    color: #ff3b3b;
  }

  .paid-price {
    color: color.adjust($qs-brandColor, $lightness: -28%);
  }
}

.load-more-tip {
  padding: 24rpx 0;
  font-size: 24rpx;
  color: $qs-font-dec;
  text-align: center;
}

.bottom-placeholder {
  height: 60rpx;
}

.date-mask {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.42);
}

.date-panel {
  width: 100%;
  padding: 32rpx 28rpx calc(34rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
}

.panel-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $qs-font-title;
}

.panel-close {
  padding: 0 8rpx;
  font-size: 48rpx;
  line-height: 1;
  color: $qs-font-dec;
}

.quick-options {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  margin-top: 30rpx;
}

.quick-option {
  width: calc((100% - 36rpx) / 3);
  padding: 18rpx 0;
  font-size: 26rpx;
  color: $qs-font-title;
  text-align: center;
  background: #f6f6f6;
  border: 2rpx solid transparent;
  border-radius: 16rpx;

  &.active {
    font-weight: bold;
    background: rgba($qs-brandColor, 0.2);
    border-color: $qs-brandColor;
  }
}

.custom-date {
  margin-top: 30rpx;
}

.date-picker-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  picker {
    flex: 1;
  }
}

.date-picker-value {
  display: flex;
  flex-direction: column;
  padding: 18rpx;
  font-size: 27rpx;
  color: $qs-font-title;
  background: #f6f6f6;
  border-radius: 16rpx;
}

.picker-label {
  margin-bottom: 8rpx;
  font-size: 21rpx;
  color: $qs-font-dec;
}

.date-separator {
  margin: 0 18rpx;
  color: $qs-font-dec;
}

.confirm-date {
  padding: 22rpx 0;
  margin-top: 28rpx;
  font-size: 29rpx;
  font-weight: bold;
  color: #3c3214;
  text-align: center;
  background: $qs-brandColor;
  border-radius: 44rpx;
}
</style>
