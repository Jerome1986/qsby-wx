<script setup lang="ts"></script>

<template>
  <view class="organizer">
    <view class="title">组织方</view>
    <view class="content">
      <view class="left">
        <view class="avatar">
          <image
            mode="aspectFill"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testAvatar/jerome.jpg"
          ></image>
        </view>
        <view class="nickname">何无念</view>
      </view>
      <view class="right">
        <view class="wx">
          <image
            mode="aspectFill"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/xc/wx.png"
          ></image>
        </view>
        <view class="phone">
          <image
            mode="aspectFill"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/xc/phone.png"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 组织方卡片 */
.organizer {
  margin-top: 24rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  .title {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 20rpx;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;

      .avatar {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        overflow: hidden;
      }

      .nickname {
        margin-left: 16rpx;
        font-size: 28rpx;
        color: $qs-font-title;
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .wx,
      .phone {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64rpx;
        height: 64rpx;
      }
    }
  }
}
</style>
