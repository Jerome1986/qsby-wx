<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'

// 跳转发布
const handleSend = () => {
  console.log('handleSend')
}

// 跳转项目详情
const handleGoDetail = () => {
  uni.navigateTo({
    url: '/pages/project/projectDetail',
  })
}
</script>
<template>
  <view class="project">
    <NavHead title="有趣的项目" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  发布  -->
      <view class="banner" @tap="handleSend">
        <image
          class="img"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/project.png"
          mode="aspectFill"
        ></image>
      </view>
      <!--   title   -->
      <NavTitle title="发现有趣的项目"></NavTitle>
      <!--  项目列表  -->
      <view class="list">
        <view class="list-item" v-for="index in 10" :key="index" @tap="handleGoDetail">
          <view class="cover">
            <image
              mode="aspectFill"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            ></image>
          </view>
          <view class="info">
            <view class="name">一起开一个游乐园</view>
            <view class="need">
              <view class="left">
                <view class="row-item">
                  <text class="label">所在城市:</text>
                  <text class="value">湖北省武汉市</text>
                </view>
                <view class="row-item">
                  <text class="label">行业类别:</text>
                  <text class="value">餐饮美食</text>
                </view>
                <view class="row-item">
                  <text class="label">合作方式:</text>
                  <text class="value">资源合作</text>
                </view>
                <view class="row-item">
                  <text class="label">合作规模:</text>
                  <text class="value">50W-100W</text>
                </view>
              </view>
              <view class="right">
                <view class="checkLook">了解详情</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.project {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  /* 顶部横幅 */
  .banner {
    margin-bottom: 24rpx;
    width: 100%;
    height: 240rpx;
    overflow: hidden;
    border-radius: 30rpx;
  }
  /* 项目列表 */
  .list {
    margin-top: 24rpx;
    padding-bottom: 60rpx;
    .list-item {
      display: flex;
      gap: 20rpx;
      padding: 24rpx;
      margin-bottom: 24rpx;
      background-color: #ffffff;
      border-radius: 30rpx;
      @include customShadow();

      /* 封面图 */
      .cover {
        width: 192rpx;
        height: 192rpx;
        border-radius: 10rpx;
        overflow: hidden;
        flex-shrink: 0;
      }

      /* 信息区域 */
      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 192rpx;

        .name {
          font-weight: bold;
          font-size: 28rpx;
          color: $qs-font-title;
          line-height: 1.4;
          @include ellipsis(1);
        }

        /* 详情区域（左右布局） */
        .need {
          flex: 1;
          display: flex;
          justify-content: space-between;
          margin-top: 10rpx;

          /* 左侧信息行 */
          .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .row-item {
              font-size: 24rpx;
              color: $qs-font-dec;
              @include ellipsis(1);

              .label {
                color: $qs-font-dec2;
              }
            }
          }

          /* 右侧按钮 */
          .right {
            display: flex;
            align-items: flex-end;
            flex-shrink: 0;
            margin-left: 16rpx;

            .checkLook {
              padding: 10rpx 24rpx;
              background-color: $qs-brandColor;
              border-radius: 30rpx;
              font-size: 24rpx;
              color: #ffffff;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
</style>
