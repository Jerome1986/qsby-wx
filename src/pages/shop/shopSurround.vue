<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { contentSurroundingApi } from '@/api/content'
import type { ContentPageData } from '@/types/Content'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const loading = ref(false)
const pageData = ref<ContentPageData | null>(null)

const DEFAULT_COVER = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/qiansubaiyuan.jpg'
const DEFAULT_IMAGES = [
  'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/02.jpg',
  'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/03.jpg',
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await contentSurroundingApi()
    pageData.value = res.data
  } catch {
    uni.showToast({ icon: 'none', title: '获取周边推荐失败' })
  } finally {
    loading.value = false
  }
}

onLoad(() => fetchData())
</script>

<template>
  <view class="shop-surround">
    <NavHead :title="pageData?.heroTitle || '周边推荐'" :show-back="true" />
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    <scroll-view v-else class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view style="padding: 24rpx;">
        <!-- 封面 + 主标题 -->
        <view class="hero-card">
          <view class="hero-cover">
            <image :src="pageData?.cover || DEFAULT_COVER" mode="aspectFill" />
            <view class="hero-mask"></view>
            <view class="hero-title">{{ pageData?.heroTitle || '周边推荐' }}</view>
            <view class="hero-subtitle">{{ pageData?.heroSubtitle || '探索周边' }}</view>
          </view>
        </view>

        <!-- 开篇 -->
        <view class="card intro-card" v-if="pageData?.introText">
          <view class="card-content">{{ pageData.introText }}</view>
        </view>

        <!-- 章节 -->
        <view
          class="card section-card"
          v-for="(section, idx) in (pageData?.sections || [])"
          :key="idx"
        >
          <view class="section-header">
            <view class="section-num">{{ section.num }}</view>
            <view class="section-title">{{ section.title }}</view>
          </view>
          <view class="card-content" v-if="section.content">{{ section.content }}</view>
          <view class="bullet-list" v-if="section.bulletItems?.length">
            <view class="bullet-item" v-for="(bullet, bi) in section.bulletItems" :key="bi">
              {{ bullet }}
            </view>
          </view>
          <view class="sub-block" v-for="(sub, si) in (section.subBlocks || [])" :key="si">
            <view class="sub-title">{{ sub.subTitle }}</view>
            <view class="card-content">{{ sub.content }}</view>
          </view>
        </view>

        <!-- 配图 -->
        <view class="card images-card" v-if="(pageData?.galleryImages?.length || 0) > 0 || pageData === null">
          <view class="card-title">{{ pageData?.galleryTitle || '周边风采' }}</view>
          <view class="images-grid">
            <view
              class="image-item"
              v-for="(img, index) in (pageData?.galleryImages ?? DEFAULT_IMAGES)"
              :key="index"
            >
              <image :src="img" mode="aspectFill" />
            </view>
          </view>
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

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

.card {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
  margin-top: 24rpx;
}

.hero-card {
  margin-top: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.card-title {
  font-size: 28rpx;
  font-weight: bold;
  color: $qs-font-title;
  margin-bottom: 20rpx;
}

.card-content {
  font-size: 26rpx;
  color: $qs-font-dec;
  line-height: 1.85;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
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

.section-card {
  .section-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;
  }

  .section-num {
    width: 56rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    font-size: 24rpx;
    font-weight: bold;
    color: #ffffff;
    background: $qs-brandColor;
    border-radius: 12rpx;
    flex-shrink: 0;
  }

  .section-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
    line-height: 1.4;
  }

  .sub-block {
    margin-top: 24rpx;
    padding-left: 20rpx;
    border-left: 4rpx solid $qs-brandColor;
  }

  .sub-title {
    font-size: 26rpx;
    font-weight: 600;
    color: $qs-font-title;
    margin-bottom: 12rpx;
  }

  .bullet-list {
    margin: 16rpx 0 20rpx;
  }

  .bullet-item {
    position: relative;
    padding-left: 24rpx;
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.85;
    margin-bottom: 12rpx;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 14rpx;
      width: 8rpx;
      height: 8rpx;
      background: $qs-brandColor;
      border-radius: 50%;
    }
  }
}

.images-card {
  .images-grid {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .image-item {
    width: 100%;
    height: 360rpx;
    border-radius: 16rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
