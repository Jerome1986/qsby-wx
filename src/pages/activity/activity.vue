<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import FilterBar from '@/components/FilterBar.vue'
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import NavTitle from '@/components/NavTitle.vue'
import { activityListFindAll, activityTypeFindAll } from '@/api/activity'
import type { ActivityTypeItem } from '@/types/Public'
import { onLoad } from '@dcloudio/uni-app'
import type { SortType } from '@/types/Play'
import type { ActivityListItem } from '@/types/Activity'

const cateData = ref<ActivityTypeItem[]>([])
// 活动分类获取
const cateDataGet = async () => {
  const res = await activityTypeFindAll()
  console.log('分类', res)
  cateData.value = res.data
  cateData.value.push({ _id: 'all', name: '全部' })
}

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

const listData = ref<ActivityListItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false)
const listDataGet = async (activityTypeId: string, sortType: SortType) => {
  if (finish.value) return
  const res = await activityListFindAll(activityTypeId, sortType, pageNum.value, pageSize.value)
  listData.value.push(...res.data.list)

  if (pageNum.value < res.data.totalPage) {
    pageNum.value++
  } else {
    finish.value = true
  }
}

// 重置列表并加载（切换分类/排序时调用）
const resetAndFetch = (tripTypeId: string, sortType: SortType) => {
  listData.value = []
  pageNum.value = 1
  finish.value = false
  listDataGet(tripTypeId, sortType)
}

onLoad(() => {
  cateDataGet()
  resetAndFetch(cateId.value, sortId.value)
})

// 加载更多（scrolltolower 可能连续触发，需加 loading 锁）
const handleMore = () => {
  if (!finish.value) listDataGet(cateId.value, sortId.value)
}

// 处理分类选择
const handleSelectedCate = (currentCateId: string) => {
  cateId.value = currentCateId
  resetAndFetch(currentCateId, sortId.value)
}

// 处理排序选择
const handleSelectedSort = (currentSortId: SortType) => {
  sortId.value = currentSortId
  resetAndFetch(cateId.value, currentSortId)
}

const handleSend = () => {
  uni.navigateTo({
    url: '/pages/public/public',
  })
}
</script>
<template>
  <view class="activity">
    <NavHead title="同城活动 " :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <!--  发布  -->
      <view class="banner" @tap="handleSend">
        <image class="img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/activity/fabuhd2.png"
          mode="aspectFill">
        </image>
      </view>
      <!--  title    -->
      <view class="title">
        <NavTitle title="发现同城好玩的活动"></NavTitle>
      </view>
      <!--   筛选   -->
      <view class="filter">
        <FilterBar :cateData="cateData" :sortData="sortData" title="所有行程" @selected-cate="handleSelectedCate"
          @select-sort="handleSelectedSort"></FilterBar>
      </view>
      <!--   行程列表   -->
      <view class="list" v-if="listData.length">
        <ProductCard :list="listData" pro-type="activity"></ProductCard>
      </view>
      <!--   空状态   -->
      <view class="empty" v-else>
        <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
          mode="widthFix"></image>
        <text class="empty-text">暂无数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.activity {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
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
