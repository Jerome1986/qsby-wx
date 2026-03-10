<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'

// 模拟报名用户数据
const signupList = ref([
  {
    id: 1,
    name: '何无念',
    gender: 'male',
    phone: '13555555555',
    avatar: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png',
  },
  {
    id: 2,
    name: '何无念',
    gender: 'female',
    phone: '13555555555',
    avatar: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png',
  },
  {
    id: 3,
    name: '何无念',
    gender: 'male',
    phone: '13555555555',
    avatar: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png',
  },
  {
    id: 4,
    name: '何无念',
    gender: 'male',
    phone: '13555555555',
    avatar: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png',
  },
])

// 拨打电话
const handleCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone,
  })
}
</script>

<template>
  <view class="signupList">
    <NavHead title="查看报名人员" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="list-card">
        <view class="list-item" v-for="(item, index) in signupList" :key="item.id">
          <!-- 序号 -->
          <view class="index">{{ index + 1 }}</view>
          <!-- 头像 -->
          <image class="avatar" :src="item.avatar ||
            'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png'
            " mode="aspectFill"></image>
          <!-- 用户信息 -->
          <view class="user-info">
            <view class="name-row">
              <text class="name">{{ item.name }}</text>
              <image class="gender-icon" :src="item.gender === 'male' ? 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/male.png' : 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/female.png'
                " mode="aspectFit"></image>
            </view>
            <text class="phone">{{ item.phone }}</text>
          </view>
          <!-- 拨号按钮 -->
          <view class="call-btn" @tap="handleCall(item.phone)">拨号</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.signupList {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  height: 100%;
  @include page-background();
}

.content {
  margin-top: 24rpx;
  flex: 1;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  @include customShadow();
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.index {
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  border-radius: 50%;
  background-color: $qs-brandColor;
  font-size: 24rpx;
  color: $qs-font-title;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;

  .name-row {
    display: flex;
    align-items: center;
    gap: 8rpx;

    .gender-icon {
      width: 28rpx;
      height: 28rpx;
    }
  }

  .name {
    font-size: 28rpx;
    color: $qs-font-title;
    font-weight: 500;
  }

  .phone {
    font-size: 24rpx;
    color: $qs-font-dec;
  }
}

.call-btn {
  padding: 12rpx 32rpx;
  background-color: $qs-brandColor;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: $qs-font-title;
  flex-shrink: 0;
}
</style>
