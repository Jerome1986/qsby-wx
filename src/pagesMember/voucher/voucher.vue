<script setup lang="ts">
import Card from './components/Card.vue'
import NavTitle from '@/components/NavTitle.vue'
import Table from './components/Table.vue'
import NavHead from '@/components/NavHead.vue'
import { useUserStore } from '@/stores'
import { filterVoucherFlow } from '@/api/voucher'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { VoucherBill } from '@/types/UserBalanceFlow'
import { getCurrentMonth } from '@/utils/generateMonth'

// store
const userStore = useUserStore()
const currentVoucher = ref<VoucherBill>()  // 当前年月
const historyVoucher = ref<VoucherBill[]>([]) // 最近半年历史代金券账单
// 获取半年代金券流水
const voucherBillGet = async (userId: string) => {
  const res = await filterVoucherFlow(userId)
  console.log(res)
  const currentTime = getCurrentMonth()
  console.log(currentTime)

  //当前年月代金券使用流水明细
  currentVoucher.value = res.data.find(item => item.month === currentTime)
  //最近半年代金券使用流水明细
  historyVoucher.value = res.data.filter(item => item.month !== currentTime)
}

onLoad(async () => {
  if (userStore.profile?._id) {
    await voucherBillGet(userStore.profile._id)
  }
})

const goDetail = () => {
  uni.navigateTo({
    url: '/pagesMember/voucher/voucherDetail',
  })
}
</script>
<template>
  <view class="voucher">
    <NavHead title="代金券" :show-back="true"></NavHead>
    <!--  代金券卡片信息  -->
    <Card :current-data="currentVoucher"></Card>
    <!--  title    -->
    <view class="title">
      <NavTitle title="代金券"></NavTitle>
      <view class="dec" @tap="goDetail">查看明细</view>
    </view>
    <!--  月份汇总列表--只显示最近半年   -->
    <view class="list">
      <!--  汇总表格组件  -->
      <Table :historyVoucher="historyVoucher"></Table>
    </view>
  </view>
</template>

<style scoped lang="scss">
.voucher {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

.title {
  margin: 30rpx 0;
  display: flex;
  justify-content: space-between;

  .dec {
    padding: 8rpx 16rpx;
    text-align: center;
    background: $qs-brandColor;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: $qs-font-title;
  }
}

.list {
  position: relative;
  flex: 1;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}
</style>
