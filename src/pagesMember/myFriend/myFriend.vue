<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import NoData from '@/components/NoData.vue'
import NavHead from '@/components/NavHead.vue'
import { useUserStore } from '@/stores'
import { computed, ref } from 'vue'
import type { FriendData } from '@/types/Friend'
import { friendListApi } from '@/api/friend'
import { onLoad } from '@dcloudio/uni-app'
import { formatTimestamp } from '@/utils/generateMonth'
import type { UserItem } from '@/types/UserItem'

const userStore = useUserStore()

const pageNum = ref(1)
const pageSize = ref(10)
const friendData = ref<FriendData[]>([])
const totalFriend = ref(0)
const finish = ref(false)
const friendDataGet = async (userId: string) => {
  if (finish.value) return
  const res = await friendListApi(userId, pageNum.value, pageSize.value)
  console.log('好友列表', res)

  friendData.value.push(...res.data.list)
  totalFriend.value = res.data.totalFriend
  if (pageNum.value < res.data.totalPage) {
    pageNum.value++
  } else {
    finish.value = true
  }
}

// 团队消费金额
const teamTotal = computed(() => {
  return friendData.value.reduce((sum, item) => sum + item.totalConsumption, 0)
})

const handleScroll = () => {
  console.log('触底')
  if (finish.value) return
  friendDataGet(userStore.profile?._id as string)
}

// 跳转好友详情
const handleDetail = (item: FriendData) => {
  uni.navigateTo({
    url: `/pagesMember/myFriend/friendDetail?userId=${item._id}&totalConsumption=${item.totalConsumption}`,
  })
}

onLoad(() => friendDataGet(userStore.profile?._id as string))
</script>
<template>
  <view class="myFriend">
    <NavHead title="我的好友" :show-back="true"></NavHead>
    <view class="head">
      <!-- 邀请人数  -->
      <view class="item">
        <image class="img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/friend/person.png"
          mode="aspectFit"></image>
        <view class="text">
          <view class="label">邀请人数</view>
          <view class="value">{{ totalFriend }}</view>
        </view>
      </view>
      <!-- 团队消费  -->
      <view class="item">
        <image class="img" style="width: 93rpx; height: 99rpx"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/friend/box.png" mode="aspectFit"></image>
        <view class="text">
          <view class="label">团队消费金额</view>
          <view class="value">{{ teamTotal }}</view>
        </view>
      </view>
    </view>
    <!--  好友列表  -->
    <scroll-view class="content" :scroll-y="true" @scrolltolower="handleScroll" :enhanced="true"
      :show-scrollbar="false">
      <NavTitle title="我的朋友"></NavTitle>
      <!--  无数据组件  -->
      <NoData image-url="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/friend/nofriend.png"
        tips="你还没有邀请好友哟~" v-if="!friendData.length"></NoData>
      <!--  列表项  -->
      <view class="list" v-else>
        <view class="item" v-for="(item) in friendData" :key="item._id" @tap="handleDetail(item)">
          <image class="avatar" mode="aspectFit" :src="item.avatarUrl"></image>
          <view class="info">
            <view class="nickname">
              <text>{{ item.nickname }}</text>
              <image v-if="item.gender === 1" class="genderIcon"
                src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/friend/men.png"></image>
              <image v-else class="genderIcon"
                src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/friend/women.png"></image>
            </view>
            <view class="registerTime">注册时间：{{ formatTimestamp(item.registerTime) }}</view>
            <view class="consumption">个人消费 {{ item.totalConsumption ?? 0 }}</view>
          </view>
          <view class="right">
            <image v-if="item.role === 'user'" class="roleIcon"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/friend/role1.png" mode="aspectFit">
            </image>
            <image v-if="item.role === 'manager'" class="roleIcon"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/friend/role2.png" mode="aspectFit">
            </image>
            <view class="payTimes">消费次数 {{ item.totalCount ?? 0 }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.myFriend {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();

  .head {
    display: flex;
    gap: 24rpx;
    height: 188rpx;

    .item {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 33rpx;
      height: 100%;
      background: #fffae6;
      border-radius: 30rpx;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      .img {
        width: 81rpx;
        height: 101rpx;
        overflow: hidden;
      }

      .text {
        flex: 1;
        text-align: end;
        font-weight: bold;

        .label {
          font-size: 28rpx;
          color: $qs-font-title;
          @include ellipsis(1);
        }

        .value {
          margin-top: 20rpx;
          font-size: 40rpx;
        }
      }
    }
  }

  .content {
    flex: 1;
    padding: 28rpx;
    margin-top: 20rpx;
    width: 100%;
    height: calc(100% - 188rpx);
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 30rpx;

    /*好友列表*/
    .list {
      margin-top: 40rpx;

      .item {
        padding: 0 24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        height: 195rpx;
        background: #f6f6f6;
        border-radius: 30rpx;

        &:last-of-type {
          margin-bottom: 0;
        }

        /*头像*/
        .avatar {
          width: 133rpx;
          height: 133rpx;
          border-radius: 50%;
        }

        /*信息*/
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 133rpx;
          margin-left: 20rpx;

          .nickname {
            font-size: 28rpx;
            color: $qs-font-title;

            .genderIcon {
              margin-left: 10rpx;
              width: 20rpx;
              height: 20rpx;
            }
          }

          .registerTime {
            font-size: 24rpx;
            color: #919191;
          }

          .consumption {
            margin-top: 10rpx;
            font-size: 24rpx;
            color: #919191;
          }
        }

        /*最右侧图标和消费次数*/
        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          height: 133rpx;

          .roleIcon {
            width: 100rpx;
            height: 40rpx;
          }

          .payTimes {
            text-align: center;
            width: 140rpx;
            height: 36rpx;
            line-height: 36rpx;
            border-radius: 17rpx;
            border: 1px solid #919191;
            font-size: 24rpx;
            color: #919191;
          }
        }
      }
    }
  }
}
</style>
