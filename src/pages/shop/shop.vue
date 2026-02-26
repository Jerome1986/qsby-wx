<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'
import FilterBar from '@/components/FilterBar.vue'
import { ref } from 'vue'

const navBar = [
  {
    name: '民宿博主',
    url: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/shop/minsu.png',
  },
  {
    name: '活动策划人',
    url: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/shop/cehuaren.png',
  },
  {
    name: '旅行博主',
    url: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/shop/lvxing.png',
  },
]

const cateData = ref([
  { _id: '01', cateName: '武汉' },
  { _id: '02', cateName: '合肥' },
  { _id: '03', cateName: '长沙' },
  { _id: '04', cateName: '黄石' },
])

// 门店详情
const handleDetail = () => {
  uni.navigateTo({
    url: '/pages/shop/shopDetail',
  })
}

// 跳转主理人权益
const handleRights = () => {
  uni.navigateTo({
    url: '/pages/shop/managerRights',
  })
}
</script>
<template>
  <view class="shop">
    <NavHead title="自营门店" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 顶部横幅 -->
      <view class="banner">
        <image
          mode="aspectFill"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/shop/shopBanner1.png"
        ></image>
      </view>
      <!--  主理人权益  -->
      <view class="section">
        <NavTitle title="千宿百院/主理人计划"></NavTitle>
        <view class="interests" @tap="handleRights">
          <view class="top">
            <view class="left">
              <text class="iconfont icon-wode" style="margin-right: 8rpx; font-weight: bold"></text>
              <view class="value" style="font-weight: bold">主理人计划</view>
            </view>
            <view class="right">
              <view class="text">加入主理人 享3大权益</view>
            </view>
          </view>
          <view class="bottom">
            <view class="item" v-for="(item, index) in navBar" :key="index">
              <image mode="aspectFit" :src="item.url" style="width: 66rpx; height: 66rpx"></image>
              <view class="info">{{ item.name }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="section">
        <NavTitle title="千宿百院/自营门店"></NavTitle>
      </view>
      <!--   筛选（不加padding，内部有遮罩）   -->
      <view class="filter">
        <FilterBar :cate-data="cateData" title="所有门店" :is-icon="true"></FilterBar>
      </view>
      <!--   门店列表   -->
      <view class="shopList">
        <view class="shop-item" v-for="index in 5" :key="index" @tap="handleDetail">
          <view class="cover">
            <image
              mode="aspectFill"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            ></image>
          </view>
          <view class="info">
            <view class="head">
              <view class="title">千宿百院介绍</view>
              <view class="address"> 湖北省武汉市武昌区和平大道619号 </view>
            </view>
            <view class="foot">
              <view class="distance">大约距您3.5公里</view>
              <view class="btn">进店</view>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 40rpx"></view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.shop {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
}

/* 带左右padding的区块 */
.section {
  padding: 0 24rpx;
}

/* 顶部横幅 */
.banner {
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  height: 188rpx;
  border-radius: 30rpx;
  overflow: hidden;
}

/* 筛选区域（无padding，遮罩需全宽） */
.filter {
  margin: 20rpx 0;
}

/* 主理人权益卡片 */
.interests {
  display: flex;
  flex-direction: column;
  margin: 24rpx 0;
  background: linear-gradient(to left, #fff5d2, #fff6da);
  border-radius: 30rpx;
  height: 210rpx;
  overflow: hidden;
  @include customShadow();

  .top {
    display: flex;
    height: 70rpx;

    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 300rpx;
      height: 100%;
      background-color: $qs-brandColor;
      border-radius: 30rpx 0 0 0;
      clip-path: polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0 30rpx 0 0;
      flex: 1;

      .text {
        font-weight: bold;
        color: $qs-font-title;
        font-style: italic;
      }
    }
  }

  .bottom {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 0 0 30rpx 30rpx;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .info {
        margin-top: 8rpx;
        font-size: 24rpx;
        color: $qs-font-dec2;
      }
    }
  }
}

/* 门店列表 */
.shopList {
  padding: 0 24rpx;

  .shop-item {
    display: flex;
    gap: 20rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    background-color: #ffffff;
    border-radius: 20rpx;
    @include customShadow();

    .cover {
      width: 200rpx;
      height: 240rpx;
      border-radius: 10rpx;
      overflow: hidden;
      flex-shrink: 0;
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .head {
        .title {
          font-size: 28rpx;
          font-weight: bold;
          color: $qs-font-title;
          line-height: 1.4;
          margin-bottom: 12rpx;
          @include ellipsis(1);
        }

        .address {
          display: flex;
          align-items: flex-start;
          font-size: 24rpx;
          color: $qs-font-dec;
          line-height: 1.5;

          .iconfont {
            margin-right: 6rpx;
            font-size: 26rpx;
            flex-shrink: 0;
          }

          text:last-child {
            @include ellipsis(2);
          }
        }
      }

      .foot {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .distance {
          font-size: 24rpx;
          color: #ff3b3b;
        }

        .btn {
          padding: 10rpx 32rpx;
          background-color: $qs-brandColor;
          border-radius: 30rpx;
          font-size: 24rpx;
          color: $qs-font-title;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
