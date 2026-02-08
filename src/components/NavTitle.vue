<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <view class="title">
    <view
      style="width: 10rpx; height: 30rpx; border-radius: 5rpx; background-color: #ffb034"
    ></view>
    <view style="color: #0b0a0a; margin-left: 15rpx">
      {{ title }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
}
</style>
