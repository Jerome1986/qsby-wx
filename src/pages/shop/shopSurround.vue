<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { contentSurroundingByStoreIdApi } from '@/api/content'
import { shopDetailApi } from '@/api/store'
import type { StoreSurroundData, StoreItem } from '@/types/store'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const shopId = ref('')
const loading = ref(false)
const storeInfo = ref<StoreItem | null>(null)
const surroundData = ref<StoreSurroundData | null>(null)

const DEFAULT_COVER = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/qiansubaiyuan.jpg'

const fetchData = async () => {
  if (!shopId.value) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const [shopRes, surroundRes] = await Promise.all([
      shopDetailApi(shopId.value),
      contentSurroundingByStoreIdApi(shopId.value),
    ])
    storeInfo.value = shopRes.data?.shopInfo || null
    surroundData.value = surroundRes.data
  } catch {
    uni.showToast({ icon: 'none', title: '获取周边推荐失败' })
  } finally {
    loading.value = false
  }
}

onLoad((options) => {
  shopId.value = options?.shopId || ''
  fetchData()
})
</script>

<template>
  <view class="shop-surround">
    <NavHead :title="storeInfo?.name || '周边推荐'" :show-back="true" />
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    <scroll-view v-else class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="content-inner">
        <!-- 封面 + 主标题（使用门店数据） -->
        <view class="hero-card">
          <view class="hero-cover">
            <image :src="storeInfo?.cover || DEFAULT_COVER" mode="aspectFill" />
            <view class="hero-mask"></view>
            <view class="hero-title">{{ storeInfo?.name || '周边推荐' }}</view>
          </view>
        </view>

        <!-- 图文区块（统一背景） -->
        <view class="blocks-card" v-if="surroundData?.blocks?.length">
          <template v-for="(block, idx) in surroundData.blocks" :key="idx">
            <view v-if="block.type === 'text'" class="block-text">{{ block.content }}</view>
            <view v-else-if="block.type === 'image'" class="block-image">
              <image :src="block.content" mode="widthFix" />
            </view>
          </template>
        </view>

        <view v-else-if="!loading && !surroundData?.blocks?.length" class="empty-tip">
          <text>{{ !shopId ? '请从门店详情页进入' : '暂无周边推荐' }}</text>
        </view>

        <view class="scroll-bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.shop-surround {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  @include page-background();
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.content {
  flex: 1;
}

.content-inner {
  padding: 24rpx;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

.empty-tip {
  padding: 60rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: $qs-font-dec;
}

/* 封面 hero */
.hero-card {
  margin-bottom: 24rpx;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.hero-cover {
  position: relative;
  width: 100%;
  height: 360rpx;
  border-radius: 24rpx;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
  }

  .hero-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
  }

  .hero-title {
    position: absolute;
    left: 24rpx;
    bottom: 48rpx;
    font-size: 44rpx;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 4rpx;
  }

  .hero-subtitle {
    position: absolute;
    left: 24rpx;
    bottom: 20rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 图文区块（统一背景） */
.blocks-card {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 20rpx;
  @include customShadow();

  .block-text {
    font-size: 28rpx;
    color: $qs-font-dec;
    line-height: 1.85;
    text-align: justify;
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .block-image {
    margin-bottom: 24rpx;
    border-radius: 12rpx;
    overflow: hidden;

    &:last-child {
      margin-bottom: 0;
    }

    image {
      width: 100%;
      display: block;
    }
  }
}
</style>
