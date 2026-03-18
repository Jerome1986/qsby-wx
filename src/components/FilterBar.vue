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
const currentSortData = ref(props.sortData[0]?.cateName || '全部')
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
console.log('currentSortData', currentSortData.value);

</script>

<template>
  <view class="filter-wrapper">
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
    <!--  分类弹框 - 筛选下方弹出   -->
    <view class="dialog-overlay" v-if="filterCateActive">
      <view class="dialog-mask" @tap="filterCateActive = false"></view>
      <view class="dialog-box" @tap.stop>
        <view class="dialog-title">选择城市</view>
        <view class="dialog-options filterCate">
          <view class="option-item" :class="{ active: item.name === currentCateData }" v-for="item in cateData"
            :key="item._id" @tap="selectedCate(item)">{{ item.name }}</view>
        </view>
      </view>
    </view>

    <!--  排序弹框 - 筛选下方弹出   -->
    <view class="dialog-overlay" v-if="filterSortActive">
      <view class="dialog-mask" @tap="filterSortActive = false"></view>
      <view class="dialog-box" @tap.stop>
        <view class="dialog-title">选择类型</view>
        <view class="dialog-options filterSort">
          <view class="option-item" :class="{ active: item.cateName === currentSortData }" v-for="item in sortData"
            :key="item._id" @tap="selectedSort(item)">{{ item.cateName }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.filter-wrapper {
  position: relative;
}

.filter-list {
  padding: 0 24rpx;
  display: flex;
  gap: 40rpx;

  .filter-item {
    margin-right: 40rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: $qs-font-title;

    .cate-label {
      display: flex;
      align-items: center;

      .cate-icon {
        margin-right: 8rpx;
        font-weight: bold;
        font-size: 24rpx;
      }
    }
  }
}

/* 弹框容器 - 筛选下方 */
.dialog-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 999;
  padding-top: 16rpx;
}

/* 对话框 - 白色底色，紧贴筛选下方 */
.dialog-box {
  position: relative;
  z-index: 999;
  margin: 0 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
}

/* 全屏遮罩 - 弹框背后，点击关闭 */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
}

.dialog-title {
  font-size: 30rpx;
  font-weight: bold;
  color: $qs-font-title;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid $qs-border;
}

/* 选项区域 - 每个选项独立 */
.dialog-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  &.filterCate {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

.option-item {
  padding: 28rpx 32rpx;
  font-size: 28rpx;
  color: $qs-font-title;
  background-color: #f8f8f8;
  border-radius: 16rpx;
  text-align: center;
  border: 2rpx solid transparent;

  &.active {
    color: $qs-font-title;
    background-color: rgba($qs-brandColor, 0.2);
    border-color: $qs-brandColor;
    font-weight: 600;
  }
}

/* 排序为单列，每个选项独立一行 */
.filterSort .option-item {
  text-align: left;
}
</style>
