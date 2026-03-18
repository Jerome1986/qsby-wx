<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref, computed, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UQRCode from 'uqrcodejs'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info'
import type { OrderItem, OrderType, ShopInfo } from '@/types/OrderItem'
import { orderFindOne, orderPay, orderCancel, createQrCode } from '@/api/order'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/generateMonth'
import BookFlow from '@/components/BookFlow.vue'


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

const orderDetail = ref<OrderItem>()
const orderDetailGet = async (id: string) => {
  const res = await orderFindOne(userStore.profile?.openid as string, id)
  orderDetail.value = res.data
  // 已支付但无核销码且不为项目订单时，请求创建
  if (res.data.status === 'paid' && !res.data.verifyCode && res.data.orderType !== 'project') {
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

// 是否显示报名人（行程、活动、项目）
const showRegistrant = computed(() =>
  ['trip', 'activity', 'project', 'shop'].includes(orderType.value)
)

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

// 门店：拨打电话
const handleShopCall = () => {
  const phone = orderDetail.value?.shopInfo?.phone || ''
  if (phone) uni.makePhoneCall({ phoneNumber: phone })
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
    confirmColor: '#ffd018',
    success: async (res) => {
      if (!res.confirm) return
      try {
        const cancelRes = await orderCancel(order._id, openid)
        if (cancelRes.data.cancelled && cancelRes.data.orderId === order._id) {
          uni.showToast({ icon: 'success', title: '已取消' })
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
        uni.navigateBack()
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
                    <text class="price">¥{{ orderDetail?.payAmount.toFixed(2) }}元</text>
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
                  <view class="info-row" v-if="orderDetail.shopInfo?.phone">
                    <text class="label">电话：</text>
                    <text class="value">{{ orderDetail.shopInfo.phone }}</text>
                  </view>
                  <view class="price-row">
                    <text class="label">价格：</text>
                    <text class="price">¥{{ orderDetail?.payAmount.toFixed(2) }}元/晚</text>
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

        <!-- 使用提示（门店） -->
        <!-- <view class="card tip-card" v-if=" orderDetail?.orderType === 'shop'">
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
            <text class="contact-text">门店电话：{{ orderDetail?.shopInfo?.phone || '请填写门店电话' }}</text>
            <text class="iconfont icon-dianhuabodadianhua contact-icon"></text>
          </view>
        </view>

        <!-- 报名人（行程、活动、项目） -->
        <view class="card" v-if="showRegistrant">
          <view class="section-header">
            <view class="bar"></view>
            <text class="section-title" v-if="orderDetail?.orderType === 'shop'">入住信息</text>
            <text class="section-title" v-else>报名人</text>
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
        <view class="card verify-card" :class="{ 'is-verified': orderDetail?.status === 'verified' }"
          v-if="orderDetail?.status !== 'pending' && orderDetail?.orderType !== 'project'">
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
        </view>

        <!-- 申请退款（二维码卡片下方 24rpx） -->
        <view
          class="refund-wrap"
          v-if="orderDetail?.status === 'paid' && orderDetail.discountType !== 'voucher' && orderDetail.orderType !== 'project'"
          @tap="handleRefund"
        >
          申请退款
        </view>

        <!-- 待付款：取消订单、去支付 -->
        <view class="pending-actions" v-if="orderDetail?.status === 'pending'">
          <view class="action-btn cancel" @tap="handleCancelOrder">取消订单</view>
          <view class="action-btn primary" @tap="handleGoPay">去支付</view>
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

/* 申请退款（与去支付按钮样式同步） */
.refund-wrap {
  margin: 0 8rpx 24rpx auto;
  padding: 0 32rpx;
  width: fit-content;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 30rpx;
  font-size: 26rpx;
  font-weight: 500;
  background: linear-gradient(135deg, $qs-brandColor 0%, darken($qs-brandColor, 6%) 100%);
  color: $qs-font-title;
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
    font-size: 36rpx;
    color: $qs-brandColor;
    margin-left: 24rpx;
  }
}

/* 使用提示 */
.tip-card .tip-text {
  font-size: 28rpx;
  color: $qs-font-dec;
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
    }

    &.primary {
      background: linear-gradient(135deg, $qs-brandColor 0%, darken($qs-brandColor, 6%) 100%);
      color: $qs-font-title;
      @include customShadow();
    }
  }
}
</style>
