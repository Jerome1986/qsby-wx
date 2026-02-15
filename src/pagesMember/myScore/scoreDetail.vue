<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import Record from '@/components/Record.vue'
import { fieldsIncome, fieldsOut, listDataIncome, listDataOut } from './dataConfig.ts'

// 当前激活的标签索引（0: 收入积分, 1: 支出积分）
const activeIndex = ref('income')

// 切换标签
const switchTag = (val: string) => {
  activeIndex.value = val
}

// 默认选择当前月份
const selectedMonth = ref(getCurrentMonth())

const range = ref(generateMonthOptions())
const change = (value: any) => {
  selectedMonth.value = value
  console.log('选择的月份', selectedMonth.value)
}

// 触底
const handleScrollIncome = () => {
  console.log('触底')
}
</script>
<template>
  <view class="scoreDetail">
    <NavHead title="积分明细" :show-back="true"> </NavHead>
    <view class="content">
      <!--  标签  -->
      <view class="tag">
        <view
          class="tag-item"
          :class="{ 'active-item': activeIndex === 'income' }"
          @tap="switchTag('income')"
          >收入积分</view
        >
        <view
          class="tag-item"
          :class="{ 'active-item': activeIndex === 'out' }"
          @tap="switchTag('out')"
          >支出积分</view
        >
      </view>
      <!-- 日期选择  -->
      <view class="my-select">
        <uni-data-select
          v-model="selectedMonth"
          :localdata="range"
          hideRight
          @change="change"
        ></uni-data-select>
      </view>
      <!-- 收入积分  -->
      <template v-if="activeIndex === 'income'">
        <scroll-view
          class="record"
          :scroll-y="true"
          @scrolltolower="handleScrollIncome"
          :enhanced="true"
          :show-scrollbar="false"
        >
          <Record :list-data="listDataIncome" :fields="fieldsIncome"></Record>
        </scroll-view>
      </template>
      <!-- 支出积分  -->
      <template v-if="activeIndex === 'out'">
        <scroll-view
          class="outRecord"
          :scroll-y="true"
          @scrolltolower="handleScrollIncome"
          :enhanced="true"
          :show-scrollbar="false"
        >
          <Record :list-data="listDataOut" :fields="fieldsOut" :show-title="true"></Record>
        </scroll-view>
      </template>
    </view>
  </view>
</template>

<style scoped lang="scss">
.scoreDetail {
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}
.content {
  display: flex;
  flex-direction: column;
  padding: 0 24rpx;
  height: 85%;

  .tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tag-item {
      text-align: center;
      width: 295rpx;
      height: 69rpx;
      line-height: 69rpx;
      background: #ffffff;
      border-radius: 34rpx;
      font-size: 24rpx;
      font-weight: bold;
      color: #1a1a1a;
    }
    .active-item {
      background-color: $qs-brandColor;
    }
  }
  /*日期选择*/
  .my-select {
    width: 100%;
    margin: 20rpx 0;
    @include customSelected();
  }
  .record {
    flex: 1;
  }
  .outRecord {
    flex: 1;
  }
}
</style>
