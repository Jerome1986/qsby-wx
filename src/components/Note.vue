<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { contentBookingNoteApi } from '@/api/content'
import type { BookingNoteItem } from '@/types/Content'
import { watch, ref } from 'vue'

const props = defineProps<{
  storeId?: string
}>()

const noteList = ref<BookingNoteItem[]>([])

const fetchBookingNote = async () => {
  if (!props.storeId) return
  try {
    const res = await contentBookingNoteApi(props.storeId)
    noteList.value = res.data?.items || []
  } catch {
    noteList.value = []
  }
}

watch(
  () => props.storeId,
  (val) => {
    if (val) fetchBookingNote()
    else noteList.value = []
  },
  { immediate: true },
)
</script>

<template>
  <view class="note" v-if="noteList.length > 0">
    <NavTitle title="预约须知"></NavTitle>
    <view class="note-list">
      <view class="note-item" v-for="(item, index) in noteList" :key="index">
        <view class="note-title">{{ index + 1 }}. {{ item.title }}</view>
        <view class="note-content">
          <view v-for="(para, pIdx) in (item.content || [])" :key="pIdx" class="note-paragraph">{{ para }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*预约须知*/
.note {
  padding: 39rpx 37rpx;
  margin-top: 20rpx;
  margin-bottom: 24rpx;
  background: $qs-card-bg;
  border-radius: 20rpx;
  @include customShadow();

  .note-list {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 30rpx;

    .note-item {
      .note-title {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        margin-bottom: 12rpx;
      }

      .note-content {
        font-size: 24rpx;
        color: $qs-font-dec;
        line-height: 1.6;
        text-align: justify;

        .note-paragraph {
          margin-bottom: 8rpx;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
