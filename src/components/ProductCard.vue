<script setup lang="ts">
import type { PlayListItem } from '@/types/Play'
import { formatTimestamp } from '@/utils/generateMonth.ts'

// 跳转页面时根据类型来设置动态标题
const handleGo = (proId: string, title: string) => {
  uni.navigateTo({
    url: `/pages/productDetail/productDetail?productId=${proId}&title=${title}`,
  })
}

const props = withDefaults(
  defineProps<{
    list: PlayListItem[]
    title?: string
  }>(),
  {
    list: () => [],
  },
)
</script>

<template>
  <view
    class="productCard"
    v-for="item in list"
    :key="item._id"
    @tap="handleGo(item._id, item.title)"
  >
    <!--   封面   -->
    <view class="cover">
      <image :src="item.cover" mode="aspectFill"></image>
    </view>
    <!--   内容   -->
    <view class="productInfo">
      <view class="name">{{ item.title }}</view>
      <view class="bottom">
        <!-- 左侧信息 -->
        <view class="left">
          <view class="info-row">
            <text class="iconfont icon-shijian1" style="font-size: 32rpx"></text>
            <text class="text">{{ formatTimestamp(item.time, 2) }}</text>
          </view>
          <view class="info-row">
            <text class="iconfont icon-fangzi" style="font-size: 28rpx"></text>
            <text class="text shop">{{ item.address_name }}</text>
          </view>
          <view class="info-row">
            <text class="iconfont icon-address" style="font-size: 32rpx"></text>
            <text class="text address">{{ item.event_address }}</text>
          </view>
          <view class="info-row">
            <text class="text"
              >报名中 {{ Number(item.maleCount) + Number(item.femaleCount) }}/{{
                item.maxPeople
              }}</text
            >
          </view>
        </view>
        <!-- 右侧价格和按钮 -->
        <view class="right">
          <view class="price">￥{{ item.userFee }}</view>
          <view class="btn">我要报名</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 产品卡片 */
.productCard {
  margin-bottom: 24rpx;
  display: flex;
  gap: 20rpx; /* 封面与内容间距 */
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  @include customShadow(); /* 卡片阴影 */

  /* 封面图 */
  .cover {
    width: 200rpx;
    height: 240rpx;
    border-radius: 10rpx;
    overflow: hidden;
  }

  /* 产品信息区域 */
  .productInfo {
    flex: 1; /* 占据剩余宽度 */
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 标题和底部区域分开 */
    height: 240rpx; /* 与封面等高 */

    /* 产品名称 */
    .name {
      font-size: 28rpx;
      color: $qs-font-title;
      font-weight: bold;
      line-height: 1.4;
      @include ellipsis(2); /* 最多显示2行 */
    }

    /* 信息行（通用样式） */
    .info-row {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: $qs-font-dec2;

      .iconfont {
        margin-right: 8rpx; /* 图标与文字间距 */
      }

      .text {
        flex: 1;
      }
      // 商家名
      .shop {
        @include ellipsis(1);
      }
      /* 地址单行省略 */
      .address {
        @include ellipsis(1);
      }
    }

    /* 底部区域（左右布局） */
    .bottom {
      flex: 1; /* 占据标题以外的剩余高度 */
      display: flex;
      justify-content: space-between;
      margin-top: 10rpx;

      /* 左侧信息（时间、商家、地址、报名状态） */
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* 各行平均分配高度 */

        .info-row {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: $qs-font-dec;

          .iconfont {
            margin-right: 8rpx;
            font-size: 24rpx;
          }

          .address {
            @include ellipsis(1);
          }
        }
      }

      /* 右侧价格和按钮 */
      .right {
        display: flex;
        flex-direction: column;
        align-items: center; /* 右对齐 */
        justify-content: flex-end; /* 底部对齐 */

        /* 价格 */
        .price {
          font-size: 32rpx;
          font-weight: bold;
          color: #ff3b3b;
        }

        /* 操作按钮 */
        .btn {
          margin-top: 8rpx;
          padding: 8rpx 24rpx;
          background-color: $qs-brandColor;
          border-radius: 30rpx;
          font-size: 24rpx;
          color: $qs-font-title;
        }
      }
    }
  }
}
</style>
