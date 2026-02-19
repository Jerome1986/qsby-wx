<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { navBarHeight, getNavBarHeight } from '@/utils/system-info.ts'
import UserInfo from './UserInfo.vue'
import Order from '@/pages/my/Order.vue'
import Function from '@/pages/my/Function.vue'

import { useUserStore } from '@/stores'
import { userInfoGet } from '@/composables/userInfo.ts'
import { watch } from 'vue'
import SendList from '@/pages/my/SendList.vue'
import MyUtile from '@/pages/my/MyUtile.vue'

// store
const userStore = useUserStore()

onLoad(() => {
  // 获取导航栏高度
  getNavBarHeight()
  if (userStore.profile?._id) {
    // 获取用户信息
    userInfoGet(userStore.profile._id)
  }
})

// 监听用户信息变化，自动刷新界面显示
watch(
  () => userStore.profile,
  (newProfile) => {
    if (newProfile) {
      console.log('用户信息已更新，界面会自动反映最新数据')
      // 由于使用了响应式数据，界面会自动更新，无需额外操作
    }
  },
  { deep: true },
)
</script>

<template>
  <scroll-view class="myPage" :scroll-y="true">
    <view class="head" :style="{ height: navBarHeight + 'px' }"></view>
    <!-- 头部内容 -->
    <view class="user-head">
      <!-- 用户信息 -->
      <UserInfo></UserInfo>
      <!-- 扫码核销 -->
      <view class="code">
        <image class="icon" src="../../static/my/code.png" mode="aspectFit" />
        <view class="text">扫码核销</view>
      </view>
    </view>
    <view class="content">
      <!-- 功能区 -->
      <Function></Function>
      <!--   订单管理   -->
      <Order></Order>
      <!--  管理发布  -->
      <SendList v-if="userStore.profile?.role === 'manager'"></SendList>
      <!-- 我的工具  -->
      <MyUtile></MyUtile>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.myPage {
  @include page-background();
}

/*内容头部*/
.user-head {
  display: flex;
  justify-content: space-between;
  padding-left: 24rpx;
  position: relative;
  z-index: 1;

  /*核销扫码*/
  .code {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 236rpx;
    height: 71rpx;
    border-radius: 35.5rpx 0 0 35.5rpx;
    background-color: #1a1a1a;

    .icon {
      margin-right: 14rpx;
      width: 40rpx;
      height: 39rpx;
    }

    .text {
      font-size: 29rpx;
      color: #f1efc5;
    }
  }
}

.content {
  margin-top: 48rpx;
  padding: 24rpx;
}
</style>
