<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import type { OrderItem, OrderType, PageOrderStatus, PageOrderType } from '@/types/OrderItem'
import { orderFindAll } from '@/api/order'
import { useUserStore } from '@/stores'


// store
const userStore = useUserStore()

// 一级Tab：订单类型
const orderTypes = [
  { label: '全部', value: 'all' },
  { label: '趣哪游', value: 'trip' },
  { label: '趣活动', value: 'activity' },
  { label: '商城', value: 'shop' },
  { label: '项目', value: 'project' },
] as const

const currentOrderType = ref<PageOrderType>('all')
const handleTypeTab = (value: PageOrderType) => {
  currentOrderType.value = value
  fetchOrders(currentOrderType.value, currentStatus.value)
}

// 二级Tab：订单状态
const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待核销', value: 'paid' },
  { label: '已核销', value: 'verified' },
  { label: '退款/售后', value: 'refunded' },
] as const

// 当前订单状态
const currentStatus = ref<PageOrderStatus>('all')
const handleStatusTab = (value: PageOrderStatus) => {
  currentStatus.value = value
  fetchOrders(currentOrderType.value, currentStatus.value)
}


// 获取订单列表
const orderList = ref<OrderItem[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false)
// TODO: 分页查询
const fetchOrders = async (orderType: PageOrderType, orderStatus: PageOrderStatus) => {
  loading.value = true
  const openid = userStore.profile?.openid as string
  console.log('参数', orderType, orderStatus)

  const res = await orderFindAll(orderType, orderStatus, openid, pageNum.value, pageSize.value)
  console.log(res)

  orderList.value = res.data.list
  loading.value = false
}

// 查看订单详情
const handleViewDetail = (item: OrderItem) => {
  uni.navigateTo({
    url: `/pagesMember/orderDetail/orderDetail?orderId=${item._id}&type=${item.orderType}`,
  })
}

// 申请退款（待核销订单）
const handleRefund = (item: OrderItem) => {
  uni.showModal({
    title: '申请退款',
    content: `确定要申请退款吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用退款 API
        uni.showToast({ icon: 'none', title: '退款申请已提交' })
      }
    },
  })
}

// 获取订单类型标签
const getOrderTypeLabel = (type: OrderType) => {
  const map: Record<OrderType, string> = {
    trip: '趣哪游',
    activity: '趣活动',
    shop: '门店',
    project: '项目',
  }
  return map[type] || ''
}

onLoad((options) => {
  if (options?.orderStatus) {
    currentStatus.value = options?.orderStatus
  }
})

onShow(() => {
  fetchOrders(currentOrderType.value, currentStatus.value)
})
</script>

<template>
  <view class="orderManage">
    <NavHead title="我的订单" :show-back="true"></NavHead>

    <!-- 筛选区域 -->
    <view class="filter-section">
      <!-- 一级Tab：订单类型 -->
      <scroll-view class="type-tabs-scroll" :scroll-x="true" enable-flex :show-scrollbar="false">
        <view class="type-tabs">
          <view v-for="item in orderTypes" :key="item.value" class="type-tab-item"
            :class="{ active: currentOrderType === item.value }" @tap="handleTypeTab(item.value)">
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

    <!-- 订单列表 -->
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
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
            <view class="type-tag">{{ getOrderTypeLabel(item.orderType) }}</view>
          </view>
          <!-- 订单信息：标题、每条信息、价格+按钮 各为独立 view -->
          <view class="order-info">
            <!-- 已核销印章 -->
            <view class="status" v-if="item.status === 'verified'">
              <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/hx.png"
                mode="aspectFit" />
            </view>
            <view class="title">{{ item.productInfo.title }}</view>
            <!-- 门店类型 -->
            <template>
              <view class="info-row" v-if="item.orderType !== 'shop'">
                <text class="label">{{ item.orderType === 'trip' ? '行程日期：' : '活动日期：' }}</text>
                <text class="value">{{ item.productInfo.time }}</text>
              </view>
              <view class="info-row" v-if="item.productInfo.address_name">
                <text class="label">店名：</text>
                <text class="value">{{ item.productInfo.address_name }}</text>
              </view>
              <view class="info-row" v-if="item.productInfo.event_address">
                <text class="label">地址：</text>
                <text class="value">{{ item.productInfo.event_address }}</text>
              </view>
            </template>

            <!-- 价格 + 按钮 同一 view -->
            <view class="price-btn-row">
              <view class="price-part">
                <template v-if="item.orderType === 'shop'">
                  <template>
                    <text class="label">订单价格：</text>
                    <text class="price">￥{{ item.payAmount.toFixed(2) }}</text>
                  </template>
                </template>
                <template v-else>
                  <template>
                    <text class="label">报名金额：</text>
                    <text class="price">￥{{ item.payAmount.toFixed(2) }}</text>
                  </template>
                </template>
              </view>
              <view class="btn-wrap" v-if="item.status === 'paid' && item.discountType !== 'voucher'">
                <view class="btn refund-btn" @tap.stop="handleRefund(item)">退款</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-placeholder"></view>
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
  margin: 0 24rpx 24rpx;
  padding: 24rpx;
  background-color: #ffffff;
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
  padding-bottom: 8rpx;
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
  background-color: #ffffff;
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

    .btn-wrap {
      flex-shrink: 0;

      .btn {
        padding: 8rpx 24rpx;
        background-color: rgba(#ff3b3b, 0.1);
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #ff3b3b;
      }
    }
  }
}

.bottom-placeholder {
  height: 60rpx;
}
</style>
