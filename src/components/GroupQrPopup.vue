<script setup lang="ts">
import { groupCodeFindApi } from '@/api/group'
import { ref, watch } from 'vue'

const modelValue = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '同城社群',
  },
)

/** 无图占位（与 MyUtile 一致） */
const PLACEHOLDER_SVG =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCBmaWxsPSIjZmZkMDE4IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNCI+54mI55qE57O757uf5LqM5qC3PC90ZXh0Pjwvc3ZnPg=='

const groupQrUrl = ref('')
const groupQrLoading = ref(false)

const loadGroupQr = async () => {
  if (groupQrLoading.value) return
  groupQrLoading.value = true
  try {
    const res = await groupCodeFindApi()
    const list = res.data
    const first = Array.isArray(list) ? list[0] : list
    const url = first?.qrImage?.trim() || ''
    groupQrUrl.value = url
    if (!url) {
      uni.showToast({ icon: 'none', title: '暂无群二维码' })
    }
  } catch (e) {
    console.error('groupCodeFindApi', e)
    uni.showToast({ icon: 'none', title: '获取失败，请稍后重试' })
  } finally {
    groupQrLoading.value = false
  }
}

watch(modelValue, (open) => {
  if (open) void loadGroupQr()
})

const close = () => {
  modelValue.value = false
}
</script>

<template>
  <view v-if="modelValue" class="qr-popup-mask" @tap="close">
    <view class="qr-popup" @tap.stop>
      <view class="qr-popup-title">{{ title }}</view>
      <view class="qr-placeholder">
        <view v-if="groupQrLoading" class="qr-loading">加载中…</view>
        <image
          v-else
          class="qr-img"
          :src="groupQrUrl || PLACEHOLDER_SVG"
          mode="aspectFit"
          show-menu-by-longpress
        />
      </view>
      <view class="qr-popup-tip">长按图片可保存</view>
      <view class="qr-popup-close" @tap="close">关闭</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.qr-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
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
  background: #fef8e5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-loading {
  font-size: 28rpx;
  color: $qs-font-dec;
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
