<script setup lang="ts">
import { functionData } from '@/pages/my/myConfig.ts'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 处理路径跳转
const handleNav = (val: string) => {
  // 验证登录
  if (!userStore.profile?._id) {
    uni.showToast({ icon: 'none', title: '请登录后使用', duration: 1000, mask: true })
    return
  }
  // 跳转
  switch (val) {
    case '我的好友':
      console.log('我的好友')
      uni.navigateTo({ url: '/pagesMember/myFriend/myFriend' })
      break
    case '我的钱包':
      console.log('我的钱包')
      uni.navigateTo({ url: '/pagesMember/myWallet/myWallet' })
      break
    case '代金券':
      console.log('代金券')
      uni.navigateTo({ url: '/pagesMember/voucher/voucher' })
      break
    case '我的积分':
      console.log('我的积分')
      break
  }
}
</script>

<template>
  <view class="function">
    <view
      class="function-item"
      v-for="(item, index) in functionData"
      :key="index"
      @tap="handleNav(item.text)"
    >
      <image class="icon" :src="item.icon" mode="aspectFit"></image>
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
  height: 179rpx;
  background: #ffffff;
  border-radius: 30rpx;

  .function-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    .icon {
      margin-bottom: 12rpx;
      width: 106rpx;
      height: 80rpx;
      overflow: hidden;
    }
    .text {
      font-size: 22rpx;
      color: #6a6451;
    }
  }
}
</style>
