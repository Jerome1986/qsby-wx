<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { storeScenicDetailApi } from '@/api/store'
import NavHead from '@/components/NavHead.vue'
import type { ScenicItem } from '@/types/Scenic'

const scenicId = ref('')
const scenicDetail = ref<ScenicItem>()
const loading = ref(false)
const hasFetched = ref(false)

const tagList = computed(() => {
  return scenicDetail.value?.tag?.split(/[、,\s]+/).filter(Boolean) || []
})

const detailBlocks = computed(() => {
  return scenicDetail.value?.detailBlocks?.filter((item) => item.content) || []
})

const previewImages = computed(() => {
  return detailBlocks.value.filter((item) => item.type === 'image').map((item) => item.content)
})

const scenicDetailGet = async (): Promise<void> => {
  if (!scenicId.value || loading.value) return
  loading.value = true

  try {
    const res = await storeScenicDetailApi(scenicId.value)
    console.log('景区详情', res)

    scenicDetail.value = res.data || undefined
  } catch (err) {
    console.error('获取景区详情失败', err)
    uni.showToast({ icon: 'none', title: '获取景区详情失败' })
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

const previewImage = (current: string): void => {
  uni.previewImage({
    current,
    urls: previewImages.value,
  })
}

onLoad((options) => {
  scenicId.value = String(options?.scenicId || '')

  if (!scenicId.value) {
    hasFetched.value = true
    uni.showToast({ icon: 'none', title: '景区ID不能为空' })
    return
  }

  scenicDetailGet()
})
</script>

<template>
  <view class="scenic-detail-page">
    <NavHead title="景区详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="content-inner">
        <view v-if="loading && !scenicDetail" class="loading">加载中...</view>

        <view v-else-if="hasFetched && !scenicDetail" class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="aspectFit"></image>
          <text class="empty-text">暂无景区详情</text>
        </view>

        <template v-else-if="scenicDetail">
          <view class="banner">
            <image :src="scenicDetail.cover" mode="aspectFill"></image>
          </view>

          <view class="info-card">
            <view class="name">{{ scenicDetail.name }}</view>
            <view class="tag-list" v-if="tagList.length">
              <text class="tag-item" v-for="tag in tagList" :key="tag">{{ tag }}</text>
            </view>
            <view class="address-row">
              <text class="address-label">地址</text>
              <text class="address-value">{{ scenicDetail.address }}</text>
            </view>

            <view class="summary-card">
              <view class="summary-item">
                <text class="summary-value">{{ scenicDetail.distance }}</text>
                <text class="summary-label">距离门店</text>
              </view>
              <view class="summary-item price-item">
                <text class="summary-value price">¥{{ scenicDetail.price.replace('+', '') }}起</text>
                <text class="summary-label">门票参考</text>
              </view>
            </view>
          </view>

          <view class="detail-section">
            <view class="section-head">
              <text class="section-title">图文详情</text>
            </view>
            <view class="detail-block-list">
              <template v-for="(block, index) in detailBlocks" :key="`${block.type}-${index}`">
                <view v-if="block.type === 'text'" class="detail-text">{{ block.content }}</view>
                <image v-else class="detail-image" :src="block.content" mode="widthFix"
                  @tap="previewImage(block.content)"></image>
              </template>
            </view>
          </view>

          <view class="scroll-bottom-placeholder"></view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.scenic-detail-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
}

.content-inner {
  padding: 20rpx 24rpx 0;
}

.loading,
.empty {
  padding: 120rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-img {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 24rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: $qs-font-dec;
  }
}

.banner {
  height: 390rpx;
  margin-bottom: 20rpx;
  border-radius: 18rpx;
  overflow: hidden;
  background-color: #f4f4f4;
  box-shadow: 0 8rpx 18rpx rgba(68, 51, 12, 0.12);

  image {
    width: 100%;
    height: 100%;
  }
}

.info-card {
  padding: 28rpx 24rpx 24rpx;
  margin-bottom: 20rpx;
  background-color: $qs-card-bg;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 18rpx rgba(68, 51, 12, 0.1);
}

.name {
  margin-bottom: 16rpx;
  font-size: 36rpx;
  font-weight: bold;
  line-height: 1.3;
  color: $qs-font-title;
}

.address-row {
  display: flex;
  gap: 16rpx;
  padding-top: 18rpx;
  margin-top: 18rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.08);
  font-size: 26rpx;
  line-height: 1.5;
}

.address-label {
  flex-shrink: 0;
  color: $qs-font-title;
  font-weight: 500;
}

.address-value {
  flex: 1;
  min-width: 0;
  color: $qs-font-dec;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding-top: 24rpx;
  margin-top: 24rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.08);
}

.summary-item {
  flex: 1;
  min-width: 0;
  padding: 16rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6rpx;
  border-radius: 14rpx;
  background-color: rgba($qs-brandColor, 0.12);
}

.price-item {
  align-items: flex-end;
  background-color: rgba(247, 130, 26, 0.1);
}

.summary-value {
  max-width: 100%;
  font-size: 28rpx;
  font-weight: bold;
  color: $qs-font-title;
  line-height: 1.3;
  @include ellipsis(1);
}

.summary-value.price {
  color: #f7821a;
}

.summary-label {
  font-size: 23rpx;
  color: $qs-font-dec;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag-item {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background-color: rgba($qs-brandColor, 0.2);
  font-size: 24rpx;
  color: $qs-font-title;
}

.detail-section {
  padding: 28rpx 24rpx 8rpx;
  margin-bottom: 20rpx;
  background-color: $qs-card-bg;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 18rpx rgba(68, 51, 12, 0.1);
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 22rpx;
}

.section-title {
  font-size: 30rpx;
  line-height: 1.3;
  color: $qs-font-title;
  font-weight: bold;
}

.detail-block-list {
  overflow: hidden;
}

.detail-text {
  margin-bottom: 22rpx;
  font-size: 28rpx;
  line-height: 1.75;
  color: $qs-font-title;
  white-space: pre-line;
}

.detail-image {
  display: block;
  width: 100%;
  margin-bottom: 22rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.scroll-bottom-placeholder {
  height: 56rpx;
}
</style>
