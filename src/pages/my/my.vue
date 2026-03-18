<script setup lang="ts">
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { navBarHeight, getNavBarHeight } from '@/utils/system-info.ts'
import UserInfo from './UserInfo.vue'
import Order from '@/pages/my/Order.vue'
import Function from '@/pages/my/Function.vue'
import { useUserStore } from '@/stores'
import { userInfoGet } from '@/composables/userInfo.ts'
import { watch } from 'vue'
import SendList from '@/pages/my/SendList.vue'
import MyUtile from '@/pages/my/MyUtile.vue'
import { writeOrder } from '@/api/order'

// store
const userStore = useUserStore()

onLoad(() => {
  // 获取导航栏高度
  getNavBarHeight()
})

onShow(() => {
  if (userStore.profile?._id) {
    // 获取用户信息
    userInfoGet(userStore.profile._id)
  }
})

onShareAppMessage((res) => {
  if (res.from === 'button' && userStore.profile) {
    console.log('按钮分享', userStore.profile.referralCode)
    const inviterCode = userStore.profile.referralCode

    // 来自页面内按钮
    return {
      title: '千宿百院',
      path: `/pages/login/login?inviterCode=${inviterCode}`,
      imageUrl: userStore.profile.avatarUrl
    }
  }
  console.log('默认', userStore.profile?.referralCode)

  // 默认分享
  return {
    title: '千宿百院',
    path: `/pages/login/login`,
    imageUrl: userStore.profile?.avatarUrl
  }
})


// 扫码核销
const openCode = () => {
  if (userStore.profile?.role === 'user' || !userStore.profile) {
    uni.showToast({ icon: 'error', title: '没有权限' })
    return
  }

  uni.scanCode({
    success: async (success) => {
      const profile = userStore.profile
      if (!profile?._id || !profile.role) return
      console.log('核销了', success.result, profile._id, profile.role)

      const { code } = await writeOrder(success.result, profile._id, profile.role)

      uni.showToast({
        icon: code === 200 ? 'success' : 'none',
        title: code === 200 ? '核销成功' : '核销失败'
      })
    },
    fail: (fail) => {
      console.error(fail)
    },
  })
}
</script>

<template>
  <scroll-view class="myPage" :scroll-y="true">
    <view class="head" :style="{ height: navBarHeight + 'px' }"></view>
    <!-- 头部内容 -->
    <view class="user-head">
      <!-- 用户信息 -->
      <UserInfo></UserInfo>
      <!-- 扫码核销 -->
      <view class="code" @tap="openCode"
        v-if="userStore.profile?.role === 'admin' || userStore.profile?.role === 'manager'">
        <image class="icon" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/code.png"
          mode="aspectFit" />
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
    margin-top: 40rpx;
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
  margin-top: 40rpx;
  padding: 24rpx;
}
</style>
