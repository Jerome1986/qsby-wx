<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'
import TipsBlock from '@/components/TipsBlock.vue'
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import UQRCode from 'uqrcodejs'
import type { ScoreOrder } from '@/types/Score'
import { scoreOrderFindOne } from '@/api/order'
import { formatTimestamp } from '@/utils/generateMonth'

const orderId = ref('')
const orderDetail = ref<ScoreOrder | null>(null)
const loading = ref(false)

const fetchOrderDetail = async () => {
  if (!orderId.value) return
  loading.value = true
  try {
    const res = await scoreOrderFindOne(orderId.value)
    console.log('订单详情', res)

    orderDetail.value = res.data
  } catch {
    orderDetail.value = null
    uni.showToast({ icon: 'none', title: '获取订单失败' })
  } finally {
    loading.value = false
  }
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
  { immediate: true },
)

// 复制核销码
const handleCopyVerifyCode = () => {
  const code = orderDetail.value?.verifyCode
  if (!code) return
  uni.setClipboardData({
    data: code,
    success: () => {
      uni.showToast({ icon: 'success', title: '券号已复制' })
    },
    fail: () => {
      uni.showToast({ icon: 'none', title: '复制失败，请重试' })
    },
  })
}

onLoad((options) => {
  orderId.value = options?.orderId || ''
  fetchOrderDetail()
})
</script>

<template>
  <view class="exchange">
    <NavHead title="积分兑换" :show-back="true"></NavHead>
    <view class="content" v-if="!loading && orderDetail">
      <!--  商品信息和使用期限  -->
      <view class="usedTime">
        <view class="product-row" v-if="orderDetail.productCover">
          <image class="product-cover" :src="orderDetail.productCover" mode="aspectFill"></image>
          <view class="product-main">
            <view class="productName">{{ orderDetail.productName }}</view>
            <view class="score-row">消耗 {{ orderDetail.payScore }} 积分</view>
            <view class="time">兑换时间：{{ formatTimestamp(orderDetail.createdAt, 2) }}</view>
          </view>
        </view>
        <view v-else>
          <view class="productName">{{ orderDetail.productName }}</view>
          <view class="score-row">消耗 {{ orderDetail.payScore }} 积分</view>
          <view class="time">兑换时间：{{ formatTimestamp(orderDetail.createdAt, 2) }}</view>
        </view>
      </view>
      <!--  使用流程  -->
      <view class="progress">
        <NavTitle title="使用流程"></NavTitle>
        <view class="progress-text">购买后→联系店家→确认预约→再进店（不接受没有预约）</view>
        <!-- 核销码（已支付才展示） -->
        <view class="qrcode-wrap" v-if="orderDetail.status === 'paid' && orderDetail.verifyCode">
          <view class="qrcode-grid" v-if="qrcodeModules.length">
            <view v-for="(row, rowI) in qrcodeModules" :key="rowI" class="qrcode-row">
              <view v-for="(col, colI) in row" :key="colI" class="qrcode-cell" :class="{ black: col.isBlack }"></view>
            </view>
          </view>
          <view class="number" @tap="handleCopyVerifyCode">
            券号 {{ orderDetail.verifyCode }}·<text class="copy-btn">复制</text>
          </view>
        </view>
        <view class="qrcode-placeholder" v-else-if="!orderDetail.verifyCode">
          <text class="placeholder-text">核销码生成中...</text>
        </view>
        <view class="qrcode-placeholder" v-else>
          <text class="placeholder-text">支付成功后显示核销码</text>
        </view>
      </view>
      <!--  温馨提示  -->
      <view class="tips">
        <TipsBlock type="project" />
      </view>
    </view>
    <view class="loading-wrap" v-else-if="loading">
      <text>加载中...</text>
    </view>
    <view class="empty-wrap" v-else>
      <text>订单不存在或加载失败</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.exchange {
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

/* 加载/空状态 */
.loading-wrap,
.empty-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
}

/* 内容卡片 */
.content {
  padding: 24rpx;
  min-height: 200rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  @include customShadow();
}

/* 商品信息和使用期限 */
.usedTime {

  /* 商品名称 */
  .productName {
    font-weight: bold;
    font-size: 28rpx;
    color: $qs-font-title;
  }

  .product-row {
    display: flex;
    gap: 20rpx;
  }

  .product-cover {
    width: 160rpx;
    height: 160rpx;
    flex-shrink: 0;
    border-radius: 12rpx;
    background-color: #f5f5f5;
  }

  .product-main {
    flex: 1;
    min-width: 0;
    height: 160rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .score-row {
    font-size: 26rpx;
    color: $qs-brandColor;
    font-weight: 500;
  }

  /* 使用期限 */
  .time {
    font-size: 24rpx;
    color: $qs-font-dec;
  }
}

/* 使用流程 */
.progress {
  margin-top: 30rpx;

  /* 流程说明文字 */
  .progress-text {
    margin: 16rpx 0;
    font-size: 24rpx;
    color: $qs-font-dec;
  }

  /* 核销码区域（参考 orderDetail） */
  .qrcode-wrap {
    margin: 40rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .qrcode-grid {
      display: flex;
      flex-direction: column;
      width: 200rpx;
      height: 200rpx;
      background-color: #fff;
      border-radius: 16rpx;
      overflow: hidden;
      border: 2rpx solid #eee;
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

    .number {
      margin-top: 24rpx;
      text-align: center;
      font-size: 24rpx;
      color: $qs-font-dec;

      .copy-btn {
        color: #6897ed;
        font-size: 24rpx;
      }
    }
  }

  .qrcode-placeholder {
    margin: 40rpx 0;
    text-align: center;

    .placeholder-text {
      font-size: 26rpx;
      color: $qs-font-dec;
    }
  }
}

/* 温馨提示 */
.tips {
  margin-top: 30rpx;

  :deep(.tips-block) {
    margin-top: 20rpx;
  }
}
</style>
