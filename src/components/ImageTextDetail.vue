<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'

withDefaults(defineProps<{
  images: string[]
}>(), {})


</script>

<template>
  <view class="detail">
    <view class="detail-content">
      <NavTitle title="图文详情"></NavTitle>
      <view class="detail-list">
        <template v-for="(item, index) in images" :key="index">
          <!-- 图片 -->
          <image :src="item" mode="widthFix" class="detail-img"></image>
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
    background: $qs-card-bg;
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
