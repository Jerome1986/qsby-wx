<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'

// 意见内容
const suggestionText = ref('')

// 提交意见
const handleSubmit = () => {
  if (!suggestionText.value.trim()) {
    return uni.showToast({ icon: 'none', title: '请输入您的意见或建议' })
  }
  console.log('提交意见:', suggestionText.value)
  // TODO: 调用提交接口
  uni.showToast({ icon: 'success', title: '提交成功' })
}
</script>
<template>
  <view class="suggestion">
    <NavHead title="意见反馈" :show-back="true"></NavHead>
    <!--  意见反馈  -->
    <view class="content">
      <view class="title">您对"千宿百院"小程序有任何建议或意见吗？</view>
      <!--   意见输入区域   -->
      <view class="input-area">
        <textarea
          class="textarea"
          v-model="suggestionText"
          placeholder="欢迎突出任何帮助我们改进的建议（如功能、内容、设计、体验等）"
          placeholder-class="placeholder"
          :maxlength="500"
        />
        <view class="word-count">{{ suggestionText.length }}/500</view>
      </view>
    </view>
    <!-- 提交按钮 -->
    <view class="submit">
      <view class="btn" @tap="handleSubmit">提交反馈</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.suggestion {
  padding: 24rpx;
  @include page-background();
}

.content {
  .title {
    text-align: center;
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 24rpx;
  }

  .input-area {
    position: relative;
    padding: 24rpx;
    background: #ffffff;
    border-radius: 30rpx;
    @include customShadow();

    .textarea {
      width: 100%;
      height: 300rpx;
      font-size: 28rpx;
      color: $qs-font-title;
      line-height: 1.6;
    }

    .word-count {
      text-align: right;
      font-size: 24rpx;
      color: $qs-font-dec2;
      margin-top: 16rpx;
    }
  }
}

.placeholder {
  color: #b5b5b5;
}

/* 提交按钮 */
.submit {
  display: flex;
  justify-content: center;
  margin-top: 60rpx;
  .btn {
    text-align: center;
    width: 100%;
    height: 108rpx;
    line-height: 108rpx;
    background: $qs-brandColor;
    border-radius: 30rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
