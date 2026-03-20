<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import type { OrderItem, PageOrderStatus } from '@/types/OrderItem'
import { orderFindByShop } from '@/api/order'

const shopId = ref('')

// 订单状态 Tab（店长管理门店订单）
const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待核销', value: 'paid' },
  { label: '已核销', value: 'verified' },
  { label: '退款/售后', value: 'refunded' },
] as const

const currentStatus = ref<PageOrderStatus>('all')
const handleStatusTab = (value: PageOrderStatus) => {
  currentStatus.value = value
  reset()
  orderListGet()
}

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
  finish.value = false
  loading.value = false
  hasFetched.value = false
}

/** 获取门店订单列表（分页） */
const orderListGet = async () => {
  if (!shopId.value || finish.value || loading.value) return
  loading.value = true
  try {
    const res = await orderFindByShop(shopId.value, pageNum.value, pageSize.value)
    let list = res.data.list
    if (currentStatus.value !== 'all') {
      list = list.filter((o) => o.status === currentStatus.value)
    }
    console.log('list', list)

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

/** 上拉加载更多 */
const handleMore = () => {
  if (!finish.value) orderListGet()
}

const handleViewDetail = (item: OrderItem) => {
  uni.navigateTo({
    url: `/pagesMember/storeManage/storeOrderDetail?orderId=${item._id}`,
  })
}

/** 预览身份证图片 */
const handlePreviewIdCard = (item: OrderItem, type: 'font' | 'back') => {
  const url = type === 'font' ? item.userInfo?.icCardFont : item.userInfo?.icCardBack
  if (url) {
    const urls = [item.userInfo?.icCardFont, item.userInfo?.icCardBack].filter(Boolean) as string[]
    uni.previewImage({ current: url, urls })
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
    orderListGet()
  }
})
</script>

<template>
  <view class="storeManage">
    <NavHead title="门店管理" :show-back="true"></NavHead>

    <!-- 筛选区域 -->
    <view class="filter-wrap">
      <view class="filter-section">
        <view class="status-tabs">
          <view v-for="item in statusTabs" :key="item.value" class="status-tab-item"
            :class="{ active: currentStatus === item.value }" @tap="handleStatusTab(item.value)">
            {{ item.label }}
          </view>
        </view>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <view class="content-inner">
        <view v-if="loading && !orderList.length" class="loading">
          <text>加载中...</text>
        </view>
        <view v-else-if="hasFetched && !loading && orderList.length === 0" class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="aspectFit" />
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
                <view
                  v-if="item.userInfo?.icCardFont"
                  class="id-card-img-wrap"
                  @tap.stop="() => handlePreviewIdCard(item, 'font')"
                >
                  <image class="id-card-img" :src="item.userInfo.icCardFont" mode="aspectFill" />
                </view>
                <view
                  v-if="item.userInfo?.icCardBack"
                  class="id-card-img-wrap"
                  @tap.stop="() => handlePreviewIdCard(item, 'back')"
                >
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

.status-tabs {
  display: flex;
  align-items: center;
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
