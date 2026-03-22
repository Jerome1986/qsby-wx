<script setup lang="ts">
import { contentTipsListApi } from '@/api/content'
import type { TipsItem } from '@/types/Content'
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 温馨提示类型，与后端 tips 集合 type 一致 */
    type: 'trip' | 'activity' | 'project'
  }>(),
  {},
)

const loading = ref(false)
const tipsList = ref<TipsItem[]>([])

const fetchTips = async () => {
  loading.value = true
  try {
    const res = await contentTipsListApi(props.type)
    tipsList.value = res.data || []
  } catch {
    tipsList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchTips())
</script>

<template>
  <view class="tips-block" v-if="!loading && tipsList.length > 0">
    <template v-for="(item, idx) in tipsList" :key="item._id || idx">
      <view class="tips-item-block">
        <view class="tips-title">{{ item.title || '温馨提示' }}</view>
        <view class="tips-content">
          <view v-for="(line, i) in (item.items || [])" :key="i" class="tips-line">
            {{ line }}
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<style scoped lang="scss">
.tips-block {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.tips-item-block {
  .tips-title {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 16rpx;
  }

  .tips-content {
    .tips-line {
      font-size: 24rpx;
      color: $qs-font-dec;
      line-height: 1.8;
      margin-bottom: 8rpx;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
