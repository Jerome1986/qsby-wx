<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { activityPublishPlanApi } from '@/api/activity'
import NavHead from '@/components/NavHead.vue'
import type { PublishPlanBlock, PublishPlanData } from '@/types/Content'

const defaultTitle = '民宿博主计划'
const DEFAULT_COVER = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/qiansubaiyuan.jpg'

type PlanTextBlock = {
  type: 'text'
  num: string
  title: string
  content: string
}

type PlanImageBlock = {
  type: 'image'
  image: string
}

const loading = ref(false)
const publishPlan = ref<PublishPlanData>()

const displayBlocks = computed(() => {
  return (publishPlan.value?.blocks || []).filter((block: PublishPlanBlock) => {
    if (block.type === 'text') return block.text.trim()
    if (block.type === 'image') return block.image.trim()
    return false
  })
})

const formatTextBlock = (text: string, index: number): PlanTextBlock => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const heading = lines[0] || ''
  const headingMatch = heading.match(/^(\d+)(?:\uFE0F?\u20E3|[.、．\s])?\s*(.*)$/)

  return {
    type: 'text',
    num: headingMatch?.[1] || `${index + 1}`,
    title: (headingMatch?.[2] || heading || `内容${index + 1}`).trim(),
    content: lines.slice(1).join('\n\n'),
  }
}

const planBlocks = computed<(PlanTextBlock | PlanImageBlock)[]>(() => {
  return displayBlocks.value.map((block, index) => {
    if (block.type === 'image') {
      return {
        type: 'image',
        image: block.image,
      }
    }

    return formatTextBlock(block.text, index)
  })
})

const fetchPublishPlan = async () => {
  loading.value = true
  try {
    const res = await activityPublishPlanApi()
    console.log('计划', res)

    publishPlan.value = res.data
  } catch (err) {
    uni.showToast({
      icon: 'none',
      title: '获取内容失败',
    })
    console.error(err)
  } finally {
    loading.value = false
  }
}

onLoad(() => {
  fetchPublishPlan()
})
</script>

<template>
  <view class="publish-plan">
    <NavHead :title="publishPlan?.title || defaultTitle" :show-back="true"></NavHead>

    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <scroll-view v-else class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="content-inner">
        <view class="hero-card">
          <view class="hero-cover">
            <image :src="DEFAULT_COVER" mode="aspectFill" />
            <view class="hero-mask"></view>
            <view class="hero-title">{{ publishPlan?.title || defaultTitle }}</view>
            <view class="hero-subtitle">民宿博主计划</view>
          </view>
        </view>

        <template v-if="planBlocks.length">
          <template v-for="(block, index) in planBlocks" :key="`${block.type}-${index}`">
            <view v-if="block.type === 'text'" class="card section-card">
              <view class="section-header">
                <view class="section-num">{{ block.num }}</view>
                <view class="section-title">{{ block.title }}</view>
              </view>
              <view class="card-content" v-if="block.content">{{ block.content }}</view>
            </view>

            <view v-else class="card images-card">
              <view class="image-item">
                <image :src="block.image" mode="aspectFill" />
              </view>
            </view>
          </template>
        </template>

        <view v-else class="empty-tip">
          <text>暂无内容</text>
        </view>

        <view class="scroll-bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.publish-plan {
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
}

.empty-tip {
  padding: 60rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
  text-align: center;
}

.scroll-bottom-placeholder {
  height: 20rpx;
}

/* 卡片通用 */
.card {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
  margin-top: 24rpx;
}

.card-content {
  font-size: 26rpx;
  color: $qs-font-dec;
  line-height: 1.85;
  margin-bottom: 20rpx;
  text-align: justify;
  white-space: pre-wrap;

  &:last-child {
    margin-bottom: 0;
  }
}

/* 封面 hero */
.hero-card {
  margin-top: 0;
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
    right: 24rpx;
    bottom: 48rpx;
    font-size: 44rpx;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 4rpx;
    line-height: 1.25;
  }

  .hero-subtitle {
    position: absolute;
    left: 24rpx;
    bottom: 20rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 章节卡片 */
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
}

/* 配图 */
.images-card {
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
