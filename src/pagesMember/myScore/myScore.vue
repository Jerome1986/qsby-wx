<script setup lang="ts">
import { scoreProductGetApi } from '@/api/score'
import NavHead from '@/components/NavHead.vue'
import { useUserStore } from '@/stores'
import type { ScoreProduct } from '@/types/Score'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const userStore = useUserStore()
// 分页
const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false)
// 积分商品列表
const scoreProdctData = ref<ScoreProduct[]>([])
const loading = ref(false)

/** 获取积分商品列表（分页追加） */
const scoreProductGet = async () => {
  if (finish.value || loading.value) return
  loading.value = true
  try {
    const res = await scoreProductGetApi(pageNum.value, pageSize.value)
    scoreProdctData.value.push(...res.data.list)
    if (pageNum.value < res.data.totalPage) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } finally {
    loading.value = false
  }
}

onLoad(() => scoreProductGet())

/** 重置分页与列表 */
const reset = () => {
  pageNum.value = 1
  scoreProdctData.value = []
  finish.value = false
}

/** 触底加载更多 */
const handleScroll = () => {
  if (!finish.value) scoreProductGet()
}

/** 跳转积分商品详情 */
const goDetail = (productId: string) => {
  uni.navigateTo({
    url: `/pagesMember/myScore/scoreProductDetail?productId=${productId}`,
  })
}

/** 仅上架商品可点击进入详情 */
const handleProductTap = (item: ScoreProduct) => {
  if (item.status === 'active') goDetail(item._id)
}

/** 积分明细 / 积分订单 跳转 */
const handelGo = (val: string) => {
  switch (val) {
    case 'detail':
      uni.navigateTo({
        url: '/pagesMember/myScore/scoreDetail',
      })
      break
    case 'order':
      console.log('积分订单')
      uni.navigateTo({
        url: '/pagesMember/myScore/scoreOrder',
      })
      break
  }
}
</script>
<template>
  <view class="myScore">
    <NavHead title="我的积分" :show-back="true"></NavHead>
    <!-- 积分展示   -->
    <view style="padding:0 24rpx;margin-top: 24rpx;">
      <view class="head">
        <view class="title">我的积分</view>
        <view class="value">
          <view class="score">{{ userStore.profile?.score }}</view>
          <view class="btn">
            <view class="details item" @tap="handelGo('detail')">积分明细</view>
            <view class="order item" @tap="handelGo('order')">积分订单</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 积分商品   -->
    <scroll-view class="productScore" :scroll-y="true" @scrolltolower="handleScroll" :enhanced="true"
      :show-scrollbar="false">
      <view class="product-list">
        <view class="product-item" v-for="item in scoreProdctData" :key="item._id"
          :class="{ disabled: item.status === 'disabled' }" @tap="handleProductTap(item)">
          <view class="cover-wrap">
            <image class="cover" :src="item.cover" mode="aspectFill"></image>
            <view class="category-tag" v-if="item.categoryName">{{ item.categoryName }}</view>
          </view>
          <view class="info">
            <view class="meta">
              <view class="title">{{ item.name }}</view>
              <view class="category" v-if="item.categoryName">{{ item.categoryName }}</view>
            </view>
            <view class="content">
              <view class="score-row">
                <text class="label">所需</text>
                <text class="score-price">{{ item.scorePrice }}积分</text>
              </view>
              <view class="exchange-btn">{{ item.status === 'disabled' ? '暂不可兑' : '立即兑换' }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-placeholder"></view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.myScore {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

/* 积分展示卡片 */
.head {
  padding: 30rpx;
  background-color: $qs-card-bg;
  border-radius: 30rpx;
  @include customShadow();

  .title {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #0b0a0a;
  }

  .value {
    display: flex;
    justify-content: space-between;

    /* 积分数值 */
    .score {
      font-weight: bold;
      font-size: 40rpx;
      color: $qs-font-dec;
    }

    /* 积分明细/订单按钮 */
    .btn {
      display: flex;

      .item {
        text-align: center;
        width: 150rpx;
        height: 47rpx;
        line-height: 47rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
      }

      .details {
        margin-right: 10rpx;
        border: 1px solid $qs-brandColor;
        color: #ffd018;
      }

      .order {
        background-color: #ffd018;
        color: #121212;
      }
    }
  }
}

/* 积分商品列表区域 */
.productScore {
  flex: 1;
  margin-top: 24rpx;
}

.product-list {
  padding: 0 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 单个商品卡片 */
.product-item {
  display: flex;
  align-items: stretch;
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  /* 下架商品 */
  &.disabled {
    opacity: 0.6;

    .cover-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 16rpx;
    }

    .exchange-btn {
      background: $qs-font-dec2;
      color: $qs-font-dec;
    }
  }

  /* 商品封面 */
  .cover-wrap {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
    margin-right: 24rpx;
    border-radius: 16rpx;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.04);

    .cover {
      width: 100%;
      height: 100%;
    }

    .category-tag {
      position: absolute;
      top: 0;
      left: 0;
      padding: 6rpx 14rpx;
      font-size: 20rpx;
      color: #fff;
      background: linear-gradient(135deg, $qs-brandColor, darken($qs-brandColor, 10%));
      border-radius: 16rpx 0 12rpx 0;
      z-index: 1;
    }
  }

  /* 商品信息区 */
  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .meta {
      .title {
        font-size: 30rpx;
        font-weight: bold;
        color: $qs-font-title;
        line-height: 1.4;
        @include ellipsis(2);
      }

      .category {
        margin-top: 6rpx;
        font-size: 24rpx;
        color: $qs-font-dec2;
      }

      .store-name {
        margin-top: 6rpx;
        font-size: 24rpx;
        color: $qs-font-dec;
      }
    }

    /* 积分价格 + 兑换按钮 */
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12rpx;
      padding-top: 12rpx;
      border-top: 1rpx solid rgba($qs-border, 0.6);

      .score-row {
        display: flex;
        align-items: baseline;
        gap: 6rpx;

        .label {
          font-size: 24rpx;
          color: $qs-font-dec2;
        }

        .score-price {
          font-size: 32rpx;
          font-weight: bold;
          color: $qs-brandColor;
        }
      }

      .exchange-btn {
        padding: 0 28rpx;
        height: 56rpx;
        line-height: 56rpx;
        font-size: 26rpx;
        font-weight: 500;
        color: $qs-font-title;
        background: linear-gradient(135deg, $qs-brandColor 0%, darken($qs-brandColor, 6%) 100%);
        border-radius: 28rpx;
        box-shadow: 0 4rpx 12rpx rgba($qs-brandColor, 0.35);
      }
    }
  }
}

/* 底部占位，防止内容被裁切 */
.bottom-placeholder {
  height: 48rpx;
}
</style>
