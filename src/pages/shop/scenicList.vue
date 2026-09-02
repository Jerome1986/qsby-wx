<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { storeScenicListApi } from '@/api/store'
import type { ScenicItem } from '@/types/Scenic'

// 当前门店ID
const shopId = ref('')

const scenicList = ref<ScenicItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false)
const loading = ref(false)
const hasFetched = ref(false)

// 获取景区列表
const scenicListGet = async (): Promise<void> => {
  if (!shopId.value || loading.value || finish.value) return
  loading.value = true

  try {
    const res = await storeScenicListApi(shopId.value, pageNum.value, pageSize.value)
    console.log('景区列表', res)

    const list = res.data?.list || []
    scenicList.value.push(...list)

    if (pageNum.value < (res.data?.totalPage || 0)) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } catch (err) {
    console.error('获取景区列表失败', err)
    uni.showToast({ icon: 'none', title: '获取景区列表失败' })
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

// 查看详情占位函数
const handleViewDetail = (scenicId: string): void => {
  console.log('查看景区详情占位', scenicId)
  uni.navigateTo({
    url: `/pages/shop/scenicDetail?scenicId=${scenicId}&shopId=${shopId.value}`,
  })
}

onLoad((options) => {
  shopId.value = options?.shopId || ''
  scenicListGet()
})

const handleScrollToLower = () => {
  scenicListGet()
}
</script>

<template>
  <view class="scenic-list-page">
    <NavHead title="景区列表" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false"
      @scrolltolower="handleScrollToLower">
      <view class="content-inner">
        <view class="banner">
          <image mode="aspectFill"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/shopBanner2.png"></image>
          <view class="banner-mask"></view>
          <view class="banner-text">
            <view class="banner-title">周边景区推荐</view>
            <view class="banner-desc">精选门店附近适合慢游打卡的目的地</view>
          </view>
        </view>

        <view class="section-title">
          <NavTitle title="附近景区"></NavTitle>
        </view>

        <view v-if="loading && !scenicList.length" class="loading">加载中...</view>
        <view v-else-if="hasFetched && !scenicList.length" class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="aspectFit"></image>
          <text class="empty-text">暂无周边景区</text>
        </view>
        <view v-else class="scenic-list">
          <view class="scenic-item" v-for="item in scenicList" :key="item._id">
            <view class="scenic-cover">
              <image mode="aspectFill" :src="item.cover"></image>
            </view>
            <view class="scenic-info">
              <view class="scenic-head">
                <view class="scenic-name">{{ item.name }}</view>
                <view class="scenic-tag">{{ item.tag }}</view>
                <view class="scenic-address">{{ item.address }}</view>
              </view>
              <view class="scenic-foot">
                <view class="scenic-meta">
                  <text class="scenic-distance">{{ item.distance }}</text>
                </view>
                <view class="scenic-btn" @tap.stop="handleViewDetail(item._id)">查看详情</view>
              </view>
            </view>
          </view>
        </view>
        <view class="load-more-tip" v-if="scenicList.length && loading">加载中...</view>
        <view class="load-more-tip" v-else-if="scenicList.length && finish">没有更多了</view>

        <view class="scroll-bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.scenic-list-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
}

.content-inner {
  padding: 24rpx;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

.banner {
  position: relative;
  height: 300rpx;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  @include customShadow();

  image {
    width: 100%;
    height: 100%;
  }

  .banner-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.08) 62%);
  }

  .banner-text {
    position: absolute;
    left: 28rpx;
    right: 28rpx;
    bottom: 28rpx;
  }

  .banner-title {
    margin-bottom: 10rpx;
    font-size: 42rpx;
    font-weight: bold;
    color: #ffffff;
  }

  .banner-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.88);
  }
}

.section-title {
  margin-bottom: 20rpx;
}

.loading,
.empty {
  padding: 80rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-img {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 24rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: $qs-font-dec;
  }
}

.load-more-tip {
  padding: 8rpx 0 24rpx;
  text-align: center;
  font-size: 24rpx;
  color: $qs-font-dec2;
}

.scenic-list {
  .scenic-item {
    display: flex;
    gap: 20rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    background-color: $qs-card-bg;
    border-radius: 20rpx;
    @include customShadow();
  }

  .scenic-cover {
    width: 200rpx;
    height: 240rpx;
    border-radius: 10rpx;
    overflow: hidden;
    flex-shrink: 0;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .scenic-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .scenic-name {
    margin-bottom: 12rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    line-height: 1.4;
    @include ellipsis(1);
  }

  .scenic-tag {
    margin-bottom: 10rpx;
    font-size: 24rpx;
    color: $qs-font-title;
    line-height: 1.5;
    @include ellipsis(1);
  }

  .scenic-address {
    font-size: 24rpx;
    color: $qs-font-dec;
    line-height: 1.5;
    @include ellipsis(2);
  }

  .scenic-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
  }

  .scenic-meta {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
    font-size: 24rpx;
  }

  .scenic-distance {
    color: $qs-font-dec;
  }

  .scenic-btn {
    flex-shrink: 0;
    padding: 10rpx 24rpx;
    background-color: $qs-brandColor;
    border-radius: 30rpx;
    font-size: 24rpx;
    color: $qs-font-title;
    font-weight: 500;
  }
}
</style>
