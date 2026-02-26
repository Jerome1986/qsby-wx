<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
// type: 'image' 图片 | 'text' 文字
const detailList = [
  {
    type: 'text',
    content:
      '湖景大床房位于酒店主楼高层，拥有绝佳的湖景视野。房间面积约45平方米，配备King Size大床，让您尽享舒适睡眠。',
  },
  {
    type: 'image',
    content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
  },
  {
    type: 'text',
    content:
      '房间内设施齐全，配有独立卫浴、智能马桶、雨淋花洒、高速WiFi、55寸智能电视等。落地窗设计，白天可欣赏湖光山色，夜晚可观赏城市夜景。',
  },
  {
    type: 'image',
    content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
  },
  {
    type: 'text',
    content: '每日提供免费矿泉水、茶包及咖啡。入住期间可免费使用健身房、游泳池等酒店设施。',
  },
  {
    type: 'image',
    content: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
  },
]
</script>

<template>
  <view class="detail">
    <view class="detail-content">
      <NavTitle title="图文详情"></NavTitle>
      <view class="detail-list">
        <template v-for="(item, index) in detailList" :key="index">
          <!-- 文字 -->
          <view v-if="item.type === 'text'" class="detail-text">
            {{ item.content }}
          </view>
          <!-- 图片 -->
          <image
            v-else-if="item.type === 'image'"
            :src="item.content"
            mode="widthFix"
            class="detail-img"
          ></image>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*图文详情*/
.detail {
  margin-top: 20rpx;

  .detail-content {
    padding: 30rpx;
    background: #ffffff;
    border-radius: 20rpx;
    @include customShadow();
    overflow: hidden;

    .detail-list {
      margin-top: 20rpx;
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .detail-text {
        font-size: 26rpx;
        color: $qs-font-dec;
        line-height: 1.8;
        text-align: justify;
      }

      .detail-img {
        width: 100%;
        display: block;
        border-radius: 12rpx;
      }
    }
  }
}
</style>
