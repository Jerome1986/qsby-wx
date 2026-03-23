<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import type { OrderItem, PageOrderStatus } from '@/types/OrderItem'
import type { CheckInExternalItem } from '@/types/store'
import { checkInExternalFindByShop } from '@/api/store'
import { orderFindByShop } from '@/api/order'
import { formatTimestamp } from '@/utils/generateMonth'

const shopId = ref('')

// 一级 Tab：数据来源
const sourceTabs = [
  { label: '小程序订单', value: 'order' },
  { label: '入住信息', value: 'external' },
] as const

type SourceTabValue = (typeof sourceTabs)[number]['value']

const currentSource = ref<SourceTabValue>('order')
const handleSourceTab = (value: SourceTabValue) => {
  currentSource.value = value
  reset()
  if (value === 'order') {
    orderListGet()
  } else {
    externalListGet()
  }
}

// 二级 Tab：订单状态（小程序订单）
const orderStatusTabs = [
  { label: '全部', value: 'all' },
  // { label: '待付款', value: 'pending' },
  { label: '待核销', value: 'paid' },
  { label: '已核销', value: 'verified' },
  { label: '退款/售后', value: 'refunded' },
] as const

const currentOrderStatus = ref<PageOrderStatus>('all')

const handleOrderStatusTab = (value: PageOrderStatus) => {
  currentOrderStatus.value = value
  reset()
  orderListGet()
}

// 小程序订单
const orderList = ref<OrderItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finish = ref(false)
const hasFetched = ref(false)

/** 重置分页与列表状态 */
const reset = () => {
  pageNum.value = 1
  orderList.value = []
  externalList.value = []
  finish.value = false
  loading.value = false
  hasFetched.value = false
}

/** 获取门店订单列表（分页） */
const orderListGet = async () => {
  if (!shopId.value || finish.value || loading.value || currentSource.value !== 'order')
    return
  loading.value = true
  try {
    const res = await orderFindByShop(shopId.value, pageNum.value, pageSize.value)
    let list = res.data.list
    if (currentOrderStatus.value !== 'all') {
      list = list.filter((o) => o.status === currentOrderStatus.value)
    }
    orderList.value.push(...list)
    if (pageNum.value < res.data.totalPage) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } catch (err) {
    uni.showToast({ icon: 'none', title: '获取订单失败' })
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

// 外部入住
const externalList = ref<CheckInExternalItem[]>([])

/** 获取外部入住列表（分页） */
const externalListGet = async () => {
  if (!shopId.value || finish.value || loading.value || currentSource.value !== 'external')
    return
  loading.value = true
  try {
    const res = await checkInExternalFindByShop(
      shopId.value,
      pageNum.value,
      pageSize.value,
    )

    const list = res.data?.list ?? []
    externalList.value.push(...list)
    if (pageNum.value < (res.data?.totalPage ?? 1)) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } catch (err) {
    uni.showToast({ icon: 'none', title: '获取入住记录失败' })
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

/** 上拉加载更多 */
const handleMore = () => {
  if (finish.value) return
  if (currentSource.value === 'order') orderListGet()
  else externalListGet()
}

const handleViewDetail = (item: OrderItem) => {
  uni.navigateTo({
    url: `/pagesMember/storeManage/storeOrderDetail?orderId=${item._id}`,
  })
}

/** 获取外部入住记录 ID（兼容 MongoDB ObjectId 序列化） */
const getExternalId = (item: CheckInExternalItem) => {
  const id = (item as CheckInExternalItem & { _id?: string | { $oid?: string } })._id
  if (typeof id === 'string') return id
  if (id && typeof id === 'object' && '$oid' in id) return (id as { $oid: string }).$oid
  return String(id ?? '')
}

const handleViewExternalDetail = (item: CheckInExternalItem) => {
  uni.navigateTo({
    url: `/pagesMember/storeManage/storeExternalCheckInDetail?id=${getExternalId(item)}`,
  })
}

/** 店长修改外部入住状态（核销/撤销核销） */
/** 预览身份证图片 */
const handlePreviewIdCard = (item: OrderItem, type: 'font' | 'back') => {
  const url = type === 'font' ? item.userInfo?.icCardFont : item.userInfo?.icCardBack
  if (url) {
    const urls = [item.userInfo?.icCardFont, item.userInfo?.icCardBack].filter(
      Boolean,
    ) as string[]
    uni.previewImage({ current: url, urls })
  }
}

/** 预览外部入住身份证 */
const handlePreviewExternalIdCard = (
  item: CheckInExternalItem,
  type: 'font' | 'back',
) => {
  const url = type === 'font' ? item.icCardFont : item.icCardBack
  if (url) {
    uni.previewImage({ current: url, urls: [item.icCardFont, item.icCardBack] })
  }
}

onLoad((options) => {
  shopId.value = options?.shopId || ''
  if (!shopId.value) {
    uni.showToast({ icon: 'none', title: '缺少门店信息' })
  }
})

onShow(() => {
  if (shopId.value) {
    reset()
    if (currentSource.value === 'order') orderListGet()
    else externalListGet()
  }
})
</script>

<template>
  <view class="storeManage">
    <NavHead title="门店管理" :show-back="true"></NavHead>

    <!-- 筛选区域 -->
    <view class="filter-wrap">
      <view class="filter-section">
        <!-- 一级 Tab：数据来源 -->
        <scroll-view class="type-tabs-scroll" :scroll-x="true" enable-flex :show-scrollbar="false">
          <view class="type-tabs">
            <view v-for="item in sourceTabs" :key="item.value" class="type-tab-item"
              :class="{ active: currentSource === item.value }" @tap="handleSourceTab(item.value)">
              {{ item.label }}
            </view>
          </view>
        </scroll-view>
        <!-- 二级 Tab：订单状态（仅小程序订单） -->
        <view v-if="currentSource === 'order'" class="status-tabs">
          <view v-for="item in orderStatusTabs" :key="item.value" class="status-tab-item"
            :class="{ active: currentOrderStatus === item.value }" @tap="handleOrderStatusTab(item.value)">
            {{ item.label }}
          </view>
        </view>
      </view>
    </view>

    <!-- 列表 -->
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <view class="content-inner">
        <!-- 小程序订单列表 -->
        <template v-if="currentSource === 'order'">
          <view v-if="loading && !orderList.length" class="loading">
            <text>加载中...</text>
          </view>
          <view v-else-if="hasFetched && !loading && orderList.length === 0" class="empty">
            <image class="empty-img"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png" mode="aspectFit" />
            <text class="empty-text">暂无门店订单</text>
          </view>
          <view v-else class="order-list">
            <view class="order-card" v-for="item in orderList" :key="item._id" @tap="handleViewDetail(item)">
              <view class="cover-wrap">
                <image class="cover" :src="item.productInfo.cover" mode="aspectFill"></image>
                <view class="type-tag">门店</view>
              </view>
              <view class="order-info">
                <view class="status" v-if="item.status === 'verified'">
                  <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/hx.png"
                    mode="aspectFit" />
                </view>
                <view class="title">{{ item.productInfo.title }}</view>
                <view class="info-row" v-if="item.shopInfo?.shopName">
                  <text class="label">店名：</text>
                  <text class="value">{{ item.shopInfo.shopName }}</text>
                </view>
                <view class="info-row" v-if="item.shopInfo?.address">
                  <text class="label">地址：</text>
                  <text class="value">{{ item.shopInfo.address }}</text>
                </view>
                <view class="id-card-wrap" v-if="item.userInfo?.icCardFont || item.userInfo?.icCardBack">
                  <view v-if="item.userInfo?.icCardFont" class="id-card-img-wrap"
                    @tap.stop="() => handlePreviewIdCard(item, 'font')">
                    <image class="id-card-img" :src="item.userInfo.icCardFont" mode="aspectFill" />
                  </view>
                  <view v-if="item.userInfo?.icCardBack" class="id-card-img-wrap"
                    @tap.stop="() => handlePreviewIdCard(item, 'back')">
                    <image class="id-card-img" :src="item.userInfo.icCardBack" mode="aspectFill" />
                  </view>
                </view>
                <view class="price-btn-row">
                  <view class="price-part">
                    <text class="label">订单价格：</text>
                    <text class="price">￥{{ item.payAmount.toFixed(2) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 外部入住列表 -->
        <template v-else>
          <view v-if="loading && !externalList.length" class="loading">
            <text>加载中...</text>
          </view>
          <view v-else-if="hasFetched && !loading && externalList.length === 0" class="empty">
            <image class="empty-img"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png" mode="aspectFit" />
            <text class="empty-text">暂无外部入住记录</text>
          </view>
          <view v-else class="order-list">
            <view class="order-card external-card" v-for="item in externalList" :key="getExternalId(item)"
              @tap="handleViewExternalDetail(item)">
              <view class="order-info">
                <view class="title">{{ item.nickname || '未填写姓名' }}</view>
                <view class="info-row" v-if="item.phone">
                  <text class="label">手机：</text>
                  <text class="value">{{ item.phone }}</text>
                </view>
                <view class="info-row" v-if="item.roomNumber">
                  <text class="label">房间号：</text>
                  <text class="value">{{ item.roomNumber }}</text>
                </view>
                <view class="info-row" v-if="item.source">
                  <text class="label">来源：</text>
                  <text class="value">{{ { douyin: '抖音', miniprogram: '小程序', offline: '线下门店' }[item.source] ?? item.source }}</text>
                </view>
                <view class="info-row" v-if="item.createdAt">
                  <text class="label">办理时间：</text>
                  <text class="value">{{ formatTimestamp(item.createdAt, 2) }}</text>
                </view>
                <view class="id-card-wrap">
                  <view v-if="item.icCardFont" class="id-card-img-wrap"
                    @tap.stop="() => handlePreviewExternalIdCard(item, 'font')">
                    <image class="id-card-img" :src="item.icCardFont" mode="aspectFill" />
                  </view>
                  <view v-if="item.icCardBack" class="id-card-img-wrap"
                    @tap.stop="() => handlePreviewExternalIdCard(item, 'back')">
                    <image class="id-card-img" :src="item.icCardBack" mode="aspectFill" />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>

        <view class="load-more-tip" v-if="(orderList.length || externalList.length) && (loading || !finish)">
          <text v-if="loading">加载中...</text>
          <text v-else>上拉加载更多</text>
        </view>
        <view class="bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.storeManage {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.filter-wrap {
  padding: 24rpx;
}

.filter-section {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
}

/* 一级 Tab：数据来源（orderManage 风格） */
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

/* 二级 Tab：订单/入住状态 */
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

.content {
  flex: 1;
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
    background: linear-gradient(135deg, $qs-brandColor, darken($qs-brandColor, 10%));
    border-radius: 16rpx 0 16rpx 0;
    z-index: 1;
  }
}

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
    margin-bottom: 8rpx;
    font-weight: bold;
    color: $qs-font-title;
    @include ellipsis(1);
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

  .id-card-wrap {
    display: flex;
    gap: 16rpx;
    margin-top: 12rpx;
    margin-bottom: 8rpx;

    .id-card-img-wrap {
      width: 120rpx;
      height: 80rpx;
      border-radius: 8rpx;
      overflow: hidden;
      background-color: #f5f5f5;
    }

    .id-card-img {
      width: 100%;
      height: 100%;
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

      .status-text {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-brandColor;
      }
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
