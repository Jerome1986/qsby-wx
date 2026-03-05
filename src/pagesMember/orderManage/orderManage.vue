<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { OrderStatus, OrderType } from '@/types/OrderItem'

// 一级Tab：订单类型
const orderTypes = [
  { label: '全部', value: '' },
  { label: '趣哪游', value: 'play' },
  { label: '趣活动', value: 'activity' },
  { label: '商城', value: 'shop' },
  { label: '项目', value: 'projuect' },
  {label:'积分',value:'score'}
] as const

const currentOrderType = ref<OrderType | ''>('')
const handleTypeTab = (value: OrderType | '') => {
  currentOrderType.value = value
  fetchOrders()
}

// 二级Tab：订单状态
const statusTabs = [
  { label: '全部', value: '' },
  { label: '待核销', value: 'paid' },
  { label: '已核销', value: 'verified' },
  { label: '退款/售后', value: 'refunding' },
] as const

const currentStatus = ref<OrderStatus | ''>('')
const handleStatusTab = (value: OrderStatus | '') => {
  currentStatus.value = value
  fetchOrders()
}

// 订单列表
interface OrderItem {
  id: string
  orderType: OrderType
  title: string
  cover: string
  // 商城类型
  shopName?: string
  address?: string
  price?: number
  // 活动/行程类型
  activityDate?: string
  storeName?: string
  activityAddress?: string
  signUpFee?: number
  // 商城积分类型
  points?: number
  status: OrderStatus
}

const orderList = ref<OrderItem[]>([])
const loading = ref(false)

// 模拟获取订单列表
const fetchOrders = () => {
  loading.value = true
  setTimeout(() => {
    orderList.value = [
      {
        id: '1',
        orderType: 'shop',
        title: '超辣火锅4人套餐',
        cover: '/static/images/travel.png',
        shopName: '成都老火锅',
        address: '四川升成都春熙路1号',
        price: 126.0,
        status: 'paid',
      },
      {
        id: '2',
        orderType: 'activity',
        title: '12.27体验冬日里的庐山2天1晚',
        cover: '/static/images/travel.png',
        activityDate: '2025-12-27 12:00:00',
        storeName: '门店名称旅游名称（某公司）',
        activityAddress: '地址文案地址文案地址文案地址文案地址',
        signUpFee: 2.0,
        status: 'paid',
      },
      {
        id: '3',
        orderType: 'play',
        title: '12.27体验冬日里的庐山2天1晚',
        cover: '/static/images/travel.png',
        activityDate: '2025-12-27 12:00:00',
        storeName: '门店名称旅游名称（某公司）',
        activityAddress: '地址文案地址文案地址文案地址文案地址',
        signUpFee: 2.0,
        status: 'paid',
      },
      {
        id: '4',
        orderType: 'shop',
        title: '湖景大床房',
        cover: '/static/images/travel.png',
        shopName: '门店名称旅游名称（某公司）',
        address: '地址文案地址文案地址文案地址文案地址',
        points: 500,
        status: 'paid',
      },
    ]
    loading.value = false
  }, 300)
}

// 查看订单详情
const handleViewDetail = (item: OrderItem) => {
  uni.navigateTo({
    url: `/pagesMember/orderDetail/orderDetail?id=${item.id}&type=${item.orderType}`,
  })
}

// 申请退款（待核销订单）
const handleRefund = (item: OrderItem) => {
  uni.showModal({
    title: '申请退款',
    content: `确定要申请退款「${item.title}」吗？`,
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
    play: '趣哪游',
    activity: '趣活动',
    shop: '门店',
    projuect: '项目',
    score: '积分',
  }
  return map[type] || ''
}

onLoad(() => {
  fetchOrders()
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
          <view
            v-for="item in orderTypes"
            :key="item.value"
            class="type-tab-item"
            :class="{ active: currentOrderType === item.value }"
            @tap="handleTypeTab(item.value)"
          >
            {{ item.label }}
          </view>
        </view>
      </scroll-view>
      <!-- 二级Tab：订单状态 -->
      <view class="status-tabs">
        <view
          v-for="item in statusTabs"
          :key="item.value"
          class="status-tab-item"
          :class="{ active: currentStatus === item.value }"
          @tap="handleStatusTab(item.value)"
        >
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
        <image class="empty-img" src="/static/images/noAny.png" mode="aspectFit"></image>
        <text class="empty-text">暂无订单</text>
      </view>
      <view v-else class="order-list">
        <view
          class="order-card"
          v-for="item in orderList"
          :key="item.id"
          @tap="handleViewDetail(item)"
        >
          <!-- 封面图 -->
          <view class="cover-wrap">
            <image class="cover" :src="item.cover" mode="aspectFill"></image>
            <view class="type-tag">{{ getOrderTypeLabel(item.orderType) }}</view>
          </view>
          <!-- 订单信息：标题、每条信息、价格+按钮 各为独立 view -->
          <view class="order-info">
            <view class="title">{{ item.title }}</view>
            <!-- 商城类型 -->
            <template v-if="item.orderType === 'shop'">
              <view class="info-row" v-if="item.shopName">
                <text class="label">店名：</text>
                <text class="value">{{ item.shopName }}</text>
              </view>
              <view class="info-row" v-if="item.address">
                <text class="label">地址：</text>
                <text class="value">{{ item.address }}</text>
              </view>
            </template>
            <!-- 活动/行程类型 -->
            <template v-else>
              <view class="info-row" v-if="item.activityDate">
                <text class="label">{{ item.orderType === 'play' ? '行程日期：' : '活动日期：' }}</text>
                <text class="value">{{ item.activityDate }}</text>
              </view>
              <view class="info-row" v-if="item.storeName">
                <text class="label">{{ item.orderType === 'play' ? '行程门店：' : '活动门店：' }}</text>
                <text class="value">{{ item.storeName }}</text>
              </view>
              <view class="info-row" v-if="item.activityAddress">
                <text class="label">{{ item.orderType === 'play' ? '行程地址：' : '活动地址：' }}</text>
                <text class="value">{{ item.activityAddress }}</text>
              </view>
            </template>
            <!-- 价格 + 按钮 同一 view -->
            <view class="price-btn-row">
              <view class="price-part">
                <template v-if="item.orderType === 'shop'">
                  <template v-if="item.price">
                    <text class="label">订单价格：</text>
                    <text class="price">￥{{ item.price.toFixed(2) }}</text>
                  </template>
                  <template v-else-if="item.points">
                    <text class="label">积分数量：</text>
                    <text class="points">{{ item.points }}积分</text>
                  </template>
                </template>
                <template v-else>
                  <template v-if="item.signUpFee !== undefined">
                    <text class="label">报名金额：</text>
                    <text class="price">￥{{ item.signUpFee.toFixed(2) }}</text>
                  </template>
                </template>
              </view>
              <view class="btn-wrap" v-if="item.status === 'paid'">
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
  flex: 1;
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
