<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { ref } from 'vue'
import { generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import Record from '@/components/Record.vue'
import { fields } from './dataConfig.ts'
import NavHead from '@/components/NavHead.vue'
import { useUserStore } from '@/stores/index.ts'
import { voucherOrderListGet } from '@/api/voucher.ts'
import type { OrderItem } from '@/types/OrderItem.js'
import { onLoad } from '@dcloudio/uni-app'

// store
const userStore = useUserStore()

// 默认选择当前月份
const selectedMonth = ref(getCurrentMonth())

const range = ref(generateMonthOptions())
const change = (value: any) => {
  pageNum.value = 1
  voucherOrderData.value = []
  finish.value = false
  selectedMonth.value = value
  console.log('选择的月份', selectedMonth.value)
  voucherOrderList(userStore.profile?._id as string, selectedMonth.value)
}

const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false)
const voucherOrderData = ref<OrderItem[]>([])
const voucherOrderList = async (userId: string, month: string) => {
  if (finish.value) return
  const requestMonth = month
  const res = await voucherOrderListGet(userId, requestMonth, pageNum.value, pageSize.value)
  console.log(res)

  // 若用户已切换月份，丢弃本次结果，避免竞态
  if (selectedMonth.value !== requestMonth) return

  voucherOrderData.value.push(...res.data.list)

  if (pageNum.value < res.data.totalPage) {
    pageNum.value++
  } else {
    finish.value = true
  }
}

onLoad(() => voucherOrderList(userStore.profile?._id as string, selectedMonth.value))



// 处理触底
const handleScroll = () => {
  if (finish.value) return
  console.log('触底了')
  voucherOrderList(userStore.profile?._id as string, selectedMonth.value)
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
      <uni-data-select v-model="selectedMonth" :localdata="range" hideRight @change="change"></uni-data-select>
    </view>
    <!--  代金券消费订单列表  -->
    <scroll-view class="list" :scroll-y="true" @scrolltolower="handleScroll" :enhanced="true" :show-scrollbar="false">
      <Record v-if="voucherOrderData.length" :list-data="voucherOrderData" :fields="fields"></Record>
      <view v-else class="empty">
        <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
          mode="widthFix"></image>
        <text class="empty-text">暂无数据</text>
      </view>
      <view style="height: 40rpx;"></view>
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

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;

  .empty-img {
    width: 480rpx;
  }

  .empty-text {
    margin-top: 24rpx;
    font-size: 28rpx;
    color: $qs-font-dec;
  }
}
</style>
