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
  if (item.status === 'active' && item.stock > 0) goDetail(item._id)
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
        <view
          class="product-item"
          v-for="item in scoreProdctData"
          :key="item._id"
          :class="{
            disabled: item.status === 'disabled',
            'sold-out': item.stock <= 0,
          }"
          @tap="handleProductTap(item)"
        >
          <view class="cover-wrap">
            <image class="cover" :src="item.cover" mode="aspectFill"></image>
            <view class="category-tag" v-if="item.categoryName">{{ item.categoryName }}</view>
            <view class="status-mask" v-if="item.status === 'disabled' || item.stock <= 0">
              <text>{{ item.status === 'disabled' ? '已下架' : '已兑完' }}</text>
            </view>
          </view>
          <view class="info">
            <view class="meta">
              <view class="title">{{ item.name }}</view>
              <view
                class="stock-tag"
                :class="{ warning: item.stock > 0 && item.stock <= 5, empty: item.stock <= 0 }"
              >
                {{ item.stock > 0 ? `剩余 ${item.stock} 件` : '暂无库存' }}
              </view>
            </view>
            <view class="content">
              <view class="score-row">
                <text class="score-price">{{ item.scorePrice }}</text>
                <text class="score-unit">积分</text>
              </view>
              <view class="exchange-btn">
                {{ item.status === 'disabled' ? '暂不可兑' : item.stock <= 0 ? '已兑完' : '立即兑换' }}
              </view>
            </view>
          </view>
        </view>
        <view class="list-state" v-if="loading">加载中...</view>
        <view class="list-state" v-else-if="scoreProdctData.length === 0">暂无积分商品</view>
        <view class="list-state" v-else-if="finish">没有更多了</view>
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
  padding: 0 24rpx 12rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 单个商品卡片 */
.product-item {
  display: flex;
  align-items: stretch;
  padding: 22rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  &.disabled,
  &.sold-out {
    .exchange-btn {
      color: #ffffff;
      background: #b8b8b8;
      box-shadow: none;
    }
  }

  /* 商品封面 */
  .cover-wrap {
    position: relative;
    width: 210rpx;
    height: 210rpx;
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
      background: linear-gradient(135deg, $qs-brandColor, color.adjust($qs-brandColor, $lightness: -10%));
      border-radius: 16rpx 0 12rpx 0;
      z-index: 1;
    }

    .status-mask {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.38);

      text {
        padding: 10rpx 24rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.9);
        border-radius: 30rpx;
        font-size: 26rpx;
        font-weight: 500;
        color: #ffffff;
      }
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
        line-height: 1.45;
        @include ellipsis(2);
      }

      .stock-tag {
        display: inline-flex;
        align-items: center;
        margin-top: 14rpx;
        padding: 5rpx 14rpx;
        border-radius: 18rpx;
        font-size: 22rpx;
        line-height: 1.4;
        color: #4f7c63;
        background: #edf8f1;

        &.warning {
          color: #c76b16;
          background: #fff3e5;
        }

        &.empty {
          color: $qs-font-dec2;
          background: #f1f1f1;
        }
      }
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 12rpx;
      padding-top: 12rpx;
      border-top: 1rpx solid rgba($qs-border, 0.6);

      .score-row {
        display: flex;
        align-items: baseline;
        gap: 4rpx;

        .score-price {
          font-size: 38rpx;
          font-weight: bold;
          line-height: 1;
          color: #e49a14;
        }

        .score-unit {
          font-size: 22rpx;
          color: #b87910;
        }
      }

      .exchange-btn {
        min-width: 132rpx;
        height: 58rpx;
        padding: 0 20rpx;
        border-radius: 29rpx;
        font-size: 24rpx;
        font-weight: 500;
        line-height: 58rpx;
        text-align: center;
        color: $qs-font-title;
        background: linear-gradient(135deg, $qs-brandColor 0%, color.adjust($qs-brandColor, $lightness: -6%) 100%);
        box-shadow: 0 4rpx 12rpx rgba($qs-brandColor, 0.35);
      }
    }
  }
}

.list-state {
  padding: 24rpx 0 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: $qs-font-dec2;
}

/* 底部占位，防止内容被裁切 */
.bottom-placeholder {
  height: 48rpx;
}
</style>
