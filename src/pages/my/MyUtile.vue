<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { utilsData, utilsJumpMap } from '@/pages/my/myConfig.ts'
import type { myUtilsType } from '@/types/My'

const handleGo = (val: myUtilsType) => {
  if (val !== 'share') {
    utilsJumpMap[val]()
  }
}

</script>

<template>
  <view class="myUtils">
    <NavTitle title="我的工具"></NavTitle>
    <view class="utils">
      <view
        v-for="(item, index) in utilsData"
        :key="index"
        class="utils-item"
      >
        <button
          v-if="item.type === 'share'"
          class="share-btn"
          open-type="share"
        >
          <image class="icon" :src="item.icon" mode="aspectFit"></image>
          <view class="text">{{ item.text }}</view>
        </button>
        <view v-else class="utils-item-inner" @tap="handleGo(item.type)">
          <image class="icon" :src="item.icon" mode="aspectFit"></image>
          <view class="text">{{ item.text }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.myUtils {
  margin-top: 30rpx;
  padding: 26rpx 30rpx;
  background: #ffffff;
  border-radius: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);

  .utils {
    margin-top: 30rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;

    .utils-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10rpx;

      .utils-item-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10rpx;
      }

      .share-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10rpx;
        padding: 0;
        margin: 0;
        background: none;
        border: none;
        line-height: 1;

        &::after {
          border: none;
        }
      }

      .icon {
        width: 52rpx;
        height: 52rpx;
        overflow: hidden;
      }

      .text {
        font-size: 24rpx;
        color: $qs-font-title;
        text-align: center;
      }
    }
  }
}
</style>
