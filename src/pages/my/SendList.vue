<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 跳转发布管理
const handlePublishManagement = () => {
  if (userStore.profile?.role === 'manager' && userStore.profile._id) {
    uni.navigateTo({
      url: '/pagesMember/publishManagement/publishManagement',
    })
  } else {
    uni.showToast({ icon: 'none', title: '请先登录' })
  }
}
</script>

<template>
  <view class="sendList" @tap="handlePublishManagement">
    <NavTitle title="管理发布"></NavTitle>
    <view class="dec">已经发布的内容丨有趣的项目丨同城活动丨社交旅行</view>
    <view class="bg">
      <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/send.png" mode="aspectFit"></image>
    </view>
  </view>
</template>

<style scoped lang="scss">
.sendList {
  position: relative;
  padding: 36rpx 30rpx;
  margin-top: 30rpx;
  height: 168rpx;
  background: #fef8e5;
  border-radius: 30rpx;
  @include customShadow();

  .dec {
    padding-left: 12rpx;
    margin-top: 24rpx;
    font-size: 22rpx;
    color: #6a6451;
  }

  .bg {
    position: absolute;
    right: 18rpx;
    top: 11rpx;
    width: 124rpx;
    height: 147rpx;
  }
}
</style>
