<script setup lang="ts">
import { ref } from 'vue'
import { formatTimestamp, generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import CashRecord from '@/pagesMember/myWallet/components/CashRecord.vue'
import NavHead from '@/components/NavHead.vue'
import { useUserStore } from '@/stores/index.ts'
import {
  cashWithdrawListApi,
  checkApplyForCash,
  incomeFlowListGetApi,
} from '@/api/myWallet.ts'
import { onLoad, onShow } from '@dcloudio/uni-app'
import type { CashWithdrawItem, Tab, TabList } from '@/types/Cash.js'
import type { UserBalanceFlow } from '@/types/UserBalanceFlow'
import { userInfoGet } from '@/composables/userInfo.ts'

const userStore = useUserStore()
const pageSize = 10

// 佣金收入：独立分页状态
const commissionIncomeListData = ref<UserBalanceFlow[]>([])
const commissionIncomePageNum = ref(1)
const commissionIncomeFinish = ref(false)
const commissionIncomeLoading = ref(false)
const commissionIncomeListGet = async (userId: string, time: string) => {
  if (!userId || commissionIncomeFinish.value || commissionIncomeLoading.value) return
  commissionIncomeLoading.value = true
  try {
    const res = await incomeFlowListGetApi(
      userId,
      time,
      'commission',
      commissionIncomePageNum.value,
      pageSize,
    )
    const list = res.data?.list ?? []
    commissionIncomeListData.value.push(...list)
    if (commissionIncomePageNum.value < (res.data?.totalPage ?? 0)) {
      commissionIncomePageNum.value++
    } else {
      commissionIncomeFinish.value = true
    }
  } finally {
    commissionIncomeLoading.value = false
  }
}

// 活动收入：独立分页状态
const activityIncomeListData = ref<UserBalanceFlow[]>([])
const activityIncomePageNum = ref(1)
const activityIncomeFinish = ref(false)
const activityIncomeLoading = ref(false)
const activityIncomeListGet = async (userId: string, time: string) => {
  if (!userId || activityIncomeFinish.value || activityIncomeLoading.value) return
  activityIncomeLoading.value = true
  try {
    const res = await incomeFlowListGetApi(
      userId,
      time,
      'activity',
      activityIncomePageNum.value,
      pageSize,
    )
    const list = res.data?.list ?? []
    activityIncomeListData.value.push(...list)
    if (activityIncomePageNum.value < (res.data?.totalPage ?? 0)) {
      activityIncomePageNum.value++
    } else {
      activityIncomeFinish.value = true
    }
  } finally {
    activityIncomeLoading.value = false
  }
}

// 提现记录：独立分页状态
const withdrawListData = ref<CashWithdrawItem[]>([])
const withdrawPageNum = ref(1)
const withdrawFinish = ref(false)
const withdrawLoading = ref(false)
const withdrawListGet = async (userId: string, time: string) => {
  if (!userId || withdrawFinish.value || withdrawLoading.value) return
  withdrawLoading.value = true
  try {
    const res = await cashWithdrawListApi(userId, time, withdrawPageNum.value, pageSize)
    const list = res.data?.list ?? []
    withdrawListData.value.push(...list)
    if (withdrawPageNum.value < (res.data?.totalPage ?? 0)) {
      withdrawPageNum.value++
    } else {
      withdrawFinish.value = true
    }
  } finally {
    withdrawLoading.value = false
  }
}

const activeTab = ref<Tab>('commission')
const tabList: TabList[] = [
  { label: '主理人佣金', value: 'commission' },
  { label: '活动收入', value: 'activityIncome' },
  { label: '提现记录', value: 'withdraw' },
]

type IncomeTab = Extract<Tab, 'commission' | 'activityIncome'>

interface IncomeRow {
  label: string
  value: string
  isAmount?: boolean
}

const incomeLabelMap: Record<IncomeTab, string> = {
  commission: '佣金收入',
  activityIncome: '活动收入',
}

const selectedMonth = ref(getCurrentMonth())
const range = ref(generateMonthOptions())

const getUserId = () => userStore.profile?._id ?? ''

const reset = (target: Tab) => {
  if (target === 'commission') {
    commissionIncomePageNum.value = 1
    commissionIncomeFinish.value = false
    commissionIncomeLoading.value = false
    commissionIncomeListData.value = []
  } else if (target === 'activityIncome') {
    activityIncomePageNum.value = 1
    activityIncomeFinish.value = false
    activityIncomeLoading.value = false
    activityIncomeListData.value = []
  } else {
    withdrawPageNum.value = 1
    withdrawFinish.value = false
    withdrawLoading.value = false
    withdrawListData.value = []
  }
}

/** 加载当前激活 tab 的数据 */
const loadActiveTabData = () => {
  const userId = getUserId()
  const time = selectedMonth.value
  if (activeTab.value === 'withdraw') {
    withdrawListGet(userId, time)
  } else if (activeTab.value === 'commission') {
    commissionIncomeListGet(userId, time)
  } else {
    activityIncomeListGet(userId, time)
  }
}

const handleTab = (tab: Tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  reset(tab)
  loadActiveTabData()
}

const change = (value: string | number) => {
  reset(activeTab.value)
  selectedMonth.value = String(value)
  loadActiveTabData()
}

onLoad(() => {
  loadActiveTabData()
})

onShow(() => {
  if (userStore.profile?._id) {
    userInfoGet(userStore.profile._id)
  }
})

const isApplyForCash = async (userId: string) => {
  const res = await checkApplyForCash(userId)
  return res.data.isApplyFor
}

const formatIncomeAmount = (amount?: number | string | null) => {
  const value = Number(amount || 0)
  return value.toFixed(2)
}

const formatOptionalMoney = (amount?: number | string | null) => {
  if (amount === undefined || amount === null || amount === '') return ''
  const value = Number(amount)
  return Number.isFinite(value) ? `￥${value.toFixed(2)}` : ''
}

const formatIncomeTime = (time?: string | Date) => {
  return time ? formatTimestamp(time, 2) : ''
}

const getIncomeRows = (item: UserBalanceFlow, incomeTab: IncomeTab): IncomeRow[] => {
  const rows: IncomeRow[] = [
    { label: '购买人', value: item.buyerName || '' },
    { label: '产品金额', value: formatOptionalMoney(item.totalAmount) },
    { label: '下单时间', value: formatIncomeTime(item.orderTime) },
    { label: '产品名称', value: item.productName || '' },
    { label: '订单编号', value: item.out_trade_no || '' },
    {
      label: incomeLabelMap[incomeTab],
      value: `￥${formatIncomeAmount(item.amount)}`,
      isAmount: true,
    },
  ]

  return rows.filter((row) => row.value)
}

// 处理提现跳转
const handleBalance = async () => {
  if (await isApplyForCash(getUserId())) {
    uni.showToast({ icon: 'none', title: '当前有提现在审核,不可重复申请' })
    return
  }
  // 符合条件就跳转
  uni.navigateTo({
    url: '/pagesMember/myWallet/applyForCash',
  })
}
</script>
<template>
  <view class="myWallet">
    <NavHead title="我的钱包" :show-back="true"></NavHead>
    <!--  金额信息  -->
    <view style="padding: 0 24rpx;">
      <view class="userMoney">
        <view class="top">
          <view class="user">
            <image class="avatar" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png"
              mode="aspectFit"></image>
            <view class="nickname">{{ userStore.profile?.nickname }}</view>
          </view>
          <view class="money">￥{{ userStore.profile?.balance }}</view>
        </view>
        <!--  底部体现按钮  -->
        <view class="bottom">
          <view class="label">可提现金额 (元)</view>
          <view class="btn" @tap="handleBalance">去提现</view>
        </view>
      </view>
    </view>
    <!--  切换TAB  -->
    <view class="tap">
      <view class="item" :class="{ activeItem: activeTab === item.value }" v-for="(item, index) in tabList" :key="index"
        @tap="handleTab(item.value)">{{ item.label }}</view>
    </view>
    <!-- 日期选择  -->
    <view class="my-select">
      <uni-data-select v-model="selectedMonth" :localdata="range" hideRight @change="change"></uni-data-select>
    </view>
    <!--  提现记录  -->
    <scroll-view v-show="activeTab === 'withdraw'" class="scroll-view" :scroll-y="true" :enhanced="true"
      :show-scrollbar="false" @scrolltolower="loadActiveTabData">
      <view style="padding: 0 24rpx;">
        <CashRecord :withdrawListData="withdrawListData"></CashRecord>
      </view>
    </scroll-view>

    <!--  佣金收入  -->
    <scroll-view v-show="activeTab === 'commission'" class="scroll-view" :scroll-y="true" :enhanced="true"
      :show-scrollbar="false" @scrolltolower="loadActiveTabData">
      <view style="padding:0 24rpx;">
        <view v-if="commissionIncomeListData.length" class="income-list">
          <view class="income-card" v-for="item in commissionIncomeListData" :key="item._id">
            <view class="income-row" :class="{ 'amount-row': row.isAmount }"
              v-for="row in getIncomeRows(item, 'commission')" :key="row.label">
              <view class="income-label">{{ row.label }}</view>
              <view class="income-value">{{ row.value }}</view>
            </view>
          </view>
          <view v-if="commissionIncomeLoading" class="loading-tip">加载中...</view>
        </view>
        <view v-else class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="widthFix"></image>
          <text class="empty-text">暂无数据</text>
        </view>
        <view style="height: 40rpx;"></view>
      </view>
    </scroll-view>

    <!--  活动收入  -->
    <scroll-view v-show="activeTab === 'activityIncome'" class="scroll-view" :scroll-y="true" :enhanced="true"
      :show-scrollbar="false" @scrolltolower="loadActiveTabData">
      <view style="padding:0 24rpx;">
        <view v-if="activityIncomeListData.length" class="income-list">
          <view class="income-card" v-for="item in activityIncomeListData" :key="item._id">
            <view class="income-row" :class="{ 'amount-row': row.isAmount }"
              v-for="row in getIncomeRows(item, 'activityIncome')" :key="row.label">
              <view class="income-label">{{ row.label }}</view>
              <view class="income-value">{{ row.value }}</view>
            </view>
          </view>
          <view v-if="activityIncomeLoading" class="loading-tip">加载中...</view>
        </view>
        <view v-else class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="widthFix"></image>
          <text class="empty-text">暂无数据</text>
        </view>
        <view style="height: 40rpx;"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.myWallet {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();

  /*用户汇总区域*/
  .userMoney {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40rpx;
    height: 342rpx;
    background-image: url('https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cash/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 30rpx;

    /*用户*/
    .top {

      .user {
        margin-bottom: 36rpx;
        display: flex;
        align-items: center;

        .avatar {
          width: 62rpx;
          height: 62rpx;
          border-radius: 50%;
          overflow: hidden;
        }

        .nickname {
          margin-left: 20rpx;
          color: $qs-font-title;
        }
      }

      .money {
        font-weight: bold;
        font-size: 46rpx;
        color: $qs-font-title;
      }
    }

    /*提现区域*/
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .label {
        font-size: 24rpx;
        color: $qs-font-title;
      }

      .btn {
        text-align: center;
        width: 170rpx;
        height: 48rpx;
        line-height: 48rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        color: $qs-brandColor;
        background-color: #121313;
      }
    }
  }

  /*tab*/
  .tap {
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60rpx;
    margin-top: 20rpx;
    width: 100%;
    height: 69rpx;

    .item {
      flex: 1;
      text-align: center;
      height: 100%;
      line-height: 69rpx;
      background: #ffffff;
      border-radius: 34rpx;
      font-size: 24rpx;
      font-weight: bold;
      color: #1a1a1a;
    }

    .activeItem {
      background-color: $qs-brandColor;
    }
  }

  /*日期选择*/
  .my-select {
    padding: 0 24rpx;
    width: 100%;
    margin: 20rpx 0;
    @include customSelected();
  }

  .scroll-view {
    flex: 1;

    .income-list {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
    }

    .income-card {
      padding: 24rpx;
      background: $qs-card-bg;
      border-radius: 30rpx;
      @include customShadow();

      .income-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 20rpx;
        font-size: 28rpx;

        &:last-of-type {
          margin-bottom: 0;
        }

        .income-label {
          flex-shrink: 0;
          color: $qs-font-dec2;
        }

        .income-value {
          flex: 1;
          min-width: 0;
          margin-left: 24rpx;
          text-align: right;
          color: $qs-font-title;
          word-break: break-all;
        }
      }

      .amount-row {

        .income-label {
          color: $qs-font-dec2;
        }

        .income-value {
          font-weight: bold;
          color: #ff3b3b;
        }
      }
    }

    .loading-tip {
      padding: 20rpx 0;
      text-align: center;
      font-size: 24rpx;
      color: $qs-font-dec;
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
  }
}
</style>
