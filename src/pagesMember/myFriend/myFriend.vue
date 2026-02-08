<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import NoData from '@/components/NoData.vue'

const handleScroll = () => {
  console.log('触底')
}

// 跳转好友详情
const handleDetail = (index: number) => {
  uni.navigateTo({
    url: `/pagesMember/myFriend/friendDetail?userId=${index}`,
  })
}
</script>
<template>
  <view class="myFriend">
    <view class="head">
      <!-- 邀请人数  -->
      <view class="item">
        <image class="img" src="/static/my/friend/person.png" mode="aspectFit"></image>
        <view class="text">
          <view class="label">邀请人数</view>
          <view class="value">2</view>
        </view>
      </view>
      <!-- 团队消费  -->
      <view class="item">
        <image
          class="img"
          style="width: 93rpx; height: 99rpx"
          src="/static/my/friend/box.png"
          mode="aspectFit"
        ></image>
        <view class="text">
          <view class="label">团队消费金额</view>
          <view class="value">0</view>
        </view>
      </view>
    </view>
    <!--  好友列表  -->
    <scroll-view
      class="content"
      :scroll-y="true"
      @scrolltolower="handleScroll"
      :enhanced="true"
      :show-scrollbar="false"
    >
      <NavTitle title="我的朋友"></NavTitle>
      <!--  无数据组件  -->
      <NoData
        image-url="/static/my/friend/nofriend.png"
        tips="你还没有邀请好友哟~"
        v-if="false"
      ></NoData>
      <!--  列表项  -->
      <view class="list" v-else>
        <view class="item" v-for="index in 10" :key="index" @tap="handleDetail(index)">
          <view class="left">
            <image
              class="avatar"
              mode="aspectFit"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testAvatar/jerome.jpg"
            ></image>
            <view class="info">
              <view class="nickname">
                <text>何无念</text>
                <image class="genderIcon" src="/static/my/friend/men.png"></image>
              </view>
              <view class="registerTime">注册时间：2025-12-09</view>
              <view class="consumption">个人消费 0</view>
            </view>
          </view>
          <view class="right">
            <image class="roleIcon" src="/static/my/friend/role1.png" mode="aspectFit"></image>
            <view class="payTimes">消费次数 0</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.myFriend {
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
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;
        padding: 30rpx 20rpx;
        height: 195rpx;
        background: #f6f6f6;
        border-radius: 30rpx;
        &:last-of-type {
          margin-bottom: 0;
        }
        .left {
          display: flex;
          /*头像*/
          .avatar {
            width: 133rpx;
            height: 133rpx;
            border-radius: 50%;
          }
          /*信息*/
          .info {
            margin-left: 20rpx;
            .nickname {
              display: flex;
              align-items: center;
              font-weight: bold;
              font-size: 36rpx;
              color: $qs-font-title;
              .genderIcon {
                margin-left: 10rpx;
                width: 30rpx;
                height: 30rpx;
              }
            }
            .registerTime {
              font-size: 28rpx;
              color: #919191;
            }
            .consumption {
              margin-top: 10rpx;
              font-size: 24rpx;
              color: #919191;
            }
          }
        }
        /*最右侧图标和消费次数*/
        .right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
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
