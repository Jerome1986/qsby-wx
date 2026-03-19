<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { signUpFindAllApi } from '@/api/send'
import type { SendType } from '@/types/Send'
import type { UserItem } from '@/types/UserItem'

const itemId = ref('')
const publicType = ref<SendType>('trip')
const signupList = ref<UserItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finish = ref(false)
const hasFetched = ref(false)

const fetchList = async () => {
  if (!itemId.value || finish.value || loading.value) return
  loading.value = true
  try {
    const res = await signUpFindAllApi(itemId.value, publicType.value, pageNum.value, pageSize.value)
    const list = res.data?.list ?? []
    signupList.value.push(...list)
    if (pageNum.value < (res.data?.totalPage ?? 0)) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } catch {
    //
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

const handleMore = () => {
  if (!finish.value) fetchList()
}

onLoad((options) => {
  itemId.value = options?.itemId ?? ''
  publicType.value = (options?.type as SendType) ?? 'trip'
  fetchList()
})

// 拨打电话
const handleCall = (phone: string) => {
  if (!phone) return
  uni.makePhoneCall({ phoneNumber: phone })
}

// 显示名称：nickname 或 username
const getDisplayName = (item: UserItem) => item.nickname || item.username || '未知'

// 性别：1-男 2-女 0-未知
const isMale = (item: UserItem) => item.gender === 1
</script>

<template>
  <view class="signupList">
    <NavHead title="查看报名人员" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <view style="padding: 24rpx;">
        <view class="list-card">
          <view class="list-item" v-for="(item, index) in signupList" :key="item._id">
            <view class="index">{{ index + 1 }}</view>
            <image class="avatar"
              :src="item.avatarUrl || 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png'"
              mode="aspectFill"></image>
            <view class="user-info">
              <view class="name-row">
                <text class="name">{{ getDisplayName(item) }}</text>
                <image class="gender-icon" :src="isMale(item)
                  ? 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/male.png'
                  : 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/female.png'" mode="aspectFit">
                </image>
              </view>
              <text class="phone">{{ item.mobile || '-' }}</text>
            </view>
            <view class="call-btn" @tap="handleCall(item.mobile)">拨号</view>
          </view>
        </view>
        <view class="load-more-tip" v-if="signupList.length && (loading || !finish)">
          <text v-if="loading">加载中...</text>
          <text v-else>上拉加载更多</text>
        </view>
        <view class="empty" v-if="hasFetched && !loading && !signupList.length">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="widthFix"></image>
          <text class="empty-text">暂无报名人员</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.signupList {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  margin-top: 24rpx;
  flex: 1;
}

.load-more-tip {
  padding: 24rpx 0;
  text-align: center;
  font-size: 24rpx;
  color: $qs-font-dec;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;

  .empty-img {
    width: 320rpx;
  }

  .empty-text {
    margin-top: 24rpx;
    font-size: 28rpx;
    color: $qs-font-dec;
  }
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
      width: 20rpx;
      height: 20rpx;
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
