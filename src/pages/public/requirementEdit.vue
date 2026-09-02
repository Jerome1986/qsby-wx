<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import NavHead from '@/components/NavHead.vue'

const requirement = ref('')

const getEventChannel = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as unknown as {
    getOpenerEventChannel?: () => UniApp.EventChannel
  }

  return currentPage.getOpenerEventChannel?.()
}

onLoad(() => {
  const eventChannel = getEventChannel()
  eventChannel?.on('initRequirement', (data: { requirement?: string }) => {
    requirement.value = data.requirement ?? ''
  })
})

const handleSave = () => {
  const eventChannel = getEventChannel()
  eventChannel?.emit('saveRequirement', {
    requirement: requirement.value,
  })
  uni.navigateBack()
}
</script>

<template>
  <view class="requirementEdit">
    <NavHead title="填写活动需求" :show-back="true"></NavHead>

    <view class="content">
      <view class="editor-card">
        <textarea v-model="requirement" class="textarea" placeholder="请输入活动需求" placeholder-class="textarea-placeholder"
          :maxlength="500" auto-height />
        <view class="counter">{{ requirement.length }}/500</view>
      </view>

      <view class="submit-btn" @tap="handleSave">保存</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.requirementEdit {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  padding: 24rpx;
}

.editor-card {
  padding: 24rpx;
  background: $qs-card-bg;
  border-radius: 20rpx;
  @include customShadow();
}

.textarea {
  width: 100%;
  min-height: 360rpx;
  font-size: 28rpx;
  color: $qs-font-title;
  line-height: 1.7;
}

.textarea-placeholder {
  color: $qs-font-dec2;
}

.counter {
  margin-top: 16rpx;
  text-align: right;
  font-size: 24rpx;
  color: $qs-font-dec2;
}

.submit-btn {
  width: 309rpx;
  height: 87rpx;
  line-height: 87rpx;
  margin: 48rpx auto 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: $qs-font-title;
  background: $qs-brandColor;
  border-radius: 44rpx;
}
</style>
