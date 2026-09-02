<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import ImageTextDetail from '@/components/ImageTextDetail.vue'
import BottomActionBar from '@/components/BottomActionBar.vue'
import { scoreProductFindOneApi } from '@/api/score'
import { shopDetailApi } from '@/api/store'
import type { ScoreProduct } from '@/types/Score'
import type { StoreItem } from '@/types/store'
import { openLocation } from '@/composables/openLocation'
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'
import { createQrCode, scoreOrderCreate, type ScoreOrderParam } from '@/api/order'

const userStore = useUserStore()

const productId = ref('')
const product = ref<ScoreProduct | null>(null)
const storeInfo = ref<StoreItem | null>(null)
const loading = ref(false)
const exchanging = ref(false)

const currentScore = computed(() => Number(userStore.profile?.score ?? 0))
const hasEnoughScore = computed(() => {
  if (!product.value) return false
  return currentScore.value > 0 && currentScore.value >= Number(product.value.scorePrice)
})
const exchangeDisabled = computed(
  () => !product.value || product.value.stock <= 0 || !hasEnoughScore.value || exchanging.value,
)
const exchangeActionText = computed(() => {
  if (!product.value || product.value.stock <= 0) return '已兑完'
  if (currentScore.value <= 0) return '暂无积分'
  if (!hasEnoughScore.value) return '积分不足'
  return exchanging.value ? '兑换中...' : '立即兑换'
})

const validateScore = () => {
  if (hasEnoughScore.value) return true
  uni.showToast({ icon: 'none', title: currentScore.value <= 0 ? '暂无可用积分' : '积分不足' })
  return false
}

/** 获取商品详情，有 storeId 时顺带拉取门店信息 */
const fetchDetail = async (id: string) => {
  if (!id) return
  loading.value = true
  try {
    const res = await scoreProductFindOneApi(id)
    console.log('详情', res.data)

    product.value = Array.isArray(res.data) ? res.data[0] : res.data
  } catch {
    uni.showToast({ icon: 'none', title: '获取商品详情失败' })
  } finally {
    loading.value = false
  }
}

/** 打开地图查看门店位置 */
const handleViewAddress = () => {
  const shop = storeInfo.value
  if (!shop?.address) return
  if (shop.latitude != null && shop.longitude != null) {
    openLocation(shop.latitude, shop.longitude, shop.name || '门店', shop.address)
  } else {
    uni.showToast({ icon: 'none', title: '暂无位置信息' })
  }
}

/** 拨打门店电话 */
const handleCallPhone = () => {
  const phone = storeInfo.value?.phone || ''
  if (phone) uni.makePhoneCall({ phoneNumber: phone })
  else uni.showToast({ icon: 'none', title: '暂无联系电话' })
}

// 点击立即兑换
const handleExchange = () => {
  if (!product.value) return

  if (product.value.stock < 1) {
    uni.showToast({
      icon: 'none',
      title: '商品已售罄',
    })
    return
  }

  if (product.value.status !== 'active') {
    uni.showToast({ icon: 'none', title: '商品暂不可兑换' })
    return
  }

  if (!validateScore()) return

  if (exchanging.value) return

  uni.showModal({
    title: '提示',
    content: '确定要兑换吗？',
    confirmColor: '#eed261',
    success: async (res) => {
      if (res.confirm) {
        if (!validateScore()) return
        exchanging.value = true
        // 1.准备参数
        console.log('立即兑换')
        const params: ScoreOrderParam = {
          openid: userStore.profile?.openid as string,
          productId: product.value?._id as string,
          productName: product.value?.name as string,
          productCover: product.value?.cover as string,
          payScore: product.value?.scorePrice as number,
        }

        try {
          // 2. 提交积分订单，由服务端校验并扣减商品库存
          const orderRes = await scoreOrderCreate(params)
          console.log(orderRes)

          // 3.如果提交成功，生成卷码并跳入订单详情
          await createQrCode(
            orderRes.data?.orderId,
            userStore.profile?.openid as string,
            'scoreOrder',
          ).catch((err) => console.error('核销码创建失败', err))
          uni.redirectTo({
            url: `/pagesMember/myScore/exchange?orderId=${orderRes.data?.orderId}`,
          })
        } catch (err) {
          console.error('积分商品兑换失败', err)
          uni.showToast({ icon: 'none', title: '兑换失败，请重试' })
          await fetchDetail(productId.value)
        } finally {
          exchanging.value = false
        }
      }
    },
  })
}

onLoad((options) => {
  productId.value = options?.productId || ''
  fetchDetail(productId.value)
})
</script>

<template>
  <view class="productDetail">
    <NavHead title="商品详情" :show-back="true"></NavHead>
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    <template v-else-if="product">
      <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
        <view class="content-inner">
          <!-- 封面图 -->
          <view class="cover-wrap">
            <image class="cover" :src="product.cover" mode="aspectFill"></image>
            <view class="category-tag" v-if="product.categoryName">{{ product.categoryName }}</view>
          </view>
          <!-- 商品信息 -->
          <view class="productInfo">
            <view class="title">{{ product.name }}</view>
            <view class="score-row">
              <view class="score-main">
                <text class="label">所需</text>
                <text class="score-price">{{ product.scorePrice }}</text>
                <text class="score-unit">积分</text>
              </view>
              <view
                class="stock-tag"
                :class="{ warning: product.stock > 0 && product.stock <= 5, empty: product.stock <= 0 }"
              >
                {{ product.stock > 0 ? `剩余 ${product.stock} 件` : '暂无库存' }}
              </view>
            </view>
          </view>
          <!-- 门店信息 -->
          <view class="shopInfo" v-if="storeInfo">
            <view class="top">
              <view class="left">
                <view class="title">{{ storeInfo.name }}</view>
                <view class="address">{{ storeInfo.address || '暂无地址' }}</view>
              </view>
              <view class="right" @tap.stop="handleViewAddress">
                <text class="iconfont icon-ditu"></text>
                <view class="text">地图</view>
              </view>
            </view>
            <view class="bottom">
              <view class="contact-row" @tap.stop="handleCallPhone">
                <text class="contact-text">门店电话：{{ storeInfo.phone || '暂无电话' }}</text>
                <text class="iconfont icon-dianhuabodadianhua contact-icon"></text>
              </view>
            </view>
          </view>
          <!-- 图文详情 -->
          <ImageTextDetail
            v-if="product.coverDescription || product.images?.length"
            :description="product.coverDescription || ''"
            :images="product.images || []"
          ></ImageTextDetail>
          <view class="action-bar-placeholder"></view>
        </view>
      </scroll-view>
      <BottomActionBar
        page-type="score"
        :product-id="productId"
        :disabled="exchangeDisabled"
        :action-text="exchangeActionText"
        @exchange="handleExchange"
      ></BottomActionBar>
    </template>
    <view v-else class="empty">
      <text>商品不存在或已下架</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.productDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

/* 加载中 / 空状态 */
.loading,
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.content {
  flex: 1;
}

.content-inner {
  padding: 24rpx 24rpx 48rpx;
}

/* 商品封面 + 分类标签 */
.cover-wrap {
  position: relative;
  height: 400rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.04);

  .cover {
    width: 100%;
    height: 100%;
  }

  .category-tag {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10rpx 20rpx;
    font-size: 24rpx;
    color: #fff;
    background: linear-gradient(135deg, $qs-brandColor, color.adjust($qs-brandColor, $lightness: -10%));
    border-radius: 24rpx 0 16rpx 0;
    z-index: 1;
  }

}

.productInfo {
  margin-top: 24rpx;
  padding: 28rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  .title {
    font-size: 34rpx;
    font-weight: bold;
    color: $qs-font-title;
    line-height: 1.4;
  }

  .score-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
    padding-top: 18rpx;
    border-top: 1rpx solid rgba($qs-border, 0.6);

    .score-main {
      display: flex;
      align-items: baseline;
      gap: 6rpx;

      .label {
        margin-right: 4rpx;
        font-size: 24rpx;
        color: $qs-font-dec2;
      }

      .score-price {
        font-size: 38rpx;
        font-weight: bold;
        line-height: 1;
        color: #e49a14;
      }

      .score-unit {
        font-size: 24rpx;
        color: #b87910;
      }
    }

    .stock-tag {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 23rpx;
      color: #4f7c63;
      background: #edf8f1;

      &.warning {
        color: #c76b16;
        background: #fff3e5;
      }

      &.empty {
        color: $qs-font-dec2;
        background: #f1f1f1;
      }
    }
  }
}

/* 门店信息（名称、地址、地图、电话） */
.shopInfo {
  margin-top: 24rpx;
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  /* 门店名称、地址 + 地图入口 */
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid rgba($qs-border, 0.8);

    .left {
      flex: 1;
      margin-right: 24rpx;

      .title {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        margin-bottom: 12rpx;
      }

      .address {
        font-size: 24rpx;
        color: $qs-font-dec;
        line-height: 1.5;
        @include ellipsis(2);
      }
    }

    .right {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .iconfont {
        font-size: 40rpx;
        color: $qs-brandColor;
      }

      .text {
        margin-top: 4rpx;
        font-size: 24rpx;
        color: $qs-font-dec;
      }
    }
  }

  /* 拨打电话行 */
  .bottom {
    padding-top: 20rpx;

    .contact-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .contact-text {
        flex: 1;
        font-size: 26rpx;
        color: $qs-font-dec;
        @include ellipsis(1);
      }

      .contact-icon {
        margin-left: 16rpx;
        font-size: 36rpx;
        color: $qs-brandColor;
      }
    }
  }
}

/* 底部操作栏占位 */
.action-bar-placeholder {
  height: calc(130rpx + env(safe-area-inset-bottom));
}
</style>
