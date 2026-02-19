<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info.ts'

onLoad(() => {
  getSafeAreaBottom()
})
</script>

<template>
  <view class="playDetail">
    <NavHead title="行程详情" :show-back="true"></NavHead>
    <!--  滚动内容区域  -->
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 商品信息 -->
      <view class="productInfo">
        <view class="top">
          <view class="cover">
            <image
              mode="aspectFill"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            ></image>
          </view>
          <view class="info">
            <view class="title-row">
              <view class="title">12.5北疆大环线(轻奢小团)</view>
              <view class="poster-btn">生成海报</view>
            </view>
            <view class="time">
              <text class="iconfont icon-shijian1"></text>
              <text>2025-12-27 12:00:00</text>
            </view>
            <view class="address">
              <text class="iconfont icon-address"></text>
              <text>黑龙江省哈尔滨市阿城区地址信息地址 地址（信息）</text>
            </view>
          </view>
        </view>
        <view class="bottom">
          <view class="row">
            <view class="text">行程报名费用</view>
            <view class="value">￥400.00</view>
          </view>
          <view class="row">
            <view class="text">佣金</view>
            <view class="value">￥200.00</view>
          </view>
        </view>
      </view>

      <!-- 商户信息 -->
      <view class="shopInfo">
        <view class="top">
          <view class="left">
            <view class="title">千宿百院武汉公司</view>
            <view class="address">黑龙江省哈尔滨市阿城区地址信息地址地址（信息）</view>
          </view>
          <view class="right">
            <text class="iconfont icon-ditu"></text>
            <view class="text">地图</view>
          </view>
        </view>
        <view class="bottom">
          <view class="signUp">已报名（13/20）</view>
          <view class="num">
            <view class="item">
              <text class="male">男</text>
              <text class="count">5人</text>
            </view>
            <view class="item">
              <text class="female">女</text>
              <text class="count">8人</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 组织方 -->
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

      <!-- 活动介绍 -->
      <view class="activity">
        <view class="title">活动介绍</view>
        <view class="content">活动内容</view>
      </view>
      <!-- 底部占位，防止阴影被裁剪 -->
      <view class="scroll-bottom-placeholder"></view>
    </scroll-view>
    <!--  底部操作区  -->
    <view class="footerBar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="share">
        <view class="icon">
          <image
            mode="aspectFill"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/xc/share.png"
          ></image>
        </view>
        <view>分享</view>
      </view>
      <!--   报名按钮   -->
      <view class="sign">行程报名</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.playDetail {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 180rpx;
  height: 100%;
  @include page-background();
}

/* 内容区域 scroll */
.content {
  flex: 1;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

/* 商品信息卡片 */
.productInfo {
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  .top {
    padding-bottom: 24rpx;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    .cover {
      width: 192rpx;
      height: 215rpx;
      background: #f7d11a;
      border-radius: 24rpx;
      overflow: hidden;
    }

    .info {
      flex: 1;
      margin-left: 24rpx;

      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16rpx;

        .title {
          flex: 1;
          font-weight: bold;
          font-size: 28rpx;
          color: $qs-font-title;
          line-height: 1.4;
          @include ellipsis(2);
        }

        .poster-btn {
          flex-shrink: 0;
          margin-left: 16rpx;
          text-align: center;
          width: 130rpx;
          height: 44rpx;
          line-height: 44rpx;
          background: #ffd018;
          border-radius: 22rpx;
          font-size: 22rpx;
          color: $qs-font-title;
        }
      }

      .time,
      .address {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: $qs-font-dec;

        .iconfont {
          margin-right: 8rpx;
          font-size: 28rpx;
        }
      }

      .time {
        margin-top: 16rpx;
      }

      .address {
        align-items: flex-start;
        margin-top: 12rpx;

        text:last-child {
          flex: 1;
          @include ellipsis(2);
        }
      }
    }
  }

  .bottom {
    margin-top: 16rpx;

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .text {
        font-size: 28rpx;
        color: $qs-font-title;
        font-weight: bold;
      }

      .value {
        font-weight: bold;
        font-size: 28rpx;
        color: #ff3434;
      }
    }
  }
}

/* 商户信息卡片 */
.shopInfo {
  margin-top: 24rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 20rpx;
    border-bottom: 1px solid #f5f5f5;

    .left {
      flex: 1;
      margin-right: 24rpx;

      .title {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        margin-bottom: 12rpx;
      }

      .address {
        font-size: 24rpx;
        color: $qs-font-dec;
        line-height: 1.5;
        @include ellipsis(2);
      }
    }

    .right {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .iconfont {
        font-size: 40rpx;
        color: #f7821a;
      }

      .text {
        margin-top: 4rpx;
        font-size: 24rpx;
        color: #919191;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;

    .signUp {
      font-size: 26rpx;
      color: $qs-font-title;
    }

    .num {
      display: flex;
      gap: 24rpx;

      .item {
        display: flex;
        align-items: center;
        font-size: 26rpx;

        .male {
          color: #5b9bd5;
        }

        .female {
          color: #ff8fab;
        }

        .count {
          color: $qs-font-title;
        }
      }
    }
  }
}

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

/* 活动介绍卡片 */
.activity {
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
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.8;
  }
}

/* 底部操作区域 */
.footerBar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border-top: 1px solid #f1f1f1;

  .share {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
    color: $qs-font-dec;

    .icon {
      width: 46rpx;
      height: 39rpx;
      margin-bottom: 4rpx;
    }
  }

  .sign {
    flex: 1;
    margin-left: 40rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #ffd018;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
