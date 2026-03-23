<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import Record from '@/components/Record.vue'
import { fieldsIncome, fieldsOut } from './dataConfig.ts'
import { scoreFlowFindAll } from '@/api/score'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

// 当前激活的标签（income: 收入积分, expense: 支出积分）
const activeIndex = ref<'income' | 'expense'>('income')

// 切换标签
const switchTag = (val: 'income' | 'expense') => {
  activeIndex.value = val
}

// 默认选择当前月份
const selectedMonth = ref(getCurrentMonth())
const range = ref(generateMonthOptions())

const change = (value: string | number) => {
  selectedMonth.value = String(value)
}

// 列表数据（收入、支出共用结构）
const listData = ref<Record<string, string>[]>([])
const pageNum = ref(1)
const pageSize = 10
const finish = ref(false)
const loading = ref(false)

const fetchList = async (reset = false) => {
  const userId = userStore.profile?._id
  if (!userId) {
    uni.showToast({ icon: 'none', title: '请先登录' })
    return
  }
  if (reset) {
    pageNum.value = 1
    finish.value = false
    listData.value = []
  }
  if (finish.value || loading.value) return

  loading.value = true
  try {
    const res = await scoreFlowFindAll(
      activeIndex.value,
      selectedMonth.value,
      userId,
      pageNum.value,
      pageSize,
    )
    const items = res.data?.list ?? []
    if (reset) {
      listData.value = items
    } else {
      listData.value.push(...items)
    }
    if (pageNum.value >= (res.data?.totalPage ?? 1)) {
      finish.value = true
    } else {
      pageNum.value++
    }
  } catch {
    uni.showToast({ icon: 'none', title: '获取明细失败' })
  } finally {
    loading.value = false
  }
}

// 触底加载更多
const handleScrollToLower = () => {
  fetchList(false)
}

// 月份或标签切换时重新拉取
watch([activeIndex, selectedMonth], () => fetchList(true), { immediate: false })

onLoad(() => {
  fetchList(true)
})
</script>
<template>
  <view class="scoreDetail">
    <NavHead title="积分明细" :show-back="true"> </NavHead>
    <view class="content">
      <!--  标签  -->
      <view class="tag">
        <view class="tag-item" :class="{ 'active-item': activeIndex === 'income' }" @tap="switchTag('income')">收入积分
        </view>
        <view class="tag-item" :class="{ 'active-item': activeIndex === 'expense' }" @tap="switchTag('expense')">支出积分
        </view>
      </view>
      <!-- 日期选择  -->
      <view class="my-select">
        <uni-data-select v-model="selectedMonth" :localdata="range" hideRight @change="change"></uni-data-select>
      </view>
      <!-- 收入积分  -->
      <template v-if="activeIndex === 'income'">
        <scroll-view class="record" :scroll-y="true" @scrolltolower="handleScrollToLower" :enhanced="true"
          :show-scrollbar="false">
          <view style="padding: 0 24rpx;">
            <Record :list-data="listData" :fields="fieldsIncome"></Record>
            <view v-if="loading && listData.length" class="loading-tip">加载中...</view>
            <view v-else-if="finish && !listData.length" class="empty-tip">暂无收入记录</view>
          </view>
          <view style="height: 20rpx;"></view>
        </scroll-view>
      </template>
      <!-- 支出积分  -->
      <template v-if="activeIndex === 'expense'">
        <scroll-view class="outRecord" :scroll-y="true" @scrolltolower="handleScrollToLower" :enhanced="true"
          :show-scrollbar="false">
          <view style="padding: 0 24rpx;">
            <Record :list-data="listData" :fields="fieldsOut" :show-title="true"></Record>
            <view v-if="loading && listData.length" class="loading-tip">加载中...</view>
            <view v-else-if="finish && !listData.length" class="empty-tip">暂无支出记录</view>
          </view>
          <view style="height: 20rpx;"></view>
        </scroll-view>
      </template>
    </view>
  </view>
</template>

<style scoped lang="scss">
.scoreDetail {
  height: 100%;
  @include page-background();
}

.content {
  display: flex;
  flex-direction: column;
  height: 85%;

  .tag {
    margin-top: 24rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tag-item {
      text-align: center;
      width: 295rpx;
      height: 69rpx;
      line-height: 69rpx;
      background: $qs-card-bg;
      border-radius: 34rpx;
      font-size: 24rpx;
      font-weight: bold;
      color: $qs-font-title;
    }

    .active-item {
      background-color: $qs-brandColor;
    }
  }

  /*日期选择*/
  .my-select {
    width: 100%;
    margin: 20rpx;
    @include customSelected();
  }

  .record {
    flex: 1;
  }

  .outRecord {
    flex: 1;
  }

  .loading-tip,
  .empty-tip {
    padding: 40rpx 0;
    text-align: center;
    font-size: 26rpx;
    color: $qs-font-dec;
  }
}
</style>
