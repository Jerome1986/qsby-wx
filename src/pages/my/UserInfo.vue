<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const avatarDisplayUrl = computed(() => {
  return userStore.profile?.avatarReviewStatus === 'pending'
    ? userStore.profile?.avatarReviewUrl || userStore.profile?.avatarUrl
    : userStore.profile?.avatarUrl
})
const managerEndTimeText = computed(() => {
  if (!userStore.isManager) return '普通用户'
  if (userStore.managerExpired) return '主理人已过期'

  const endTime = userStore.profile?.managerEndTime
  if (endTime == null) return '主理人已过期'
  const date = new Date(endTime)
  if (Number.isNaN(date.getTime())) return '主理人已过期'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}到期`
})

console.log('UserInfo组件加载，用户状态:', userStore.profile)

// 跳转登录
const handleLogin = () => {
  console.log('登录')
  uni.navigateTo({
    url: '/pages/login/login',
  })
}

// 跳转设置
const handleEditInfo = () => {
  if (userStore.profile?._id) {
    uni.navigateTo({
      url: `/pagesMember/setting/setting?userId=${userStore.profile?._id}`,
    })
  } else {
    uni.navigateTo({ url: '/pages/login/login' })
  }
}
</script>

<template>
  <!-- 未登录 -->
  <view class="userInfo" v-if="!userStore.profile?._id">
    <!-- 头像 -->
    <view class="avatarInfo">
      <view class="avatarUrl">
        <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png" mode="aspectFit" />
      </view>
      <view class="editInfo">编辑资料</view>
    </view>
    <!-- 昵称/身份 -->
    <view class="info">
      <view class="info-1" @tap="handleLogin">
        <view class="nickname">登录账号</view>
        <view class="timeOut">体验完整服务</view>
      </view>
    </view>
  </view>
  <!-- 登录 -->
  <view class="userInfo" v-else>
    <!-- 头像 -->
    <view class="avatarInfo" @tap="handleEditInfo">
      <view class="avatarUrl">
        <image :src="avatarDisplayUrl ?? 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png'"
          mode="aspectFill" />
        <view class="avatar-review-mask" v-if="userStore.profile?.avatarReviewStatus === 'pending'">
          <text>审核中</text>
        </view>
      </view>
      <view class="editInfo">编辑资料</view>
    </view>
    <!-- 昵称/身份 -->
    <view class="info">
      <view class="info-1">
        <view class="nickname">{{ userStore.profile?.nickname }}</view>
        <view class="timeOut">{{ managerEndTimeText }}</view>
      </view>
      <!-- 主理人标识 -->
      <view class="role" v-if="userStore.isValidManager">
        <image class="role-bg" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/roleBg.png"
          mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/*用户信息*/
.userInfo {
  display: flex;
  align-items: start;
  margin-right: 29rpx;
  z-index: 2;

  /*头像*/
  .avatarInfo {
    .avatarUrl {
      width: 106rpx;
      height: 106rpx;
      border-radius: 50%;
      overflow: hidden;
      position: relative;

      image {
        width: 100%;
        height: 100%;
      }

      .avatar-review-mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.46);
        color: #ffffff;
        font-size: 20rpx;
        font-weight: 500;
      }
    }

    /*编辑资料*/
    .editInfo {
      margin-top: 20rpx;
      text-align: center;
      width: 106rpx;
      height: 30rpx;
      line-height: 30rpx;
      font-size: 18rpx;
      background-color: #f9f5eb;
      border-radius: 15rpx;
      color: #6a6451;
    }
  }

  .info {
    display: flex;
    margin-left: 20rpx;

    .info-1 {
      margin-right: 12rpx;

      .nickname {
        font-size: 36rpx;
        color: #0b0a0a;
        @include ellipsis(1);
      }

      .timeOut {
        font-size: 22rpx;
        color: #6a6451;
      }
    }

    .role {
      width: 110rpx;
      height: 39rpx;

      .role-bg {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
