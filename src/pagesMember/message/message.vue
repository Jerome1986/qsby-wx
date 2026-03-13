<script setup lang="ts">
import { ref } from 'vue'
import NavHead from '@/components/NavHead.vue'
import { formatTimestamp } from '@/utils/generateMonth'

interface MessageItem {
  _id: string
  title: string
  preview: string
  time: string
}

const messageList = ref<MessageItem[]>([
  {
    _id: '1',
    title: '系统消息',
    preview: '暂无系统消息',
    time: new Date().toISOString(),
  },
])

const handleItemTap = (item: MessageItem) => {
  // TODO: 跳转消息详情
  console.log('点击消息', item)
}
</script>

<template>
  <view class="message">
    <NavHead title="消息" :show-back="true"></NavHead>
    <view class="content">
      <view
        v-for="item in messageList"
        :key="item._id"
        class="item"
        @tap="handleItemTap(item)"
      >
        <view class="icon-wrap">
          <image
            class="icon"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/message/notice.png"
            mode="aspectFit"
          />
        </view>
        <view class="info">
          <view class="title">{{ item.title }}</view>
          <view class="preview">{{ item.preview }}</view>
        </view>
        <view class="time">{{ formatTimestamp(item.time, 1) }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.message {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

.content {
  margin-top: 20rpx;
  padding: 0 24rpx;
  background: #ffffff;
  border-radius: 30rpx;
  @include customShadow();

  .item {
    display: flex;
    align-items: center;
    padding: 28rpx 0;
    border-bottom: 2rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }
  }

  .icon-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96rpx;
    height: 96rpx;
    margin-right: 24rpx;
    background: linear-gradient(135deg, #e8f4ff 0%, #d4ebff 100%);
    border-radius: 50%;

    .icon {
      width: 48rpx;
      height: 48rpx;
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 30rpx;
      font-weight: 500;
      color: $qs-font-title;
      margin-bottom: 8rpx;
    }

    .preview {
      font-size: 24rpx;
      color: $qs-font-dec;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .time {
    flex-shrink: 0;
    margin-left: 16rpx;
    font-size: 24rpx;
    color: $qs-font-dec;
  }
}
</style>
