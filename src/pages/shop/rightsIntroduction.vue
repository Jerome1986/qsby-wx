<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { contentRightsListApi } from '@/api/content'
import type { RightsBenefitsItem, RightsType } from '@/types/Content'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

/** 前端导航类型 → 后端 rights type */
const NAV_TO_RIGHTS: Record<string, RightsType> = {
  bloggers: 'homestay',
  planners: 'activity',
  travel: 'travel',
}

const loading = ref(false)
const title = ref('')
const routeType = ref('')
const rightsList = ref<RightsBenefitsItem[]>([])

/** 根据路由 type 过滤出当前权益项 */
const displayItems = computed(() => {
  const rightsType = NAV_TO_RIGHTS[routeType.value]
  if (!rightsType) return rightsList.value
  return rightsList.value.filter((i) => i.type === rightsType)
})

const fetchRights = async () => {
  loading.value = true
  try {
    const res = await contentRightsListApi()
    rightsList.value = res.data || []
  } catch {
    uni.showToast({ icon: 'none', title: '获取权益说明失败' })
  } finally {
    loading.value = false
  }
}

onLoad((options) => {
  title.value = options?.title || '权益说明'
  routeType.value = options?.type || ''
  fetchRights()
})
</script>

<template>
  <view class="rightsIntroduction">
    <NavHead :title="title" :show-back="true"></NavHead>
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>
    <scroll-view v-else class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="content-inner">
        <view
          class="rights-card"
          v-for="(item, index) in displayItems"
          :key="item._id || index"
        >
          <view class="card-header">
            <view class="bar"></view>
            <view class="card-title">{{ item.title }}</view>
          </view>
          <view class="card-content" v-if="item.content">{{ item.content }}</view>
          <view class="card-image" v-if="item.image">
            <image :src="item.image" mode="widthFix" />
          </view>
        </view>
        <view v-if="!loading && displayItems.length === 0" class="empty">
          <text>暂无权益说明</text>
        </view>
        <view class="scroll-bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.rightsIntroduction {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  padding: 24rpx 24rpx 48rpx;
}

.empty {
  padding: 60rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: $qs-font-dec;
}

/* 单个权益卡片 */
.rights-card {
  padding: 28rpx;
  margin-bottom: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  &:last-of-type {
    margin-bottom: 0;
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .bar {
      width: 6rpx;
      height: 28rpx;
      margin-right: 12rpx;
      background: linear-gradient(180deg, $qs-brandColor, darken($qs-brandColor, 8%));
      border-radius: 3rpx;
    }

    .card-title {
      flex: 1;
      font-size: 32rpx;
      font-weight: bold;
      color: $qs-font-title;
      line-height: 1.4;
    }
  }

  .card-content {
    font-size: 28rpx;
    color: $qs-font-dec;
    line-height: 1.85;
    margin-bottom: 20rpx;
    text-align: justify;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .card-image {
    border-radius: 16rpx;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.04);

    image {
      width: 100%;
      display: block;
    }
  }
}

.scroll-bottom-placeholder {
  height: 20rpx;
}
</style>
