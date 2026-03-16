<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'
import FilterBar from '@/components/FilterBar.vue'
import { ref, computed } from 'vue'
import { cityDataApi, filterSotreListAll, storeCate } from '@/api/store'
import type { CityItem, StoreCategoryItem, StoreItem } from '@/types/store'
import { navBar } from './data'
import { onLoad } from '@dcloudio/uni-app'
import { formatDistance, getDistance } from '@/utils/distance'


// 获取所有分类
const cateData = ref<StoreCategoryItem[]>([])

const storeCateGet = async () => {
  const res = await storeCate(1, 100)
  console.log(res)
  cateData.value = res.data.list.map(item => ({ cateName: item.name, ...item }))
}

// 获取城市列表
const cityData = ref<CityItem[]>([])
const cityDataGet = async () => {
  const res = await cityDataApi()
  cityData.value = res.data.filter(item => item.status === 'active')
  console.log(cityData.value)
}

// 获取门店列表
const storeList = ref<StoreItem[]>([])
const cityId = ref('5')
const cateId = ref('')
const finish = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
const storeListGet = async (cityId: string, cateId: string) => {
  if (finish.value) return
  const res = await filterSotreListAll('', cityId, cateId, pageNum.value, pageSize.value)
  console.log('store', res.data)

  storeList.value = res.data.list

  if (pageNum.value < res.data.totalPage) {
    pageNum.value++
  } else {
    finish.value = true
  }
}

const reset = () => {
  pageNum.value = 1
  storeList.value = []
  finish.value = false
}

const handleMore = () => {
  if (!finish.value)
    storeListGet(cityId.value, cateId.value)
}

const handleChangeCate = (cateId: string) => {
  storeListGet(cateId, cityId.value)
}

const handleChangeSort = (sortId: string) => {
  console.log('change')
  reset()
  storeListGet(cateId.value, sortId)
}


onLoad(async () => {
  await Promise.all([
    storeCateGet(),
    cityDataGet(),
    storeListGet(cityId.value, cateId.value)
  ])
})

// 门店详情
const handleDetail = (shopId: string) => {
  uni.navigateTo({
    url: `/pages/shop/shopDetail?shopId=${shopId}`,
  })
}

// 跳转主理人权益
const handleRights = () => {
  uni.navigateTo({
    url: '/pages/shop/managerRights',
  })
}


// 获取用户定位
const myLatitude = ref<number>()
const myLongitude = ref<number>()
wx.getFuzzyLocation({
  type: 'wgs84',
  success(res) {
    console.log('定位', res)
    myLatitude.value = res.latitude
    myLongitude.value = res.longitude
  },
  fail(err) {
    console.error('定位', err)
  }
})

// 按距离排序后的门店列表（有定位时按距离升序，无定位时保持原序）
const sortedStoreList = computed(() => {
  const list = storeList.value
  const lat = myLatitude.value
  const lng = myLongitude.value
  if (!lat || !lng || list.length === 0) return list
  return [...list].sort((a, b) => {
    const latA = a.latitude ?? 0
    const lngA = a.longitude ?? 0
    const latB = b.latitude ?? 0
    const lngB = b.longitude ?? 0
    const distA = latA && lngA ? getDistance(lat, lng, latA, lngA) : Infinity
    const distB = latB && lngB ? getDistance(lat, lng, latB, lngB) : Infinity
    return distA - distB
  })
})


</script>
<template>
  <view class="shop">
    <NavHead title="自营门店" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <!-- 顶部横幅 -->
      <view class="banner">
        <image mode="aspectFill"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/shopBanner2.png">
        </image>
      </view>
      <!--  主理人权益  -->
      <view class="section">
        <NavTitle title="千宿百院/主理人计划"></NavTitle>
        <view class="interests" @tap="handleRights">
          <view class="top">
            <view class="left">
              <text class="iconfont icon-wode" style="margin-right: 8rpx; font-weight: bold"></text>
              <view class="value" style="font-weight: bold;color: #0B0A0A;">主理人计划</view>
            </view>
            <view class="right">
              <view class="text">加入主理人 享3大权益</view>
            </view>
          </view>
          <view class="bottom">
            <view class="item" v-for="(item, index) in navBar" :key="index">
              <image mode="aspectFit" :src="item.url" style="width: 40rpx; height: 40rpx"></image>
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
        <FilterBar :cate-data="cityData" :sort-data="cateData" title="武汉" :is-icon="true"
          @selected-cate="handleChangeCate" @select-sort="handleChangeSort"></FilterBar>
      </view>
      <!--   门店列表   -->
      <view class="shopList">
        <view class="shop-item" v-for="(item, index) in sortedStoreList" :key="item._id" @tap="handleDetail(item._id)">
          <view class="cover">
            <image mode="aspectFill" :src="item.cover">
            </image>
          </view>
          <view class="info">
            <view class="head">
              <view class="title">{{ item.name }}</view>
              <view class="address"> {{ item.address }} </view>
            </view>
            <view class="foot">
              <view class="distance" v-if="myLatitude && myLongitude">大约距您{{
                formatDistance(getDistance(myLatitude, myLongitude, item.latitude as number, item.longitude as number))
              }}</view>
              <view class="distance" v-else>暂时无法获取具体定位</view>
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


/* 顶部横幅 */
.banner {
  margin: 24rpx 0;
  padding: 0 24rpx;
  height: 188rpx;
  border-radius: 30rpx;
  overflow: hidden;
}

.section {
  padding: 0 24rpx;
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
  background: #fef8e5;
  border-radius: 30rpx;
  height: 160rpx;
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
      align-items: flex-end;
      justify-content: center;
      border-radius: 0 30rpx 0 0;
      flex: 1;

      .text {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
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
      align-items: center;
      gap: 16rpx;

      .info {
        margin-top: 8rpx;
        font-size: 24rpx;
        color: $qs-font-title;
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
    background-color: #fef8e5;
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
          color: #F7821A;
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
