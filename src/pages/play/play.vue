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
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const activityBanner = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/activity/fabuhd2.png'

// 排序
const sortData = ref([
  { _id: 'composite', cateName: '综合排序' },
  { _id: 'dailyHot', cateName: '日度排序' },
  { _id: 'enrolling', cateName: '正在报名' },
  { _id: 'startTime', cateName: '时间排序' },
])

// 筛选默认值
const activityCateData = ref<ActivityTypeItem[]>([])
const activityCateId = ref('all')
const activitySortId = ref<SortType>('composite')
const activityList = ref<ActivityListItem[]>([])
const activityPageNum = ref(1)
const activityPageSize = ref(10)
const activityFinish = ref(false)
const activityLoading = ref(false)
const activityHasFetched = ref(false)

const activityCateDataGet = async () => {
  const res = await activityTypeFindAll()
  console.log('活动分类', res)
  activityCateData.value = [{ _id: 'all', name: '全部' }, ...res.data]
}

const activityListGet = async (activityTypeId: string, sortType: SortType) => {
  if (activityFinish.value || activityLoading.value) return
  activityLoading.value = true
  try {
    const res = await activityListFindAll(
      activityTypeId,
      sortType,
      activityPageNum.value,
      activityPageSize.value,
    )
    activityList.value.push(...res.data.list)
    if (activityPageNum.value < res.data.totalPage) {
      activityPageNum.value++
    } else {
      activityFinish.value = true
    }
  } finally {
    activityLoading.value = false
    activityHasFetched.value = true
  }
}

const resetActivityAndFetch = (activityTypeId: string, sortType: SortType) => {
  activityList.value = []
  activityPageNum.value = 1
  activityFinish.value = false
  activityHasFetched.value = false
  activityListGet(activityTypeId, sortType)
}

onLoad(() => {
  activityCateDataGet()
  resetActivityAndFetch(activityCateId.value, activitySortId.value)
})

// 加载更多（scrolltolower 可能连续触发，需加 loading 锁）
const handleMore = () => {
  if (!activityFinish.value) activityListGet(activityCateId.value, activitySortId.value)
}

const handleSelectedActivityCate = (currentCateId: string) => {
  activityCateId.value = currentCateId
  resetActivityAndFetch(currentCateId, activitySortId.value)
}

const handleSelectedActivitySort = (currentSortId: SortType) => {
  activitySortId.value = currentSortId
  resetActivityAndFetch(activityCateId.value, currentSortId)
}

// 发布活动
const handleSend = () => {
  // 验证身份
  const isAdmin = userStore.profile?.role === 'admin'
  if (!isAdmin && !userStore.isValidManager) {
    uni.showToast({ icon: 'none', title: '请先申请主理人' })
    return
  }
  uni.navigateTo({
    url: '/pages/public/public',
  })
}
</script>
<template>
  <view class="play">
    <NavHead title="同城趣玩 " :show-back="true"></NavHead>
    <view class="content">
      <!--  发布  -->
      <view class="banner" @tap="handleSend">
        <image class="img" :src="activityBanner" mode="aspectFill">
        </image>
      </view>
      <!--  title    -->
      <view class="title">
        <NavTitle title="发现同城好玩的活动"></NavTitle>
      </view>
      <!--   筛选   -->
      <view class="filter">
        <FilterBar :cateData="activityCateData" :sortData="sortData" title="所有活动"
          @selected-cate="handleSelectedActivityCate" @select-sort="handleSelectedActivitySort"></FilterBar>
      </view>
    </view>
    <scroll-view class="list-scroll" :scroll-y="true" :enhanced="true" :show-scrollbar="false"
      @scrolltolower="handleMore">
      <!--   活动列表   -->
      <view class="list" v-if="activityList.length">
        <ProductCard :list="activityList" pro-type="activity"></ProductCard>
      </view>
      <view class="empty" v-else-if="activityHasFetched && !activityLoading">
        <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
          mode="widthFix"></image>
        <text class="empty-text">暂无数据</text>
      </view>
      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.play {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

/* 内容区域 */
.content {
  flex-shrink: 0;

  /* 顶部横幅 */
  .banner {
    padding: 0 24rpx;
    margin: 24rpx 0;
    width: 100%;
    height: 240rpx;
    border-radius: 30rpx;


    image {
      border-radius: 30rpx;
    }
  }

  /* 页面标题 */
  .title {
    padding: 0 24rpx;
    margin-bottom: 24rpx;
    color: $qs-font-title;
    font-weight: bold;
  }
}

/* 列表滚动区域 */
.list-scroll {
  flex: 1;
  min-height: 0;
  width: 100%;

  /* 活动列表 */
  .list {
    padding: 0 24rpx;
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
