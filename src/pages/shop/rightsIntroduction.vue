<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 文本内容类型
interface DetailItem {
  type: 'title' | 'text' | 'image'
  content: string
}

// 权益说明数据
const detailList = ref<DetailItem[]>([])
// 页面标题
const title = ref('')

onLoad((options: any) => {
  console.log('参数', options)
  // 设置动态标题
  title.value = options?.title
  // TODO: 根据 type 请求对应权益说明数据，以下为模拟数据
  detailList.value = [
    { type: 'title', content: '权益一：免费入住体验' },
    {
      type: 'text',
      content:
        '签约博主每月可享受一次免费民宿入住体验，涵盖平台合作的所有精选民宿，入住时长最多3天2晚。',
    },
    {
      type: 'image',
      content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    },
    { type: 'title', content: '权益二：流量扶持' },
    {
      type: 'text',
      content:
        '平台将为签约博主提供专属流量扶持，发布的内容将获得优先推荐，帮助博主快速积累粉丝和曝光。',
    },
    {
      type: 'image',
      content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
    },
  ]
 
})
</script>
<template>
  <view class="rightsIntroduction">
    <NavHead :title="title" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="detail-card">
        <view class="detail-list">
          <template v-for="(item, index) in detailList" :key="index">
            <view v-if="item.type === 'title'" class="detail-title">
              {{ item.content }}
            </view>
            <view v-else-if="item.type === 'text'" class="detail-text">
              {{ item.content }}
            </view>
            <image
              v-else-if="item.type === 'image'"
              :src="item.content"
              mode="widthFix"
              class="detail-img"
            />
          </template>
        </view>
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

.content {
  flex: 1;
  padding: 24rpx;
}

.detail-card {
  padding: 24rpx;
  background: #ffffff;
  border-radius: 20rpx;
  @include customShadow();
  overflow: hidden;

  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .detail-title {
      font-weight: bold;
      color: $qs-font-title;
    }

    .detail-text {
      font-size: 28rpx;
      color: $qs-font-dec;
      text-align: justify;
    }

    .detail-img {
      width: 100%;
      display: block;
      border-radius: 12rpx;
    }
  }
}
</style>
