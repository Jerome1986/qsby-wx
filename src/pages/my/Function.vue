<script setup lang="ts">
import { functionData, functionJumpMap } from '@/pages/my/myConfig.ts'
import { useUserStore } from '@/stores'
import type { FeatureType } from '@/types/My'

const userStore = useUserStore()

// 处理功能区路径跳转
const handleNav = (val: FeatureType) => {
  console.log('类型', val)
  // 验证登录
  if (!userStore.profile?._id) {
    uni.showToast({ icon: 'none', title: '请登录后使用', duration: 1000, mask: true })
    return
  }
  // 跳转
  functionJumpMap[val]()
}
</script>

<template>
  <view class="function">
    <view class="function-item" v-for="(item, index) in functionData" :key="index" @tap="handleNav(item.type)">
      <image class="icon" :src="item.icon" mode="aspectFit"
        :style="item.iconSize ? { width: item.iconSize + 'rpx', height: item.iconSize + 'rpx' } : {}"></image>
      <view class="text">{{ item.text }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*功能区*/
.function {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 140rpx;
  background: #fef8e5;
  border-radius: 30rpx;
  @include customShadow();

  .function-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;

    .icon {
      width: 60rpx;
      height: 60rpx;
    }

    .text {
      font-size: 24rpx;
      color: $qs-font-title;
    }
  }
}
</style>
