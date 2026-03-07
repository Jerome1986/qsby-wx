<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info'
import { useUserStore } from '@/stores'
import type { PlayListItem } from '@/types/Play'
import { tripDetailGetApi } from '@/api/trip'
import { formatTimestamp } from '@/utils/generateMonth'
import { vaildateMoible } from '@/utils/validateMobile'
import type { OrderSubmitParams, OrderUserInfo, DiscountType, InitiatorInfo } from '@/types/OrderItem'
import PayMethod from '@/components/PayMethod.vue'
import Voucher from '@/components/Voucher.vue'
import { tripOrderAdd } from '@/api/order'
import { verifySignUpApi } from '@/api/verifySignUp'
import { userInfoGetApi } from '@/api/user'

// store
const userStore = useUserStore()

// 验证是否报名
const isVerify = ref(false)
const isSignUp = async (targetId: string) => {
  const res = await verifySignUpApi(
    'trip',
    targetId,
    userStore.profile?._id as string
  )
  console.log('报名结果', res)

  isVerify.value = res.data.isSignUp
}
onLoad((options) => isSignUp(options?.productId))

// 表单数据
const formData = ref<Partial<OrderUserInfo>>({
  nickname: userStore.profile?.nickname ?? '',
  gender: userStore.profile?.gender ?? '男',
  phone: userStore.profile?.mobile ?? '',
})

// 获取详情
const detailData = ref<PlayListItem>({} as PlayListItem)
const detailGet = async (id: string) => {
  const res = await tripDetailGetApi(id)
  console.log('详情', res)
  detailData.value = res.data
  initiatorInfo.mobile = detailData.value.phone as string
  initiatorInfo.wechat = detailData.value.wechat as string

}

// 是否使用代金券
const useVoucher = ref(true)

// 抵扣金额
const discountAmount = computed(() => {
  const userFee = detailData.value.userFee || 0

  // 非主理人无抵扣
  if (userStore.profile?.role !== 'manager') {
    return 0
  }

  const commission = detailData.value.commission || 0
  const balance = userStore.profile?.balance || 0

  // 代金券和主理人折扣二选一，不可叠加
  if (useVoucher.value && balance > 0) {
    // 使用代金券抵扣，最多抵扣原价
    return Number(Math.min(balance, userFee).toFixed(2))
  } else if (commission > 0) {
    // 使用主理人折扣
    return Number(commission.toFixed(2))
  }

  return 0
})

// 实际支付金额
const realPayAmount = computed(() => {
  const userFee = detailData.value.userFee || 0
  return Number((userFee - discountAmount.value).toFixed(2))
})

// 查询当前行程的发起人信息
const initiatorInfo: InitiatorInfo = {
  username: '',
  mobile: '',
  wechat: detailData.value.wechat as string
}
const initiatorInfoGet = async () => {
  const res = await userInfoGetApi(detailData.value.userId as string)
  initiatorInfo.username = res.data.username || res.data.nickname
}


// 提交报名
const submit = async () => {
  // 校验表单
  const vaildate = vaildateMoible(formData.value.phone as string)
  if (!vaildate) return

  // 校验金额
  const totalAmount = detailData.value.userFee
  const commission = detailData.value.commission
  const payAmount = Number(realPayAmount.value)

  if (totalAmount === undefined || totalAmount < 0) {
    uni.showToast({ title: '商品价格异常', icon: 'none' })
    return
  }
  if (commission === undefined || commission < 0) {
    uni.showToast({ title: '佣金信息异常', icon: 'none' })
    return
  }
  if (payAmount < 0 || payAmount > totalAmount) {
    uni.showToast({ title: '支付金额异常', icon: 'none' })
    return
  }

  if (userStore.profile?._id === detailData.value.userId) {
    uni.showToast({ title: '不可以参加自己的项目', icon: 'none' })
    return
  }

  // 检查用户是否有openid,如果没有就跳转登录
  if (!userStore.profile?.openid) {
    uni.navigateTo({ url: `/pages/login/login?productId=${detailData.value._id}` })
    return
  }

  // 确定抵扣类型
  const getDiscountType = () => {
    if (userStore.profile?.role !== 'manager') return 'none'
    if (useVoucher.value && (userStore.profile?.balance || 0) > 0) return 'voucher'
    if (commission > 0) return 'commission'
    return 'none'
  }

  // 准备提交参数
  const params: OrderSubmitParams = {
    openid: userStore.profile?.openid,
    orderType: 'play',
    productInfo: {
      productId: detailData.value._id as string,
      cover: detailData.value.cover as string,
      title: detailData.value.title as string,
      time: detailData.value.time as string,
      address_name: detailData.value.address_name as string,
      event_address: detailData.value.event_address as string
    },
    userInfo: {
      nickname: formData.value.nickname as string,
      gender: formData.value.gender as string | number,
      phone: formData.value.phone as string,
    },
    initiatorInfo,
    totalAmount,
    commission,
    discountAmount: discountAmount.value,
    discountType: getDiscountType(),
    payAmount,
    description: detailData.value.title as string,
  }

  console.log('提交报名参数', params)
  //  调用生成订单+支付接口
  const payRes = await tripOrderAdd(params)
  console.log('支付返回结果', payRes)
  // 2.通过后端返回参数、发起前端微信支付
  wx.requestPayment({
    timeStamp: payRes.data.timeStamp,
    nonceStr: payRes.data.nonceStr,
    package: payRes.data.packageValue,
    signType: payRes.data.signType,
    paySign: payRes.data.paySign,
    success(res) {
      // 3.支付成功后-重新获取更新的数据（实际的更新动作由后端完成）
      console.log('支付成功', res)
      uni.redirectTo({
        url: `/pagesMember/orderDetail/orderDetail?orderId=${payRes.data.orderId}`,
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

onLoad(async (options: any) => {
  if (options.productId) {
    await detailGet(options.productId)
    await initiatorInfoGet()
  }
  getSafeAreaBottom()
})
</script>
<template>
  <view class="signUp">
    <NavHead title="报名信息" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  商品信息  -->
      <view class="productInfo">
        <view class="top">
          <view class="cover">
            <image mode="aspectFill" :src="detailData.cover"></image>
          </view>
          <view class="info">
            <!-- 标题和日期 -->
            <view class="info-group">
              <view class="title">{{ detailData.title }}</view>
              <view class="row">
                <text class="label">行程日期：</text>
                <text class="text">{{ formatTimestamp(detailData.time!, 2) }}</text>
              </view>
            </view>
            <!-- 门店和地址 -->
            <view class="info-group">
              <view class="row">
                <text class="label">行程门店：</text>
                <text class="text">{{ detailData.address_name }}</text>
              </view>
              <view class="row">
                <text class="label">行程地址：</text>
                <text class="text">{{ detailData.event_address }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="price">
          <view class="label">行程报名费用</view>
          <view class="value">￥{{ detailData.userFee?.toFixed(2) }}</view>
        </view>
      </view>
      <!--  报名人信息  -->
      <view class="section-title">报名人信息</view>
      <view class="userInfo">
        <uni-forms ref="formRef" :modelValue="formData" labelWidth="140rpx">
          <uni-forms-item label="昵称" name="nickname">
            <uni-easyinput v-model="formData.nickname" :inputBorder="false" placeholder="代用名" primaryColor="#ffd018"
              trim />
          </uni-forms-item>
          <uni-forms-item label="性别" name="gender">
            <radio-group @change="(e: any) => (formData.gender = e.detail.value)">
              <label class="radio-label">
                <radio value="男" :checked="formData.gender === 1" color="#ffd018" />
                <text>男</text>
              </label>
              <label class="radio-label">
                <radio value="女" :checked="formData.gender === 2" color="#ffd018" />
                <text>女</text>
              </label>
            </radio-group>
          </uni-forms-item>
          <uni-forms-item label="手机号" name="phone">
            <uni-easyinput v-model="formData.phone" :inputBorder="false" placeholder="请填写正确的手机号码" primaryColor="#ffd018"
              type="number" trim />
          </uni-forms-item>
        </uni-forms>
      </view>
      <!-- 支付方式 -->
      <PayMethod />
      <!-- 代金券 -->
      <Voucher :amount="userStore.profile?.balance ?? 0" v-model:useVoucher="useVoucher" />
      <!--  温馨提示  -->
      <view class="tips">
        <view class="tips-title">温馨提示：</view>
        <view class="tips-item">1、报名成功后，请按照行程安排准时到达指定集合地点，逾期未到视为自动放弃，费用不予退还。</view>
        <view class="tips-item">2、如需取消报名，请提前24小时联系组织方，逾期取消将扣除相应手续费。</view>
        <view class="tips-item">3、活动期间请遵守组织方安排，注意人身及财产安全，如遇突发情况请及时与工作人员沟通。</view>
        <view class="tips-item">4、请确保所填写的联系方式真实有效，以便组织方及时与您取得联系。</view>
        <view class="tips-item">5、本平台仅提供信息展示及报名服务，活动最终解释权归组织方所有。</view>
      </view>
      <!-- 底部占位 -->
      <view class="scroll-bottom-placeholder"></view>
    </scroll-view>
    <!--  底部操作区域  -->
    <view class="signUpBar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="price">
        <view class="row">
          <text class="label">实际费用</text>
          <text class="value">￥{{ realPayAmount }}</text>
        </view>
        <view class="row discount" v-if="userStore.profile?.role === 'manager'">
          <text class="label">主理人折扣</text>
          <text class="value">-￥{{ detailData.commission?.toFixed(2) }}</text>
        </view>
      </view>
      <view class="btn" @tap="submit" v-if="!isVerify">提交报名</view>
      <view class="btn disable" v-else>已报名</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.signUp {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 180rpx;
  height: 100%;
  @include page-background();
}

/* 内容区域 */
.content {
  flex: 1;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

/* 商品信息卡片 */
.productInfo {
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  .top {
    padding-bottom: 24rpx;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    .cover {
      width: 192rpx;
      height: 215rpx;
      background: #f7d11a;
      border-radius: 24rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 24rpx;

      .info-group {
        .title {
          font-weight: bold;
          font-size: 28rpx;
          color: $qs-font-title;
          line-height: 1.4;
          @include ellipsis(2);
        }

        .row {
          margin-top: 4rpx;
          font-size: 22rpx;
          line-height: 1.6;

          .label {
            color: $qs-font-dec2;
          }

          .text {
            color: $qs-font-dec;
          }
        }
      }
    }
  }

  .price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .label {
      font-size: 28rpx;
      font-weight: bold;
      color: $qs-font-title;
    }

    .value {
      font-weight: bold;
      font-size: 28rpx;
      color: #ff3434;
    }
  }
}

/* 区块标题 */
.section-title {
  margin-top: 30rpx;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  color: $qs-font-dec;
}

/* 报名人信息卡片 */
.userInfo {
  margin-bottom: 24rpx;
  padding: 0 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  :deep(.uni-forms) {
    .uni-forms-item {
      padding: 24rpx 0;
      margin-bottom: 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .uni-forms-item__label {
        font-size: 28rpx;
        color: $qs-font-title;
        padding: 0;
      }

      .uni-forms-item__content {
        display: flex;
        align-items: center;
      }
    }
  }

  :deep(.uni-easyinput) {
    .uni-easyinput__content {
      background-color: transparent !important;
      padding: 0 !important;
    }

    .uni-easyinput__placeholder-class {
      font-size: 28rpx;
      color: $qs-font-dec2;
    }

    .uni-easyinput__content-input {
      font-size: 28rpx;
      color: $qs-font-title;
    }
  }

  radio-group {
    display: flex;
    align-items: center;
  }

  .radio-label {
    display: flex;
    align-items: center;
    margin-right: 40rpx;
    font-size: 28rpx;
    color: $qs-font-title;

    radio {
      transform: scale(0.8);
    }

    text {
      margin-left: 8rpx;
    }
  }
}

/* 温馨提示 */
.tips {
  margin-top: 30rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  .tips-title {
    font-size: 26rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 16rpx;
  }

  .tips-item {
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.8;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 底部操作区域 */
.signUpBar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border-top: 1px solid #f1f1f1;
  box-sizing: border-box;

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
        color: #ff3434;
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

  .btn {
    padding: 0 60rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: $qs-brandColor;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .disable {
    background: $qs-font-dec2;
  }
}
</style>
