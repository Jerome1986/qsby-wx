<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { ref } from 'vue'
import { generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import Record from '@/components/Record.vue'
import { fields, listData } from './dataConfig.ts'
import NavHead from '@/components/NavHead.vue'

// 默认选择当前月份
const selectedMonth = ref(getCurrentMonth())

const range = ref(generateMonthOptions())
const change = (value: any) => {
  selectedMonth.value = value
  console.log('选择的月份', selectedMonth.value)
}

// 处理触底
const handleScroll = () => {
  console.log('触底了')
}
</script>
<template>
  <view class="detail">
    <NavHead title="代金券明细" :show-back="true"></NavHead>
    <view class="head">
      <NavTitle title="代金券明细"></NavTitle>
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
    <!--  代金券消费订单列表  -->
    <scroll-view
      class="list"
      :scroll-y="true"
      @scrolltolower="handleScroll"
      :enhanced="true"
      :show-scrollbar="false"
    >
      <Record :list-data="listData" :fields="fields"></Record>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.detail {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

/*日期选择*/
.my-select {
  width: 100%;
  margin: 20rpx 0;
  @include customSelected();
}

.list {
  flex: 1;
}
</style>
