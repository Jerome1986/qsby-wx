<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info'
import type { OrderItem, OrderType } from '@/types/OrderItem'
import { orderFindOne, orderPay, orderCancel } from '@/api/order'
import { useUserStore, useOrderStore } from '@/stores'


// store
const userStore = useUserStore()
const orderStore = useOrderStore()

// 订单类型标签（积分为独立模块，不在此共用）
const typeLabels: Record<OrderType, string> = {
  play: '趣哪游',
  activity: '趣活动',
  shop: '门店',
  project: '项目',
}

const orderId = ref('')
const orderType = ref<OrderType>('play')

const orderDetail = ref<OrderItem>()
const orderDetailGet = async (orderId: string) => {
  const res = await orderFindOne(userStore.profile?.openid as string, orderId)
  console.log(res)

  orderDetail.value = res.data
}

// 是否显示发起人（行程、活动、项目）
const showInitiator = computed(() =>
  ['play', 'activity', 'project', 'shop'].includes(orderType.value)
)

// 是否显示报名人（行程、活动、项目）
const showRegistrant = computed(() =>
  ['play', 'activity', 'project', 'shop'].includes(orderType.value)
)

// 复制券号
// const handleCopyCode = () => {
//   const code = orderDetail.value.couponCode?.replace(/\s/g, '') || ''
//   uni.setClipboardData({
//     data: code,
//     success: () => uni.showToast({ title: '已复制', icon: 'success' }),
//   })
// }

// 拨打电话
const handleCall = () => {
  const phone = orderDetail.value?.initiatorInfo.mobile || ''
  if (phone) uni.makePhoneCall({ phoneNumber: phone })
}

// 申请退款
const handleRefund = () => {
  uni.showModal({
    title: '申请退款',
    content: `确定要申请退款吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ icon: 'none', title: '退款申请已提交' })
      }
    },
  })
}

// 取消订单（待付款）
const handleCancelOrder = () => {
  const order = orderDetail.value
  if (!order || order.status !== 'pending') return

  const openid = userStore.profile?.openid
  if (!openid) return

  uni.showModal({
    title: '取消订单',
    content: '确定要取消该订单吗？',
    success: async (res) => {
      if (!res.confirm) return
      try {
        const cancelRes = await orderCancel(order._id, openid)
        if (cancelRes.data.cancelled && cancelRes.data.orderId === order._id) {
          uni.showToast({ icon: 'success', title: '已取消' })
          orderStore.incrementOrderListDirty()
          uni.navigateBack()
        } else {
          uni.showToast({ icon: 'none', title: '取消失败，请重试' })
        }
      } catch (err) {
        console.error(err)
        uni.showToast({ icon: 'none', title: '取消失败，请重试' })
      }
    },
  })
}

// 去支付（待付款）
const handleGoPay = async () => {
  const order = orderDetail.value
  if (!order || order.status !== 'pending') return

  const openid = userStore.profile?.openid
  if (!openid) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  try {
    const payRes = await orderPay(order._id, openid)
    wx.requestPayment({
      timeStamp: payRes.data.timeStamp,
      nonceStr: payRes.data.nonceStr,
      package: payRes.data.packageValue,
      signType: payRes.data.signType,
      paySign: payRes.data.paySign,
      success() {
        console.log('支付成功')
        orderDetailGet(order._id)
      },
      fail() {
        uni.showToast({ icon: 'none', title: '取消支付' })
      },
    })
  } catch (err) {
    console.error(err)
    uni.showToast({ icon: 'none', title: '获取支付参数失败' })
  }
}

onLoad((options?: { orderId?: string; type?: string }) => {
  orderId.value = options?.orderId || ''
  const type = options?.type as OrderType
  orderType.value = type
  if (options?.orderId) {
    orderDetailGet(options.orderId)
  }
  getSafeAreaBottom()
})
</script>

<template>
  <view class="orderDetail">
    <NavHead title="订单详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 商品信息卡片 -->
      <view class="card product-card">
        <view class="product-top">
          <view class="cover-wrap">
            <image class="cover" :src="orderDetail?.productInfo.cover" mode="aspectFill"></image>
            <view class="type-tag">{{ typeLabels[orderDetail?.orderType as OrderType] }}</view>
            <view class="status-tag pending" v-if="orderDetail?.status === 'pending'">待付款</view>
          </view>
          <view class="product-info">
            <view class="title">{{ orderDetail?.productInfo.title }}</view>
            <!-- 行程/活动 -->
            <template v-if="['play', 'activity'].includes(orderDetail?.orderType as OrderType)">
              <view class="info-row" v-if="orderDetail?.productInfo.time">
                <text class="label">{{ orderDetail.orderType === 'play' ? '行程日期：' : '活动日期：' }}</text>
                <text class="value">{{ orderDetail.productInfo.time }}</text>
              </view>
              <view class="info-row" v-if="orderDetail?.productInfo.address_name">
                <text class="label">{{ orderDetail.orderType === 'play' ? '行程门店：' : '活动门店：' }}</text>
                <text class="value">{{ orderDetail.productInfo.address_name }}</text>
              </view>
              <view class="info-row" v-if="orderDetail?.productInfo.event_address">
                <text class="label">{{ orderDetail?.orderType === 'play' ? '行程地址：' : '活动地址：' }}</text>
                <text class="value">{{ orderDetail?.productInfo.event_address }}</text>
              </view>
              <view class="price-row">
                <text class="label">报名金额：</text>
                <text class="price">¥{{ orderDetail?.payAmount.toFixed(2) }}元</text>
              </view>
            </template>
            <!-- 门店 -->
            <!-- <template v-else-if="orderDetail.orderType === 'shop'">
              <view class="info-row" v-if="orderDetail?.productInfo.address_name">
                <text class="label">店名：</text>
                <text class="value">{{ orderDetail.productInfo.address_name }}</text>
              </view>
              <view class="info-row" v-if="orderDetail.productInfo.event_address">
                <text class="label">地址：</text>
                <text class="value">{{ orderDetail.productInfo.event_address }}</text>
              </view>
              <view class="price-row" >
                <text class="label">价格：</text>
                <text class="price">¥{{ orderDetail?.payAmount.toFixed(2) }}元/次</text>
              </view>
            </template> -->
            <!-- 项目 -->
            <!-- <template v-else-if="orderDetail.orderType === 'project'">
              <view class="info-row" >
                <text class="label">行业类别：</text>
                <text class="value">{{ orderDetail.industryCategory }}</text>
              </view>
              <view class="info-row" v-if="orderDetail.cooperationMode">
                <text class="label">合作方式：</text>
                <text class="value">{{ orderDetail.cooperationMode }}</text>
              </view>
              <view class="info-row" v-if="orderDetail.cooperationScale">
                <text class="label">合作规模：</text>
                <text class="value">{{ orderDetail.cooperationScale }}</text>
              </view>
              <view class="info-row" v-if="orderDetail.baseName">
                <text class="label">基地名称：</text>
                <text class="value">{{ orderDetail.baseName }}</text>
              </view>
              <view class="info-row" v-if="orderDetail.baseAddress">
                <text class="label">地址：</text>
                <text class="value">{{ orderDetail.baseAddress }}</text>
              </view>
              <view class="price-row" v-if="orderDetail.viewFee !== undefined">
                <text class="label">查看费用：</text>
                <text class="price">¥{{ orderDetail.viewFee.toFixed(2) }}</text>
              </view>
            </template> -->
          </view>
        </view>
      </view>

      <!-- 使用提示（门店） -->
      <!-- <view class="card tip-card" v-if="orderDetail.usageTip && orderDetail.orderType === 'shop'">
        <view class="section-header">
          <view class="bar"></view>
          <text class="section-title">使用提示</text>
        </view>
        <view class="tip-text">{{ orderDetail.usageTip }}</view>
      </view> -->

      <!-- 活动发起人（行程、活动、项目） -->
      <view class="card" v-if="showInitiator">
        <view class="section-header">
          <view class="bar"></view>
          <text class="section-title">活动发起人</text>
          <view class="dial-btn" @tap="handleCall">
            <text class="iconfont icon-dianhuabodadianhua"></text>
            <text>拨号</text>
          </view>
        </view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">姓名</text>
            <text class="value">：{{ orderDetail?.initiatorInfo?.username }}</text>
          </view>
          <view class="info-item">
            <text class="label">手机</text>
            <text class="value">：{{ orderDetail?.initiatorInfo?.mobile }}</text>
          </view>
          <view class="info-item">
            <text class="label">微信</text>
            <text class="value">：{{ orderDetail?.initiatorInfo?.wechat }}</text>
          </view>
        </view>
      </view>

      <!-- 报名人（行程、活动、项目） -->
      <view class="card" v-if="showRegistrant">
        <view class="section-header">
          <view class="bar"></view>
          <text class="section-title">报名人</text>
        </view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">联系人</text>
            <text class="value">：{{ orderDetail?.userInfo?.nickname }}</text>
          </view>
          <view class="info-item">
            <text class="label">联系电话</text>
            <text class="value">：{{ orderDetail?.userInfo?.phone }}</text>
          </view>
        </view>
      </view>

      <!-- 核销码（待付款不展示） -->
      <view class="card verify-card" v-if="orderDetail?.status !== 'pending'">
        <view class="section-header">
          <view class="bar"></view>
          <text class="section-title">核销码</text>
        </view>
        <view class="qrcode-placeholder"></view>
        <view class="coupon-row">
          <image src="" mode="aspectFit" />
        </view>
      </view>

      <!-- 温馨提示 -->
      <!-- <view class="card tips-card" v-if="orderDetail.warmTips">
        <view class="section-header">
          <view class="bar"></view>
          <text class="section-title">温馨提示</text>
        </view>
        <view class="tips-text">{{ orderDetail.warmTips }}</view>
      </view> -->

      <view class="bottom-placeholder" :style="{ height: (140 + safeAreaBottom) + 'px' }"></view>
    </scroll-view>

    <!-- 底部：待付款 - 去支付、取消订单 -->
    <view class="footer-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }" v-if="orderDetail?.status === 'pending'">
      <view class="footer-btn-row">
        <view class="btn-secondary" @tap="handleCancelOrder">取消订单</view>
        <view class="btn-primary" @tap="handleGoPay">去支付</view>
      </view>
    </view>

    <!-- 底部：待核销 - 申请退款 -->
    <view class="footer-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }" v-if="orderDetail?.status === 'paid'">
      <view class="refund-btn" @tap="handleRefund">申请退款</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.orderDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  padding: 24rpx;
}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

/* 区块标题（黄色竖条） */
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
    font-size: 24rpx;
    color: $qs-brandColor;

    .iconfont {
      font-size: 28rpx;
    }
  }
}

/* 商品信息卡 */
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
      }
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      min-width: 0;

      .title {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        line-height: 1.4;
        @include ellipsis(2);
      }

      .info-row {
        font-size: 24rpx;
        line-height: 1.5;

        .label {
          color: $qs-font-dec2;
        }

        .value {
          color: $qs-font-dec;
          @include ellipsis(1);
        }
      }

      .price-row {
        margin-top: 4rpx;

        .label {
          font-size: 24rpx;
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
}

/* 使用提示 */
.tip-card .tip-text {
  font-size: 28rpx;
  color: $qs-font-dec;
  line-height: 1.6;
}

/* 信息列表 */
.info-list {
  .info-item {
    font-size: 28rpx;
    line-height: 1.8;

    .label {
      color: $qs-font-dec2;
    }

    .value {
      color: $qs-font-dec;
    }
  }
}

/* 核销码 */
.verify-card {
  .qrcode-placeholder {
    width: 320rpx;
    height: 320rpx;
    margin: 0 auto 24rpx;
    background: linear-gradient(135deg, rgba($qs-brandColor, 0.3), rgba($qs-brandColor, 0.1));
    border-radius: 16rpx;
  }

  .coupon-row {
    display: flex;
    align-items: center;
    font-size: 28rpx;

    .coupon-label {
      color: $qs-font-dec2;
      margin-right: 8rpx;
    }

    .coupon-code {
      flex: 1;
      color: $qs-font-title;
      letter-spacing: 2rpx;
    }

    .copy-btn {
      color: #1989fa;
      font-size: 26rpx;
    }
  }
}

/* 温馨提示 */
.tips-card .tips-text {
  font-size: 28rpx;
  color: $qs-font-dec;
  line-height: 1.8;
}

.bottom-placeholder {
  height: 140rpx;
}

/* 底部操作栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .footer-btn-row {
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  .btn-secondary {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: #ffffff;
    border: 2rpx solid rgba($qs-brandColor, 0.4);
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: $qs-brandColor;
  }

  .btn-primary {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: $qs-brandColor;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .refund-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background-color: $qs-brandColor;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
