<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import FilterBar from '@/components/FilterBar.vue'
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import NavTitle from '@/components/NavTitle.vue'
import { tripListGetAllApi, tripTypeGetAllApi } from '@/api/trip.ts'
import type { TripTypeItem } from '@/types/Public'
import { onLoad } from '@dcloudio/uni-app'
import type { PlayListItem, SortType } from '@/types/Play'

// 分类
const cateData = ref<TripTypeItem[]>([])
const tripTypeGet = async () => {
  const res = await tripTypeGetAllApi()
  console.log('分类', res)
  cateData.value = res.data
  cateData.value.push({ _id: 'all', name: '全部' })
}

onLoad(() => tripTypeGet())

// 排序
const sortData = ref([
  { _id: 'composite', cateName: '综合排序' },
  { _id: 'dailyHot', cateName: '日度排序' },
  { _id: 'enrolling', cateName: '正在报名' },
  { _id: 'startTime', cateName: '时间排序' },
])

// 筛选默认值
const cateId = ref('all')
const sortId = ref<SortType>('composite')

//  根据分类和排序获取行程列表
const pageNum = ref(1)
const pageSize = ref(10)
// 行程列表类型
const tripList = ref<PlayListItem[]>([])
const tripListGet = async (tripTypeId: string, sortType: SortType) => {
  const res = await tripListGetAllApi(tripTypeId, sortType, pageNum.value, pageSize.value)
  console.log(res)
  tripList.value = res.data.list
}
onLoad(() => tripListGet(cateId.value, sortId.value))

// 处理分类选择
const handleSelectedCate = (currentCateId: string) => {
  console.log(currentCateId)
  cateId.value = currentCateId
  tripListGet(currentCateId, sortId.value)
}

// 处理排序选择
const handleSelectedSort = (currentSortId: SortType) => {
  console.log(currentSortId)
  sortId.value = currentSortId
  tripListGet(cateId.value, currentSortId)
}

// 发布行程
const handleSend = () => {
  uni.navigateTo({
    url: `/pages/public/public?sendType=play`,
  })
}
</script>
<template>
  <view class="play">
    <NavHead title="趣哪•游 " :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  发布  -->
      <view class="banner" @tap="handleSend">
        <image
          class="img"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/fbxc.jpg"
          mode="aspectFill"
        ></image>
      </view>
      <!--  title    -->
      <view class="title">
        <NavTitle title="发现有趣好玩的行程"></NavTitle>
      </view>
      <!--   筛选   -->
      <view class="filter">
        <FilterBar
          :cateData="cateData"
          :sortData="sortData"
          title="所有行程"
          @selected-cate="handleSelectedCate"
          @select-sort="handleSelectedSort"
        ></FilterBar>
      </view>
      <!--   行程列表   -->
      <view class="list" v-if="tripList.length > 0">
        <ProductCard :list="tripList"></ProductCard>
      </view>
      <!--   空状态   -->
      <view class="empty" v-else>
        <image class="empty-img" src="/static/images/noAny.png" mode="widthFix"></image>
        <text class="empty-text">暂无数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.play {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background(); /* 渐变背景 */
}

/* 内容区域 */
.content {
  flex: 1;

  /* 顶部横幅 */
  .banner {
    padding: 0 24rpx;
    width: 100%;
    height: 240rpx;
    image {
      border-radius: 30rpx;
    }
  }

  /* 页面标题 */
  .title {
    padding: 0 24rpx;
    margin: 24rpx 0;
    color: $qs-font-title;
    font-weight: bold;
  }

  /* 行程列表 */
  .list {
    padding: 0 24rpx 60rpx;
    margin-top: 24rpx;
  }

  /* 空状态 */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;

    .empty-img {
      width: 320rpx;
    }

    .empty-text {
      margin-top: 24rpx;
      font-size: 28rpx;
      color: $qs-font-dec;
    }
  }
}
</style>
