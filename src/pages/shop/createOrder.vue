<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { computed, ref } from 'vue'
import { safeAreaBottom, getSafeAreaBottom } from '@/utils/system-info'
import NavTitle from '@/components/NavTitle.vue'
import Note from '@/components/Note.vue'
import PayMethod from '@/components/PayMethod.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useShopStore, useUserStore } from '@/stores'
import { shopDetailApi, shopPorductByOne } from '@/api/store'
import type { ProductItem } from '@/types/store'
import { vaildateMoible } from '@/utils/validateMobile'
import type { OrderSubmitParams } from '@/types/OrderItem'
import { createQrCode, orderAdd } from '@/api/order'

const userStore = useUserStore()
const shopStore = useShopStore()
const inviterCode = ref('')
// 获取产品信息
const productData = ref<ProductItem>()
const productDetailGet = async (productId: string) => {
  const res = await shopPorductByOne(productId)
  productData.value = res.data
}

const refreshShopInfo = async () => {
  const shopId = productData.value?.storeId || shopStore.shopInfo?._id

  if (!shopId) {
    uni.showToast({ icon: 'none', title: '门店信息缺失，请返回重试' })
    throw new Error('缺少门店ID')
  }

  const res = await shopDetailApi(shopId)
  shopStore.setShopInfo(res.data.shopInfo)
  return res.data.shopInfo
}

onLoad(async (options) => {
  getSafeAreaBottom()
  console.log(options)

  if (options?.productId) {
    await productDetailGet(options?.productId as string)
  }
  inviterCode.value = options?.inviterCode || ''
})

// 订单联系人
const contactInfo = ref({
  name: '',
  phone: '',
})


// 抵扣金额
const discountAmount = computed(() => {
  // 非主理人无抵扣
  if (!userStore.isValidManager) {
    return 0
  }

  const commission = productData.value?.commission || 0

  if (commission > 0) {
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
  // 微信支付逻辑
  // 验证
  const vaildate = vaildateMoible(contactInfo.value.phone as string)
  if (!vaildate) return

  if (!contactInfo.value.name) {
    uni.showToast({ icon: 'none', title: '请务必填写姓名' })
    return
  }

  // 检查用户是否有openid,如果没有就跳转登录
  if (!userStore.profile?.openid) {
    const query = [
      `productId=${encodeURIComponent(productData.value?._id || '')}`,
      'proType=shop',
      inviterCode.value ? `inviterCode=${encodeURIComponent(inviterCode.value)}` : '',
    ]
      .filter(Boolean)
      .join('&')
    uni.navigateTo({ url: `/pages/login/login?${query}` })
    return
  }

  const commission = productData.value?.commission || 0
  const totalAmount = productData.value?.price || 0
  const payAmount = Number(realPayAmount.value)

  // 确定抵扣类型
  const getDiscountType = () => {
    if (!userStore.isValidManager) return 'none'
    if (commission > 0) return 'commission'
    return 'none'
  }

  uni.showModal({
    title: '提示',
    content: '确认提交订单，并支付吗',
    showCancel: true,
    confirmColor: '#eed261',
    success: async ({ confirm }) => {
      if (confirm) {
        try {
          uni.showLoading({ title: '提交中...', mask: true })
          const latestShopInfo = await refreshShopInfo()

          // 准备提交参数
          const params: OrderSubmitParams = {
            openid: userStore.profile?.openid as string,
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
              gender: userStore.profile?.gender as string | number,
              phone: contactInfo.value.phone as string,
            },
            shopInfo: {
              shopId: latestShopInfo._id,
              shopName: latestShopInfo.name,
              address: latestShopInfo.address,
              phone: latestShopInfo.managerPhone || latestShopInfo.phone,
              latitude: latestShopInfo.latitude,
              longitude: latestShopInfo.longitude,
            },
            totalAmount,
            commission,
            discountAmount: discountAmount.value,
            discountType: getDiscountType(),
            payAmount,
            description: '酒店房间团购',
          }

          console.log('参数', params)
          //  调用生成订单+支付接口
          const payRes = await orderAdd(params)
          console.log('支付返回结果', payRes)
          uni.hideLoading()
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
        } catch (err) {
          uni.hideLoading()
          uni.showToast({
            icon: 'none',
            title: '提交失败，请重试',
          })
          console.error(err)
        }
      }
    },
  })


}
</script>

<template>
  <view class="createOrder">
    <NavHead title="确认订单" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view style="padding: 24rpx;">
        <!-- 商品信息 -->
        <view class="card product-row">
          <text class="product-name">{{ productData?.name }}</text>
          <text class="product-price">¥{{ productData?.price ?? 0 }}{{ productData?.specLabel ? '/' +
            productData.specLabel : '' }}</text>
        </view>

        <!-- 订单联系人 -->
        <view class="card contact-card">
          <view style="margin-bottom: 24rpx">
            <NavTitle title="订单联系人"></NavTitle>
          </view>
          <uni-forms :modelValue="contactInfo" labelWidth="140rpx">
            <uni-forms-item label="姓名" name="name">
              <uni-easyinput v-model="contactInfo.name" placeholder="请输入姓名" :inputBorder="false"
                primaryColor="#ffd018" />
            </uni-forms-item>
            <uni-forms-item label="手机" name="phone">
              <uni-easyinput v-model="contactInfo.phone" placeholder="请输入手机号" :inputBorder="false" type="number"
                primaryColor="#ffd018" />
            </uni-forms-item>
          </uni-forms>
        </view>

        <!-- 支付方式 -->
        <PayMethod />

        <!-- 代金券功能暂时隐藏 -->

        <!-- 预约须知 -->
        <Note :store-id="productData?.storeId" />

        <view style="height: 140rpx"></view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="price">
        <view class="row">
          <text class="label">合计</text>
          <text class="value">¥{{ realPayAmount?.toFixed(2) }}</text>
        </view>
        <view class="row discount" v-if="userStore.isValidManager">
          <text class="label">主理人折扣</text>
          <text class="value">-¥{{ productData?.commission?.toFixed(2) }}</text>
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
}

/* 通用卡片 */
.card {
  background-color: $qs-card-bg;
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
  background-color: $qs-card-bg;
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
