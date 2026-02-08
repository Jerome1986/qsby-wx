<script setup lang="ts">
defineProps<{
  imageUrl: string
  tips: string
}>()
</script>

<template>
  <view class="noFriend">
    <image :src="imageUrl" mode="aspectFit"></image>
    <view class="tips">{{ tips }}</view>
  </view>
</template>

<style scoped lang="scss">
/*无数据提示*/
.noFriend {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100% - 188rpx);
  image {
    width: 434rpx;
    height: 292rpx;
  }
  .tips {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #9d9d9d;
  }
}
</style>
