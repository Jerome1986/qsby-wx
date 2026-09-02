<script setup lang="ts">
import { computed } from 'vue'
import { openLocation } from '@/composables/openLocation'
import { useShopStore, useUserStore } from '@/stores'
import type { StoreItem } from '@/types/store'

const props = withDefaults(
  defineProps<{
    type: string
    shopInfo?: StoreItem
    price?: number
    specLabel?: string
    commission?: number
  }>(),
  {
    type: 'score',
  },
)

// 门店store
const shopStore = useShopStore()
const userStore = useUserStore()

const currentShopInfo = computed(() => props.shopInfo ?? shopStore.shopInfo)

const handleCallPhone = () => {
  const phone = currentShopInfo.value?.phone
  if (!phone) {
    uni.showToast({ icon: 'none', title: '暂无联系电话' })
    return
  }

  uni.makePhoneCall({
    phoneNumber: phone,
    success: (success) => {
    },
    fail: (fail) => {
      uni.showToast({ icon: 'none', title: '已取消/无法联系' })
    },
  })
}

const handleOpenLocation = () => {
  const shopInfo = currentShopInfo.value
  if (shopInfo?.latitude == null || shopInfo.longitude == null) {
    uni.showToast({ icon: 'none', title: '暂无位置信息' })
    return
  }

  openLocation(shopInfo.latitude, shopInfo.longitude, shopInfo.name, shopInfo.address)
}
console.log(shopStore.shopInfo)

</script>

<template>
  <view class="info">
    <!--   积分   -->
    <view class="price" v-if="type === 'score'">
      <text class="iconfont icon-shijian"></text>
      <view class="value">积分：100积分</view>
    </view>
    <view class="price" v-if="type === 'product'">
      <text class="iconfont icon-shijian"></text>
      <view class="value" style="display: flex;align-items: flex-start;">
        <text style="margin-right: 40rpx;">价格:{{ price }}{{ specLabel ? `/${specLabel}` : '' }}</text>
        <text v-if="userStore.isValidManager" style="font-size: 28rpx;color: #919191;">佣金:{{ commission
          }}</text>
      </view>
    </view>
    <!--   位置和商家名称   -->
    <view class="info-row">
      <view class="info-main">
        <view class="info-title">
          <text class="iconfont icon-dingwei"></text>
          <text class="title-text" style="margin-left: 10rpx">{{ currentShopInfo?.name }}</text>
        </view>
        <view class="info-desc">
          {{ currentShopInfo?.address }}
        </view>
      </view>
      <view class="info-action" @tap="handleOpenLocation">
        <text class="iconfont icon-ditu" style="color: #f7821a; font-size: 40rpx"></text>
        <view style="font-size: 24rpx; color: #919191">地图</view>
      </view>
    </view>
    <!--   预约流程   -->
    <view class="info-row">
      <view class="info-main">
        <view class="info-title">
          <text class="iconfont icon-shoucang"></text>
          <text class="title-text" style="margin-left: 10rpx">预约流程</text>
        </view>
        <view class="info-desc"> 购买商品→致电商家预约→商家确认后→再进店消费 </view>
      </view>
      <view class="info-action" @tap="handleCallPhone">
        <text class="iconfont icon-dianhuabodadianhua" style="color: #f7821a; font-size: 40rpx"></text>
        <view style="font-size: 24rpx; color: #919191">预约</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 50rpx;
  padding: 39rpx 37rpx;
  margin-top: 20rpx;
  background: #fef8e5;
  border-radius: 20rpx;
  @include customShadow();

  /* 积分/价格行 */
  .price {
    display: flex;
    align-items: center;
    gap: 10rpx;
    color: $qs-font-title;
    font-weight: bold;
  }

  /* 商品价格行（左右布局） */
  .product-price {
    display: flex;
    align-items: center;
    color: $qs-font-title;
    font-weight: bold;

    .left {
      margin-right: 50rpx;
      display: flex;
      align-items: center;
      gap: 10rpx;
    }

    .commission {
      font-size: 28rpx;
      color: $qs-font-dec2;
    }
  }

  /*通用信息行*/
  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .info-main {
      flex: 1;

      .info-title {
        margin-bottom: 10rpx;
        font-weight: bold;
        color: $qs-font-title;
      }

      .info-desc {
        font-size: 24rpx;
        color: $qs-font-dec;
      }
    }

    .info-action {
      margin-left: 30rpx;
      text-align: center;
    }
  }
}
</style>
