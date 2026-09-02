<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref, computed, watch } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import UQRCode from 'uqrcodejs'
import { getSafeAreaBottom } from '@/utils/system-info'
import type { OrderItem, OrderType } from '@/types/OrderItem'
import { orderFindOne, orderPay, orderCancel, orderRefund, createQrCode } from '@/api/order'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/generateMonth'


// store
const userStore = useUserStore()

// 订单类型标签（积分为独立模块，不在此共用）
const typeLabels: Record<OrderType, string> = {
  trip: '趣哪游',
  activity: '趣活动',
  shop: '门店',
  project: '项目',
}

const orderId = ref('')
const orderType = ref<OrderType>('trip')
const isVerificationView = ref(false)
const isRefunding = ref(false)
const isPaying = ref(false)
const isCancelling = ref(false)
let openerEventChannel: UniApp.EventChannel | undefined

const orderDetail = ref<OrderItem>()
const orderDetailGet = async (orderId: string) => {
  const res = await orderFindOne(orderId)
  console.log('order', res.data)

  orderDetail.value = res.data
  // 已支付但无核销码且不为项目订单时，请求创建
  if (
    !isVerificationView.value &&
    res.data.status === 'paid' &&
    !res.data.verifyCode &&
    res.data.orderType !== 'project'
  ) {
    try {
      const qrRes = await createQrCode(res.data._id, userStore.profile?.openid as string)
      orderDetail.value = { ...orderDetail.value!, verifyCode: qrRes.data.verifyCode }
    } catch (err) {
      console.error('核销码创建失败', err)
    }
  }
}

// 是否显示发起人（行程、活动、项目）
const showInitiator = computed(() =>
  ['trip', 'activity', 'project'].includes(orderType.value)
)

// 数组首项为后端补充的独立门店电话，兼容历史订单返回的字符串
const shopPhone = computed(() => {
  const phone = orderDetail.value?.shopInfo?.phone
  const value = Array.isArray(phone) ? phone[0] : phone
  return String(value || '').trim()
})

const formatMoney = (amount: unknown) => {
  const value = Number(amount)
  return Number.isFinite(value) ? value.toFixed(2) : '0.00'
}

// 核销码二维码矩阵（uqrcodejs modules，用 view 渲染，无需 canvas）
const qrcodeModules = ref<{ isBlack: boolean }[][]>([])

watch(
  () => orderDetail.value?.verifyCode,
  (code) => {
    if (!code) {
      qrcodeModules.value = []
      return
    }
    const qr = new UQRCode()
    qr.data = code
    qr.make()
    qrcodeModules.value = (qr as { modules: { isBlack: boolean }[][] }).modules || []
  },
  { immediate: true }
)

// 拨打电话
const handleCall = () => {
  const phone = orderDetail.value?.initiatorInfo?.mobile || ''
  if (phone) uni.makePhoneCall({ phoneNumber: phone })
}

// 复制微信号
const handleCopyWx = () => {
  const wechat = orderDetail.value?.initiatorInfo?.wechat || ''
  if (!wechat) return
  uni.setClipboardData({
    data: wechat,
    success: () => {
      uni.showToast({ icon: 'success', title: '微信号已复制' })
    },
    fail: () => {
      uni.showToast({ icon: 'none', title: '复制失败，请重试' })
    },
  })
}

// 查看活动地址（打开地图）
const handleInitiatorAddress = () => {
  const product = orderDetail.value?.productInfo
  console.log('产品信息', product)

  if (product?.latitude == null || product.longitude == null) {
    uni.showToast({ icon: 'none', title: '暂无位置信息' })
    return
  }

  uni.openLocation({
    latitude: product.latitude,
    longitude: product.longitude,
    name: product.address_name || product.title || '活动地点',
    address: product.event_address || '',
  })
}

// 门店：拨打电话
const handleShopCall = () => {
  if (!shopPhone.value) {
    uni.showToast({ icon: 'none', title: '暂无门店电话' })
    return
  }
  uni.makePhoneCall({ phoneNumber: shopPhone.value })
}

// 门店：查看地址（打开地图）
const handleViewAddress = () => {
  const shop = orderDetail.value?.shopInfo
  if (!shop?.address) return
  if (shop.latitude != null && shop.longitude != null) {
    uni.openLocation({
      latitude: shop.latitude,
      longitude: shop.longitude,
      name: shop.shopName || '门店',
      address: shop.address,
    })
  } else {
    uni.showToast({ icon: 'none', title: '暂无位置信息' })
  }
}

// 申请退款
const handleRefund = () => {
  const order = orderDetail.value
  if (!order || order.status !== 'paid' || isRefunding.value) return

  const openid = userStore.profile?.openid
  if (!openid) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  uni.showModal({
    title: '申请退款',
    content: '确定要申请退款吗？',
    success: async (res) => {
      if (!res.confirm) return

      isRefunding.value = true
      uni.showLoading({ title: '提交中...', mask: true })
      let refundSucceeded = false
      try {
        const refundRes = await orderRefund(order.out_trade_no, openid)

        if (refundRes.code !== 200) {
          uni.showToast({ icon: 'none', title: refundRes.message || '退款申请失败，请重试' })
          return
        }

        orderDetail.value = { ...order, status: 'refunding' }
        refundSucceeded = true
      } catch (err) {
        console.error('申请退款失败', err)
        uni.showToast({ icon: 'none', title: '退款申请失败，请重试' })
      } finally {
        uni.hideLoading()
        isRefunding.value = false
      }

      if (refundSucceeded) {
        uni.showToast({ icon: 'success', title: '退款申请已提交' })
      }
    },
  })
}

// 取消订单（待付款）
const handleCancelOrder = () => {
  const order = orderDetail.value
  if (!order || order.status !== 'pending' || isCancelling.value) return

  const openid = userStore.profile?.openid
  if (!openid) return

  uni.showModal({
    title: '取消订单',
    content: '确定要取消该订单吗？',
    confirmColor: '#ffd018',
    success: async (res) => {
      if (!res.confirm) return

      isCancelling.value = true
      uni.showLoading({ title: '取消中...', mask: true })

      try {
        const cancelRes = await orderCancel(order._id, openid)

        if (cancelRes.code !== 200 || !cancelRes.data) {
          throw new Error(cancelRes.message || '取消失败，请重试')
        }

        if (cancelRes.data.cancelled && cancelRes.data.orderId === order._id) {
          orderDetail.value = { ...order, status: 'cancelled' }
          uni.showToast({ icon: 'success', title: '已取消' })
          uni.navigateBack()
        } else {
          throw new Error(cancelRes.message || '订单未能取消')
        }
      } catch (error) {
        console.error('取消订单失败', error)
        uni.showToast({
          icon: 'none',
          title: error instanceof Error ? error.message : '取消失败，请重试',
        })
      } finally {
        uni.hideLoading()
        isCancelling.value = false
      }
    },
  })
}

// 去支付（待付款）
const handleGoPay = async () => {
  const order = orderDetail.value
  if (!order || order.status !== 'pending' || isPaying.value) return

  const openid = userStore.profile?.openid
  if (!openid) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }

  isPaying.value = true
  uni.showLoading({ title: '获取支付参数...', mask: true })

  try {
    const payRes = await orderPay(order._id, openid)

    if (payRes.code !== 200 || !payRes.data) {
      throw new Error(payRes.message || '获取支付参数失败')
    }

    const { timeStamp, nonceStr, packageValue, signType, paySign } = payRes.data
    if (!timeStamp || !nonceStr || !packageValue || !signType || !paySign) {
      throw new Error('支付参数不完整')
    }

    uni.hideLoading()

    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: packageValue,
      signType,
      paySign,
      success() {
        orderDetail.value = { ...order, status: 'paid' }
        uni.navigateBack()
      },
      fail(error) {
        console.error('微信支付失败', error)
        const isCancel = String(error.errMsg || '').includes('cancel')
        uni.showToast({ icon: 'none', title: isCancel ? '已取消支付' : '支付失败，请重试' })
      },
      complete() {
        isPaying.value = false
      },
    })
  } catch (error) {
    console.error('获取支付参数失败', error)
    uni.hideLoading()
    isPaying.value = false
    uni.showToast({
      icon: 'none',
      title: error instanceof Error ? error.message : '获取支付参数失败',
    })
  }
}

// 订单轮询定时器（用于同步核销状态）
let pollTimer: ReturnType<typeof setInterval> | null = null

/** 清除轮询定时器 */
const clearPollTimer = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
    console.log('[订单轮询] 定时器已清除')
  }
}

onLoad((options?: { orderId?: string; type?: string; view?: string }) => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as unknown as {
    getOpenerEventChannel?: () => UniApp.EventChannel
  }
  openerEventChannel = currentPage?.getOpenerEventChannel?.()
  orderId.value = options?.orderId || ''
  const type = options?.type as OrderType
  orderType.value = type
  isVerificationView.value = options?.view === 'verification'
  getSafeAreaBottom()

  if (orderId.value) {
    // 1. 首次加载立即请求一次
    orderDetailGet(orderId.value)
    // 2. 每 3 秒轮询订单状态
    pollTimer = setInterval(() => {
      console.log('[订单轮询] 定时器已启动, orderId:', orderId.value)
      orderDetailGet(orderId.value)
    }, 3000)
  }
})

// 离开页面时清除定时器，避免内存泄漏
onUnload(() => {
  clearPollTimer()
  if (!isVerificationView.value && orderDetail.value) {
    openerEventChannel?.emit('order-updated', orderDetail.value)
  }
})

// 订单已核销或退款时停止轮询
watch(
  () => orderDetail.value?.status,
  (status) => {
    if (status === 'verified' || status === 'refunded') {
      clearPollTimer()
    }
  },
)


</script>

<template>
  <view class="orderDetail">
    <NavHead title="订单详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view style="padding: 24rpx;">
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
              <view class="info-row order-time-row" v-if="orderDetail?.createdAt">
                <text class="label">下单时间：</text>
                <text class="value">{{ formatTimestamp(orderDetail.createdAt, 2) }}</text>
              </view>
              <view class="info-row" v-if="orderDetail?.status === 'verified' && orderDetail?.verifiedTime">
                <text class="label">核销时间：</text>
                <text class="value">{{ formatTimestamp(orderDetail.verifiedTime, 2) }}</text>
              </view>
              <!-- 行程/活动 -->
              <template v-if="['trip', 'activity'].includes(orderDetail?.orderType as OrderType)">
                <view class="info-group">
                  <view class="info-row" v-if="orderDetail?.productInfo.time">
                    <text class="label">{{ orderDetail.orderType === 'trip' ? '行程日期：' : '活动日期：' }}</text>
                    <text class="value">{{ formatTimestamp(orderDetail.productInfo.time, 2) }}</text>
                  </view>
                  <view class="info-row" v-if="orderDetail?.productInfo.address_name">
                    <text class="label">{{ orderDetail.orderType === 'trip' ? '行程门店：' : '活动门店：' }}</text>
                    <text class="value">{{ orderDetail.productInfo.address_name }}</text>
                  </view>
                  <view class="info-row" v-if="orderDetail?.productInfo.event_address">
                    <text class="label">{{ orderDetail?.orderType === 'trip' ? '行程地址：' : '活动地址：' }}</text>
                    <text class="value">{{ orderDetail?.productInfo.event_address }}</text>
                  </view>
                  <view class="price-row">
                    <text class="label">报名金额：</text>
                    <text class="price">¥{{ formatMoney(orderDetail?.payAmount) }}元</text>
                  </view>
                </view>
              </template>
              <!-- 门店 -->
              <template v-else-if="orderDetail?.orderType === 'shop'">
                <view class="info-group">
                  <view class="info-row" v-if="orderDetail?.shopInfo?.shopName">
                    <text class="label">店名：</text>
                    <text class="value">{{ orderDetail.shopInfo?.shopName }}</text>
                  </view>
                  <view class="info-row" v-if="orderDetail.shopInfo?.address">
                    <text class="label">地址：</text>
                    <text class="value">{{ orderDetail.shopInfo.address }}</text>
                  </view>
                  <view class="info-row" v-if="shopPhone">
                    <text class="label">电话：</text>
                    <text class="value">{{ shopPhone }}</text>
                  </view>
                  <view class="price-row">
                    <text class="label">价格：</text>
                    <text class="price">¥{{ formatMoney(orderDetail?.payAmount) }}元/晚</text>
                  </view>
                </view>
              </template>
              <!-- 项目 -->
              <template v-else-if="orderDetail?.orderType === 'project'">
                <view class="info-group">
                  <view class="info-row" v-if="orderDetail.industryCategory">
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
                  <view class="info-row" v-if="orderDetail.baseName || orderDetail?.productInfo?.address_name">
                    <text class="label">基地名称：</text>
                    <text class="value">{{ orderDetail.baseName || orderDetail?.productInfo?.address_name }}</text>
                  </view>
                  <view class="info-row" v-if="orderDetail.baseAddress || orderDetail?.productInfo?.event_address">
                    <text class="label">地址：</text>
                    <text class="value">{{ orderDetail.baseAddress || orderDetail?.productInfo?.event_address }}</text>
                  </view>
                  <view class="price-row" v-if="(orderDetail.viewFee ?? orderDetail?.payAmount) !== undefined">
                    <text class="label">查看费用：</text>
                    <text class="price">¥{{ (orderDetail.viewFee ?? orderDetail?.payAmount ?? 0).toFixed(2) }}</text>
                  </view>
                </view>
              </template>
            </view>
          </view>
        </view>

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
            <view class="info-item info-item-wechat">
              <view class="info-item-left">
                <text class="label">微信</text>
                <text class="value">：{{ orderDetail?.initiatorInfo?.wechat }}</text>
              </view>
              <view class="copy-btn" @tap.stop="handleCopyWx">复制</view>
            </view>
            <view class="info-item info-item-address" v-if="orderDetail?.productInfo?.event_address"
              @tap="handleInitiatorAddress">
              <view class="info-item-left">
                <text class="label">地址</text>
                <text class="value">：{{ orderDetail.productInfo.event_address }}</text>
              </view>
              <text class="iconfont icon-ditu address-icon"></text>
            </view>
          </view>
        </view>

        <!-- 联系门店 -->
        <view class="card contact-store-card" v-if="orderDetail?.orderType === 'shop'">
          <view class="section-header">
            <view class="bar"></view>
            <text class="section-title">联系门店</text>
          </view>
          <view class="contact-row" @tap="handleViewAddress">
            <text class="contact-text">门店地址：{{ orderDetail?.shopInfo?.address || '请填写门店地址' }}</text>
            <text class="iconfont icon-ditu contact-icon"></text>
          </view>
          <view class="contact-row" @tap="handleShopCall">
            <text class="contact-text">门店电话：{{ shopPhone || '请填写门店电话' }}</text>
            <text class="iconfont icon-dianhuabodadianhua contact-icon"></text>
          </view>
        </view>

        <!-- 核销码（待付款不展示） -->
        <view class="card verify-card" :class="{ 'is-verified': orderDetail?.status === 'verified' }"
          v-if="!isVerificationView && ['paid', 'verified'].includes(orderDetail?.status || '') && orderDetail?.orderType !== 'project'">
          <view class="section-header">
            <view class="bar"></view>
            <text class="section-title">核销码</text>
            <view class="verified-tag" v-if="orderDetail?.status === 'verified'">已核销</view>
          </view>
          <view class="qrcode-wrap" v-if="orderDetail?.verifyCode">
            <view class="qrcode-grid" v-if="qrcodeModules.length">
              <view v-for="(row, rowI) in qrcodeModules" :key="rowI" class="qrcode-row">
                <view v-for="(col, colI) in row" :key="colI" class="qrcode-cell" :class="{ black: col.isBlack }"></view>
              </view>
            </view>
            <view class="verify-code-text">{{ orderDetail.verifyCode }}</view>
          </view>
          <view class="qrcode-placeholder" v-else>
            <text class="placeholder-text">核销码生成中...</text>
          </view>
          <view class="reservation-flow" v-if="orderDetail?.orderType === 'shop'">
            <text class="reservation-title">预约流程</text>
            <view class="reservation-steps">
              <text>先购买商品</text>
              <text class="step-separator">{{ '>' }}</text>
              <text>再致电商家预约</text>
              <text class="step-separator">{{ '>' }}</text>
              <text>商家确认后</text>
              <text class="step-separator">{{ '>' }}</text>
              <text>进店消费</text>
            </view>
          </view>
        </view>

        <!-- 申请退款 -->
        <view class="action-wrap"
          v-if="!isVerificationView && ['paid', 'refunding', 'refunded'].includes(orderDetail?.status || '') && orderDetail?.orderType !== 'project'">
          <view class="action-btn-sm" :class="{ refunded: orderDetail?.status === 'refunded' }"
            v-if="orderDetail?.status !== 'paid' || orderDetail?.discountType !== 'voucher'" @tap="handleRefund">
            {{ orderDetail?.status === 'refunded' ? '已退款' : orderDetail?.status === 'refunding' ? '退款中' : '申请退款' }}
          </view>
        </view>

        <view class="card payment-exception-card" v-if="orderDetail?.status === 'payment_exception'">
          <view class="exception-title">支付异常</view>
          <view class="exception-message">
            {{ orderDetail?.paymentExceptionMessage || '微信已完成支付，但订单业务处理失败，请联系客服处理退款。' }}
          </view>
        </view>

        <!-- 待付款：取消订单、去支付 -->
        <view class="pending-actions" v-if="!isVerificationView && orderDetail?.status === 'pending'">
          <view class="action-btn cancel" :class="{ disabled: isCancelling }" @tap="handleCancelOrder">
            {{ isCancelling ? '取消中...' : '取消订单' }}
          </view>
          <view class="action-btn primary" :class="{ disabled: isPaying }" @tap="handleGoPay">
            {{ isPaying ? '处理中...' : '去支付' }}
          </view>
        </view>
      </view>
    </scroll-view>

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
}

.card {
  background-color: $qs-card-bg;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

/* 申请退款 */
.action-wrap {
  display: flex;
  gap: 24rpx;
  margin-bottom: 24rpx;
  justify-content: flex-end;
}

.payment-exception-card {
  border: 1rpx solid rgba(229, 72, 77, 0.3);
  background-color: rgba(229, 72, 77, 0.08);

  .exception-title {
    margin-bottom: 12rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: #e5484d;
  }

  .exception-message {
    font-size: 26rpx;
    line-height: 1.7;
    color: $qs-font-dec;
  }
}

.action-btn-sm {
  padding: 0 32rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 30rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: $qs-font-title;
  background: linear-gradient(135deg, $qs-brandColor 0%, color.adjust($qs-brandColor, $lightness: -6%) 100%);
  @include customShadow();

  &.refunded {
    color: #ffffff;
    background: #b8b8b8;
  }
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
    font-size: 28rpx;
    color: color.adjust($qs-brandColor, $lightness: -28%);

    .iconfont {
      font-size: 32rpx;
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
        background: linear-gradient(135deg, $qs-brandColor, color.adjust($qs-brandColor, $lightness: -10%));
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
      justify-content: space-between;
      min-width: 0;

      .title {
        margin-bottom: 20rpx;
        font-weight: bold;
        color: $qs-font-title;
        @include ellipsis(2);
      }

      .info-group {
        flex: 1;
        margin-top: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 0;
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

        .points {
          font-size: 28rpx;
          font-weight: bold;
          color: $qs-brandColor;
        }
      }
    }
  }
}

/* 联系门店 */
.contact-store-card {
  .contact-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .contact-text {
    margin-bottom: 8rpx;
    flex: 1;
    min-width: 0;
    font-size: 28rpx;
    color: $qs-font-dec;
    @include ellipsis(2);
  }

  .contact-icon {
    flex-shrink: 0;
    font-size: 36rpx;
    color: $qs-brandColor;
    margin-left: 24rpx;
  }

}

/* 信息列表 */
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

    &.info-item-wechat,
    &.info-item-address {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .info-item-left {
        display: flex;
        align-items: baseline;
        flex: 1;
        min-width: 0;
      }

      .copy-btn {
        flex-shrink: 0;
        margin-left: 16rpx;
        font-size: 26rpx;
        color: color.adjust($qs-brandColor, $lightness: -28%);
      }
    }

    &.info-item-address {
      .value {
        display: inline-block;
        max-width: 480rpx;
        @include ellipsis(1);
      }

      .address-icon {
        flex-shrink: 0;
        margin-left: 16rpx;
        font-size: 32rpx;
        color: color.adjust($qs-brandColor, $lightness: -28%);
      }
    }
  }
}

/* 核销码 */
.verify-card {
  position: relative;
  z-index: 0;

  .section-header .verified-tag {
    padding: 6rpx 16rpx;
    font-size: 22rpx;
    color: #999;
    background-color: #f0f0f0;
    border-radius: 8rpx;
  }

  &.is-verified .qrcode-wrap {
    opacity: 0.6;
    filter: grayscale(1);

    .qrcode-grid {
      border: 2rpx dashed #ccc;
    }

    .verify-code-text {
      color: $qs-font-dec2;
    }
  }

  .qrcode-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;

    .qrcode-grid {
      display: flex;
      flex-direction: column;
      width: 100px;
      height: 100px;
      background-color: #fff;
      border-radius: 16rpx;
      overflow: hidden;
    }

    .qrcode-row {
      display: flex;
      flex: 1;
    }

    .qrcode-cell {
      flex: 1;
      background-color: #fff;

      &.black {
        background-color: #000;
      }
    }

    .verify-code-text {
      margin-top: 16rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: $qs-font-title;
      letter-spacing: 8rpx;
    }
  }

  .qrcode-placeholder {
    width: 320rpx;
    height: 320rpx;
    margin: 0 auto 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba($qs-brandColor, 0.3), rgba($qs-brandColor, 0.1));
    border-radius: 16rpx;

    .placeholder-text {
      font-size: 28rpx;
      color: $qs-font-dec;
    }
  }

  .reservation-flow {
    margin-top: 32rpx;
    padding: 24rpx;
    background-color: rgba($qs-brandColor, 0.1);
    border-radius: 16rpx;

    .reservation-title {
      display: block;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: $qs-font-title;
    }

    .reservation-steps {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8rpx;
      font-size: 24rpx;
      line-height: 1.8;
      color: #707070;
    }
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

/* 待付款：取消订单、去支付（小巧精致） */
.pending-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16rpx;
  margin: 0 auto 24rpx;
  padding: 0 8rpx;

  .action-btn {
    padding: 0 32rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    border-radius: 30rpx;
    font-size: 26rpx;
    font-weight: 500;

    &.cancel {
      background-color: #ffffff;
      color: $qs-font-dec;
      border: 1rpx solid $qs-border;
      @include customShadow();

      &.disabled {
        opacity: 0.6;
      }
    }

    &.primary {
      background: linear-gradient(135deg, $qs-brandColor 0%, color.adjust($qs-brandColor, $lightness: -6%) 100%);
      color: $qs-font-title;
      @include customShadow();

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}
</style>
