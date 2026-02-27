<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { safeAreaBottom, getSafeAreaBottom } from '@/utils/system-info'
import NavTitle from '@/components/NavTitle.vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

onLoad(() => {
  getSafeAreaBottom()
})

// 订单联系人
const contactInfo = ref({
  name: '',
  phone: '',
  idCard: '',
  roomNo: '',
})

// 订单须知
const noticeList = ref([
  '下单后请在24小时内完成支付，超时订单将自动取消。',
  '如需退款，请在入住前一天联系商家协商处理。',
  '本平台仅提供预订服务，实际消费以商家为准。',
])

// 是否使用代金券抵扣
const useVoucher = ref(true)

// 提交支付
const handlePay = () => {
  // TODO: 微信支付逻辑
}
</script>

<template>
  <view class="createOrder">
    <NavHead title="确认订单" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 商品信息 -->
      <view class="card product-row">
        <text class="product-name">湖景大床房</text>
        <text class="product-price">¥400.00/晚</text>
      </view>

      <!-- 订单联系人 -->
      <view class="card contact-card">
        <view style="margin-bottom: 24rpx">
          <NavTitle title="订单联系人"></NavTitle>
        </view>
        <uni-forms :modelValue="contactInfo" labelWidth="140rpx">
          <uni-forms-item label="姓名" name="name">
            <uni-easyinput
              v-model="contactInfo.name"
              placeholder="请输入姓名"
              :inputBorder="false"
            />
          </uni-forms-item>
          <uni-forms-item label="手机" name="phone">
            <uni-easyinput
              v-model="contactInfo.phone"
              placeholder="请输入手机号"
              :inputBorder="false"
              type="number"
            />
          </uni-forms-item>
          <uni-forms-item label="身份证号" name="idCard">
            <uni-easyinput
              v-model="contactInfo.idCard"
              placeholder="请输入身份证号"
              :inputBorder="false"
            />
          </uni-forms-item>
          <uni-forms-item label="房间号" name="roomNo">
            <uni-easyinput
              v-model="contactInfo.roomNo"
              placeholder="请输入房间号"
              :inputBorder="false"
            />
          </uni-forms-item>
        </uni-forms>
      </view>

      <!-- 支付方式 -->
      <view class="card pay-row">
        <text class="pay-label">支付方式</text>
        <view class="pay-method">
          <text class="iconfont icon-weixinzhifu" style="color: #07c160; font-size: 40rpx"></text>
          <text class="pay-text">微信支付</text>
        </view>
      </view>

      <!-- 代金券 -->
      <view class="card voucher-card" v-if="userStore.profile?.role === 'manager'">
        <view class="voucher-header">
          <NavTitle title="代金券余额"></NavTitle>
          <text class="voucher-amount">¥ 1000.00</text>
        </view>
        <view class="voucher-tips">
          <view class="voucher-tip-item">
            <text class="iconfont icon-duigou tip-icon"></text>
            <text class="tip-text">全额抵扣</text>
          </view>
          <view class="voucher-tip-item">
            <text class="iconfont icon-duigou tip-icon"></text>
            <text class="tip-text">余额不足时，可以补缴差价。</text>
          </view>
        </view>
        <view class="voucher-toggle" @tap="useVoucher = !useVoucher">
          <view class="radio" :class="{ active: useVoucher }">
            <view class="radio-inner" v-if="useVoucher"></view>
          </view>
          <text class="voucher-toggle-text">使用代金券抵扣</text>
        </view>
      </view>

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
          <text class="value">¥400.00</text>
        </view>
        <view class="row discount">
          <text class="label">主理人折扣</text>
          <text class="value">-¥200.00</text>
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

/* 支付方式 */
.pay-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .pay-label {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .pay-method {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .pay-text {
      font-size: 28rpx;
      color: $qs-font-title;
    }
  }
}

/* 代金券 */
.voucher-card {
  .voucher-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .voucher-amount {
      font-size: 32rpx;
      font-weight: bold;
      color: #ff3b3b;
    }
  }

  .voucher-tips {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 12rpx;

    .voucher-tip-item {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .tip-icon {
        font-size: 24rpx;
        color: $qs-brandColor;
      }

      .tip-text {
        font-size: 24rpx;
        color: $qs-font-dec;
      }
    }
  }

  .voucher-toggle {
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid $qs-border;
    display: flex;
    align-items: center;
    gap: 12rpx;

    .radio {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      border: 2rpx solid $qs-font-dec2;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;

      &.active {
        border-color: $qs-brandColor;
      }

      .radio-inner {
        width: 18rpx;
        height: 18rpx;
        border-radius: 50%;
        background: $qs-brandColor;
      }
    }

    .voucher-toggle-text {
      font-size: 26rpx;
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
