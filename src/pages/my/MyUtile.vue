<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { utilsData, utilsJumpMap } from '@/pages/my/myConfig.ts'
import type { myUtilsType } from '@/types/My'
import { ref } from 'vue'

const showGroupQr = ref(false)

const handleGo = (val: myUtilsType) => {
  if (val === 'group') {
    showGroupQr.value = true
    return
  }
  if (val !== 'share') {
    utilsJumpMap[val]()
  }
}

const closeGroupQr = () => {
  showGroupQr.value = false
}

// 群二维码图片地址，暂无则用空字符串（显示背景色占位）
const groupQrUrl = ref('')
</script>

<template>
  <view class="myUtils">
    <NavTitle title="我的工具"></NavTitle>
    <!-- 同城社群二维码弹框 -->
    <view v-if="showGroupQr" class="qr-popup-mask" @tap="closeGroupQr">
      <view class="qr-popup" @tap.stop>
        <view class="qr-popup-title">同城社群</view>
        <view class="qr-placeholder">
          <image class="qr-img"
            :src="groupQrUrl || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCBmaWxsPSIjZmZkMDE4IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCI+54mI55qE57O757uf5LqM5qC3PC90ZXh0Pjwvc3ZnPg=='"
            mode="aspectFit" show-menu-by-longpress />
        </view>
        <view class="qr-popup-tip">长按图片可保存</view>
        <view class="qr-popup-close" @tap="closeGroupQr">关闭</view>
      </view>
    </view>
    <view class="utils">
      <view v-for="(item, index) in utilsData" :key="index" class="utils-item">
        <button v-if="item.type === 'share'" class="share-btn" open-type="share">
          <image class="icon" :src="item.icon" mode="aspectFit"></image>
          <view class="text">{{ item.text }}</view>
        </button>
        <button v-else-if="item.type === 'cooperate'" class="share-btn" open-type="contact">
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
  background: #fef8e5;
  border-radius: 30rpx;
  @include customShadow();

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

/* 群二维码弹框 */
.qr-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.qr-popup {
  width: 560rpx;
  padding: 40rpx;
  background: #fff;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $qs-font-title;
  margin-bottom: 24rpx;
}

.qr-placeholder {
  width: 400rpx;
  height: 400rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.qr-img {
  width: 100%;
  height: 100%;
}

.qr-popup-tip {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: $qs-font-dec;
}

.qr-popup-close {
  margin-top: 32rpx;
  padding: 16rpx 60rpx;
  background-color: $qs-brandColor;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: $qs-font-title;
}
</style>
