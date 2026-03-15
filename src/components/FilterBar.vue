<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    cateData?: any[]
    sortData?: any[]
    title?: string
    isIcon?: boolean
  }>(),
  {
    cateData: () => [],
    sortData: () => [],
    title: '',
    isIcon: false,
  },
)

const emits = defineEmits(['selectedCate', 'selectSort'])

// 选择行程分类
const currentCateData = ref(props.title ?? props.cateData[0].name)
const filterCateActive = ref(false)
const handleFilterCate = () => {
  filterCateActive.value = !filterCateActive.value
  filterSortActive.value = false
}

const selectedCate = (item: any) => {
  currentCateData.value = item.name
  filterCateActive.value = false
  emits('selectedCate', item._id)
}

// 选择排序
const currentSortData = ref(props.sortData[0]?.cateName || '门店类型')
const filterSortActive = ref(false)
const handleFilterSort = () => {
  filterSortActive.value = !filterSortActive.value
  filterCateActive.value = false
}
const selectedSort = (item: any) => {
  console.log('changeSort', item);

  currentSortData.value = item.cateName
  filterSortActive.value = false
  emits('selectSort', item._id)
}
</script>

<template>
  <view class="filter-list">
    <!--   行程   -->
    <view class="filter-item" @tap="handleFilterCate">
      <!--   当前所选值   -->
      <view class="cate-label">
        <text v-if="isIcon" class="iconfont icon-address cate-icon"></text>
        <text>{{ currentCateData }}</text>
      </view>
      <text v-show="!filterCateActive" class="iconfont icon-laxiatubiao"
        style="font-size: 16rpx; color: #0b0a0a"></text>
      <text v-show="filterCateActive" class="iconfont icon-xiangshangtubiao"
        style="font-size: 16rpx; color: #0b0a0a"></text>
    </view>
    <!--   排序   -->
    <view class="filter-item" @tap="handleFilterSort">
      <!--   当前所选值   -->
      <view class="text">{{ currentSortData }}</view>
      <text v-show="!filterSortActive" class="iconfont icon-laxiatubiao"
        style="font-size: 16rpx; color: #0b0a0a"></text>
      <text v-show="filterSortActive" class="iconfont icon-xiangshangtubiao"
        style="font-size: 16rpx; color: #0b0a0a"></text>
    </view>
  </view>
  <!--  分类弹框容器   -->
  <view class="dropdown-wrapper" v-if="filterCateActive">
    <view class="filterCate">
      <view class="cate" :class="{ active: item.name === currentCateData }" v-for="item in cateData" :key="item._id"
        @tap="selectedCate(item)">{{ item.name }}</view>
    </view>
    <!-- 遮罩层（只在弹框下方） -->
    <view class="mask" @tap="filterCateActive = false"></view>
  </view>

  <!--  排序弹框容器   -->
  <view class="dropdown-wrapper" v-if="filterSortActive">
    <view class="filterSort">
      <view class="sort-item" :class="{ active: item.cateName === currentSortData }" v-for="item in sortData"
        :key="item._id" @tap="selectedSort(item)">{{ item.cateName }}</view>
    </view>
    <!-- 遮罩层（只在弹框下方） -->
    <view class="mask" @tap="filterSortActive = false"></view>
  </view>
</template>

<style scoped lang="scss">
.filter-list {
  padding: 0 24rpx;
  display: flex;
  gap: 40rpx;

  .filter-item {
    margin-right: 40rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 28rpx;
    color: $qs-font-title;

    .cate-label {
      display: flex;
      align-items: center;

      .cate-icon {
        margin-right: 8rpx;
        font-weight: bold;
      }
    }
  }
}

/* 下拉容器 */
.dropdown-wrapper {
  position: relative;
  padding-bottom: 20rpx;
}

/* 分类下拉 */
.filterCate {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40rpx;
  padding: 24rpx;
  z-index: 999;

  .cate {
    font-size: 28rpx;
    color: $qs-font-title;

    &.active {
      color: #ff3b3b;
    }
  }
}

/* 排序下拉 */
.filterSort {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  padding: 24rpx;
  z-index: 999;

  .sort-item {
    font-size: 28rpx;
    color: $qs-font-title;

    &.active {
      color: #ff3b3b;
    }
  }
}

/* 遮罩层（只覆盖弹框下方区域） */
.mask {
  position: absolute;
  left: -24rpx;
  right: -24rpx;
  top: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
</style>
