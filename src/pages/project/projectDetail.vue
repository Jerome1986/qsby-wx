<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref, onMounted } from 'vue'
import { safeAreaBottom, getSafeAreaBottom } from '@/utils/system-info'
import OrganizerInfo from '@/components/OrganizerInfo.vue'

onMounted(() => {
  getSafeAreaBottom()
})

// 分享
const handleShare = () => {
  // TODO: 分享逻辑
}

// 跳转项目发布支付页面
const handleUnlock = () => {
  uni.navigateTo({
    url: '/pages/project/checkProject',
  })
}

// 项目介绍
const introText = ref(
  '12.27体验冬日里的庐山，内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案内容文案。',
)
const introImages = ref([
  'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
  'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg',
])
</script>
<template>
  <view class="projectDetail">
    <NavHead title="项目详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 产品信息 + 位置信息 -->
      <view class="card product-card">
        <!-- 上半部分：封面 + 基本信息 -->
        <view class="product-top">
          <view class="cover">
            <image
              mode="aspectFill"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            ></image>
          </view>
          <view class="product-info">
            <view class="name">一起开一个游乐园</view>
            <view class="detail-item">
              <text class="label">行业类别：</text>
              <text class="value">餐饮美食</text>
            </view>
            <view class="detail-item">
              <text class="label">合作方式：</text>
              <text class="value">资源合作</text>
            </view>
            <view class="detail-item">
              <text class="label">合作规模：</text>
              <text class="value">50W-100W</text>
            </view>
          </view>
        </view>
        <!-- 下半部分：位置信息 -->
        <view class="location-row">
          <view class="location-left">
            <view class="loc-name">千宿百院创业孵化基地</view>
            <view class="loc-address">湖北省武汉市洪山区地址信息地址地址（信息）</view>
          </view>
          <view class="location-right">
            <text class="iconfont icon-address"></text>
            <text class="map-text">地图</text>
          </view>
        </view>
      </view>

      <!-- 发布人 -->
      <OrganizerInfo></OrganizerInfo>

      <!-- 项目介绍 -->
      <view class="card intro-card">
        <view class="section-title">项目介绍</view>
        <view class="intro-text" v-if="introText">
          <text>{{ introText }}</text>
        </view>
        <view class="intro-images" v-if="introImages.length">
          <image
            v-for="(img, index) in introImages"
            :key="index"
            :src="img"
            mode="widthFix"
            class="intro-img"
          ></image>
        </view>
      </view>

      <!-- 底部占位 -->
      <view style="height: 140rpx"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="share-btn" @tap="handleShare">
        <view class="icon">
          <image
            mode="aspectFill"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/xc/share.png"
          ></image>
        </view>
        <text class="share-text">分享</text>
      </view>
      <view class="unlock-btn" @tap="handleUnlock">查看项目发布人</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.projectDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  padding: 24rpx;
}

/* 通用卡片 */
.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

/* 区块标题 */
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: $qs-font-title;
  margin-bottom: 24rpx;
}

/* 产品信息卡（含位置） */
.product-card {
  .product-top {
    display: flex;
    gap: 20rpx;
    padding-bottom: 24rpx;
    border-bottom: 1rpx solid $qs-border;

    .cover {
      width: 192rpx;
      height: 192rpx;
      border-radius: 10rpx;
      overflow: hidden;
      flex-shrink: 0;
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 192rpx;

      .name {
        font-size: 32rpx;
        font-weight: bold;
        color: $qs-font-title;
        line-height: 1.4;
        @include ellipsis(2);
      }

      .detail-item {
        font-size: 28rpx;
        color: $qs-font-dec2;
      }
    }
  }

  /* 位置信息（下边框下方） */
  .location-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24rpx;

    .location-left {
      flex: 1;
      margin-right: 20rpx;

      .loc-name {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        margin-bottom: 8rpx;
      }

      .loc-address {
        font-size: 24rpx;
        color: $qs-font-dec;
        @include ellipsis(1);
      }
    }

    .location-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;

      .iconfont {
        font-size: 40rpx;
        color: $qs-brandColor;
      }

      .map-text {
        font-size: 22rpx;
        color: $qs-font-dec;
        margin-top: 4rpx;
      }
    }
  }
}

/* 项目介绍卡 */
.intro-card {
  margin-top: 24rpx;
  .intro-text {
    font-size: 28rpx;
    color: $qs-font-dec;
    line-height: 1.8;
  }

  .intro-images {
    display: flex;
    flex-direction: column;
    gap: 16rpx;

    .intro-img {
      width: 100%;
      height: auto;
      border-radius: 10rpx;
    }
  }

  .intro-text + .intro-images {
    margin-top: 24rpx;
  }
}

/* 底部操作栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .share-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30rpx;

    .icon {
      width: 46rpx;
      height: 39rpx;
      margin-bottom: 4rpx;
    }

    .share-text {
      font-size: 24rpx;
      color: $qs-font-dec;
    }
  }

  .unlock-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: $qs-brandColor;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
