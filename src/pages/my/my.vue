<script setup lang="ts">
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { navBarHeight, getNavBarHeight } from '@/utils/system-info.ts'
import UserInfo from './UserInfo.vue'
import Order from '@/pages/my/Order.vue'
import Function from '@/pages/my/Function.vue'
import { useUserStore } from '@/stores'
import { userInfoGet } from '@/composables/userInfo.ts'
import SendList from '@/pages/my/SendList.vue'
import StoreManageList from '@/pages/my/StoreManageList.vue'
import MyUtile from '@/pages/my/MyUtile.vue'
import { writeOrder } from '@/api/order'

// store
const userStore = useUserStore()

const getInviteLoginPath = () => {
  const inviterCode = userStore.profile?.referralCode
  return inviterCode
    ? `/pages/login/login?inviterCode=${encodeURIComponent(inviterCode)}`
    : '/pages/login/login'
}

onLoad(() => {
  // 获取导航栏高度
  getNavBarHeight()
})

onShow(async () => {
  if (userStore.profile?._id) {
    try {
      await userInfoGet(userStore.profile._id)
    } catch (err) {
      console.error('个人中心刷新用户信息失败', err)
    }
  }
})

onShareAppMessage((res) => {
  if (res.from === 'button' && userStore.profile) {
    console.log('按钮分享', userStore.profile.referralCode)

    // 来自页面内按钮
    return {
      title: '千宿百院',
      path: getInviteLoginPath(),
      imageUrl: userStore.profile.avatarUrl,
    }
  }
  console.log('默认', userStore.profile?.referralCode)

  // 默认分享
  return {
    title: '千宿百院',
    path: getInviteLoginPath(),
    imageUrl: userStore.profile?.avatarUrl,
  }
})

const navigateStoreOrderDetail = (orderId: string) => {
  setTimeout(() => {
    uni.navigateTo({
      url: `/pagesMember/storeManage/storeOrderDetail?orderId=${orderId}`,
    })
  }, 800)
}

// 扫码核销
const openCode = () => {
  const isAdmin = userStore.profile?.role === 'admin'
  if (!isAdmin && !userStore.isValidManager) {
    uni.showToast({ icon: 'error', title: '没有权限' })
    return
  }

  uni.scanCode({
    success: (success) => {
      uni.showModal({
        title: '提示',
        content: '确定核销吗',
        confirmColor: '#eed261',
        success: async (res) => {
          if (!res.confirm) return

          const profile = userStore.profile
          if (!profile?._id || !profile.role) return
          console.log('核销了', success.result, profile._id, profile.role)

          try {
            const result = await writeOrder(success.result, profile._id)
            console.log('核销结果', result)

            uni.showToast({
              icon: result.code === 200 ? 'success' : 'none',
              title: result.code === 200 ? '核销成功' : '核销失败',
            })

            if (result.code !== 200 || !result.data.out_trade_no.startsWith('shop')) return
            console.log('核销结果', result.data)
            navigateStoreOrderDetail(result.data.orderId)
          } catch (err) {
            console.error('核销失败', err)
            uni.showToast({ icon: 'none', title: '核销失败' })
          }
        },
        fail: (fail) => {
          console.error(fail)
        },
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
      <view class="code" @tap="openCode" v-if="userStore.profile?.role === 'admin' || userStore.isValidManager">
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
      <SendList v-if="userStore.isValidManager"></SendList>
      <!--  门店管理  -->
      <StoreManageList
        v-if="userStore.profile?.shopId && (userStore.isValidManager || userStore.profile?.role === 'admin')">
      </StoreManageList>
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
