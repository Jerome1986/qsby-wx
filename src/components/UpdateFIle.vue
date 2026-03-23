<script setup lang="ts">
import icCardFontPlaceholder from '@/static/icCardFont.png'
import icCardBackPlaceholder from '@/static/icCardBack.png'
import { UPLOAD_ACTION } from '@/pages/public/constants'

// ts接收参数并设置默认值 -- withDefaults
withDefaults(
  defineProps<{
    icCardFont: string
    icCardBack: string
  }>(),
  {
    icCardFont: '',
    icCardBack: '',
  },
)

const emits = defineEmits<{ (e: 'update', type: string, url: string): void }>()

const handleUpdate = (type: string) => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (e) => {
      uni.uploadFile({
        url: UPLOAD_ACTION,
        filePath: e.tempFilePaths[0],
        name: `id_${type}_${Date.now()}`,
        success: (res) => {
          const url = res.data as string
          if (url) emits('update', type, url)
          else uni.showToast({ icon: 'none', title: '上传失败' })
        },
        fail: () => uni.showToast({ icon: 'none', title: '上传失败' }),
      })
    },
    fail: () => uni.showToast({ icon: 'none', title: '选择图片失败' }),
  })
}
</script>

<template>
  <view class="update">
    <!--  身份证  -->
    <view class="item">
      <!-- title -->
      <view class="title">
        <text class="required">*</text>
        上传身份证
      </view>
      <!-- 证件正面 -->
      <view class="updateItem" @click="handleUpdate('font')">
        <view class="left">
          <text class="iconfont icon-tupian add-icon"></text>
          <text class="hint">上传身份证正面</text>
        </view>
        <view class="right">
          <image :src="icCardFont ? icCardFont : icCardBackPlaceholder" mode="aspectFill" />
        </view>
      </view>
      <!-- 证件反面 -->
      <view class="updateItem" @click="handleUpdate('back')">
        <view class="left">
          <text class="iconfont icon-tupian add-icon"></text>
          <text class="hint">上传身份证反面</text>
        </view>
        <view class="right">
          <image :src="icCardBack ? icCardBack : icCardFontPlaceholder" mode="aspectFill" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.update {
  margin-top: 24rpx;

  .item {
    padding: 24rpx;
    margin-bottom: 24rpx;
    background-color: #ffffff;
    border-radius: 16rpx;

    /*标题*/
    .title {
      margin-bottom: 24rpx;
      font-size: 28rpx;
      color: $qs-font-title;

      .required {
        color: $qs-brandColor;
        font-weight: bold;
      }
    }

    .add-icon {
      color: $qs-brandColor;
      font-size: 40rpx;
      margin-bottom: 12rpx;
    }

    .hint {
      font-size: 24rpx;
      color: $qs-font-title;
    }

    .updateItem {
      margin-bottom: 24rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx;
      height: 262rpx;
      border: 2rpx solid $qs-border;
      border-radius: 16rpx;
      background-color: #fafafa;
      border: 1px solid #cfcfcf;

      &:nth-last-child(1) {
        margin-bottom: 0;
      }

      .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 214rpx;
        border-radius: 4rpx;
      }

      .right {
        width: 320rpx;
        height: 214rpx;
        border-radius: 12rpx;
        overflow: hidden;
      }
    }
  }
}
</style>
