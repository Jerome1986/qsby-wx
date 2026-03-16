<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { computed, ref } from 'vue'
import { safeAreaBottom, getSafeAreaBottom } from '@/utils/system-info'
import NavTitle from '@/components/NavTitle.vue'
import PayMethod from '@/components/PayMethod.vue'
import Voucher from '@/components/Voucher.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useShopStore, useUserStore } from '@/stores'
import { shopPorductByOne } from '@/api/store'
import type { ProductItem } from '@/types/store'
import { vaildateMoible } from '@/utils/validateMobile'
import type { OrderSubmitParams, OrderType } from '@/types/OrderItem'
import { createOrderFree, createQrCode, orderAdd } from '@/api/order'

const userStore = useUserStore()
const shopStore = useShopStore()
// 获取产品信息
const productData = ref<ProductItem>()
const productDetailGet = async (productId: string) => {
  const res = await shopPorductByOne(productId)
  productData.value = res.data
}

onLoad(async (options) => {
  getSafeAreaBottom()
  console.log(options)

  if (options?.productId) {
    await productDetailGet(options?.productId as string)
  }
})

// 订单联系人
const contactInfo = ref({
  name: '',
  phone: '',
})

// 订单须知
const noticeList = ref([
  '下单后请在24小时内完成支付，超时订单将自动取消。',
  '如需退款，请在入住前一天联系商家协商处理。',
  '本平台仅提供预订服务，实际消费以商家为准。',
])

// 是否使用代金券抵扣
const useVoucher = ref(true)

// 抵扣金额
const discountAmount = computed(() => {
  const userFee = productData.value?.price || 0

  // 非主理人无抵扣
  if (userStore.profile?.role !== 'manager') {
    return 0
  }

  const commission = productData.value?.commission || 0
  const couponBalance = userStore.profile?.couponBalance || 0

  // 代金券和主理人折扣二选一，不可叠加
  if (useVoucher.value && couponBalance > 0) {
    // 使用代金券抵扣，最多抵扣原价
    return Number(Math.min(couponBalance, userFee).toFixed(2))
  } else if (commission > 0) {
    // 使用主理人折扣
    return Number(commission.toFixed(2))
  }

  return 0
})

// 实际支付金额
const realPayAmount = computed(() => {
  const userFee = productData.value?.price || 0
  return Number((userFee - discountAmount.value).toFixed(2))
})

// 提交支付
const handlePay = async () => {
  // TODO: 微信支付逻辑
  // 验证
  const vaildate = vaildateMoible(contactInfo.value.phone as string)
  if (!vaildate) return

  if (!contactInfo.value.name) {
    uni.showToast({ icon: 'none', title: '请务必填写姓名' })
    return
  }

  // 检查用户是否有openid,如果没有就跳转登录
  if (!userStore.profile?.openid) {
    uni.navigateTo({ url: `/pages/login/login?productId=${productData.value?._id}` })
    return
  }

  const commission = productData.value?.commission || 0
  const totalAmount = productData.value?.price || 0
  const payAmount = Number(realPayAmount.value)

  // 确定抵扣类型
  const getDiscountType = () => {
    if (userStore.profile?.role !== 'manager') return 'cash'
    if (useVoucher.value && (userStore.profile?.couponBalance || 0) > 0) return 'voucher'
    if (commission > 0) return 'commission'
    return 'cash'
  }

  // 准备提交参数
  const params: OrderSubmitParams = {
    openid: userStore.profile?.openid,
    orderType: 'shop',
    productInfo: {
      productId: productData.value?._id as string,
      cover: productData.value?.cover as string,
      title: productData.value?.name as string,
      time: productData.value?.createdAt as string,
    },
    userInfo: {
      userId: userStore.profile?._id as string,
      nickname: contactInfo.value.name as string,
      gender: userStore.profile.gender as string | number,
      phone: contactInfo.value.phone as string,
    },
    shopInfo: {
      shopName: shopStore.shopInfo?.name as string,
      address: shopStore.shopInfo?.address as string,
      phone: shopStore.shopInfo?.phone as string,
      latitude: shopStore.shopInfo?.latitude,
      longitude: shopStore.shopInfo?.longitude
    },
    totalAmount,
    commission,
    discountAmount: discountAmount.value,
    discountType: getDiscountType(),
    payAmount,
    description: '酒店房间团购',
  }

  // 如果是代金券抵扣，且支付金额抵扣完为0就走下单流程，不用支付
  if (payAmount === 0 && params.discountType === 'voucher') {
    console.log('提交参数', params)

    try {
      const res = await createOrderFree(params)
      console.log('创建订单', res)

      await createQrCode(res.data?.orderId, userStore.profile?.openid as string).catch((err) =>
        console.error('核销码创建失败', err)
      )
      await uni.redirectTo({
        url: `/pagesMember/orderDetail/orderDetail?orderId=${res.data.orderId}&type=trip`,
      })
    } catch (err) {
      console.error('免支付下单失败', err)
      uni.showToast({ icon: 'none', title: '下单失败，请重试' })
    }
    return
  }

  console.log('参数', params)
  //  调用生成订单+支付接口
  const payRes = await orderAdd(params)
  console.log('支付返回结果', payRes)
  // 2.通过后端返回参数、发起前端微信支付
  wx.requestPayment({
    timeStamp: payRes.data.timeStamp,
    nonceStr: payRes.data.nonceStr,
    package: payRes.data.packageValue,
    signType: payRes.data.signType,
    paySign: payRes.data.paySign,
    async success() {
      try {
        const qrCodeRes = await createQrCode(payRes.data.orderId, userStore.profile?.openid as string)
        console.log(qrCodeRes)

      } catch (err) {
        console.error('核销码创建失败', err)
      }
      await uni.redirectTo({
        url: `/pagesMember/orderDetail/orderDetail?orderId=${payRes.data.orderId}&type=shop`,
      })
    },
    fail(err) {
      console.error('支付失败', err)
      uni.showToast({
        icon: 'none',
        title: '取消支付',
      })
    },
  })
}
</script>

<template>
  <view class="createOrder">
    <NavHead title="确认订单" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 商品信息 -->
      <view class="card product-row">
        <text class="product-name">{{ productData?.name }}</text>
        <text class="product-price">¥{{ productData?.price }}/晚</text>
      </view>

      <!-- 订单联系人 -->
      <view class="card contact-card">
        <view style="margin-bottom: 24rpx">
          <NavTitle title="订单联系人"></NavTitle>
        </view>
        <uni-forms :modelValue="contactInfo" labelWidth="140rpx">
          <uni-forms-item label="姓名" name="name">
            <uni-easyinput v-model="contactInfo.name" placeholder="请输入姓名" :inputBorder="false" />
          </uni-forms-item>
          <uni-forms-item label="手机" name="phone">
            <uni-easyinput v-model="contactInfo.phone" placeholder="请输入手机号" :inputBorder="false" type="number" />
          </uni-forms-item>
        </uni-forms>
      </view>

      <!-- 支付方式 -->
      <PayMethod />

      <!-- 代金券 -->
      <Voucher v-if="userStore.profile?.role === 'manager'" :amount="userStore.profile.couponBalance"
        v-model:useVoucher="useVoucher" />

      <!-- 订单须知 -->
      <view class="card notice-card">
        <view style="margin-bottom: 24rpx">
          <NavTitle title="订单须知"></NavTitle>
        </view>
        <view class="notice-item" v-for="(item, index) in noticeList" :key="index">
          <text>{{ index + 1 }}. {{ item }}</text>
        </view>
      </view>

      <view style="height: 140rpx"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="price">
        <view class="row">
          <text class="label">合计</text>
          <text class="value">¥{{ realPayAmount.toFixed(2) }}</text>
        </view>
        <view class="row discount" v-if="userStore.profile?.role === 'manager'">
          <text class="label">主理人折扣</text>
          <text class="value">-¥{{ productData?.commission.toFixed(2) }}</text>
        </view>
      </view>
      <view class="pay-btn" @tap="handlePay">微信支付</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.createOrder {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  padding: 24rpx;
}

/* 通用卡片 */
.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

/* 商品信息行 */
.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .product-name {
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .product-price {
    font-size: 30rpx;
    font-weight: bold;
    color: #ff3b3b;
  }
}

/* 订单联系人 */
.contact-card {
  padding-bottom: 0;

  :deep(.uni-forms) {
    padding: 0;
  }

  :deep(.uni-forms-item) {
    border-bottom: 1rpx solid $qs-border;
    margin-bottom: 0;
    padding: 20rpx 0;

    .uni-forms-item__label {
      font-size: 28rpx;
      color: $qs-font-title;
    }
  }

  :deep(.uni-forms-item:last-child) {
    border-bottom: none;
  }

  :deep(.uni-easyinput__content) {
    background-color: transparent !important;
    padding: 0 !important;

    .uni-easyinput__inner {
      padding-left: 0 !important;
      font-size: 28rpx;
      color: $qs-font-title;
    }
  }
}

/* 订单须知 */
.notice-card {
  .notice-item {
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.8;
  }
}

/* 底部操作栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .price {
    display: flex;
    flex-direction: column;

    .row {
      display: flex;
      align-items: baseline;

      .label {
        font-size: 26rpx;
        color: $qs-font-title;
      }

      .value {
        margin-left: 8rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #ff3b3b;
      }
    }

    .discount {
      margin-top: 4rpx;

      .label,
      .value {
        font-size: 22rpx;
        font-weight: normal;
        color: $qs-font-dec;
      }
    }
  }

  .pay-btn {
    width: 280rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: $qs-brandColor;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
