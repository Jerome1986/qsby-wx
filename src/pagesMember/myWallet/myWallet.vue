<script setup lang="ts">
import { ref } from 'vue'
import { generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import CashRecord from '@/pagesMember/myWallet/components/CashRecord.vue'
import Record from '@/components/Record.vue'
import { fields } from './dataCofing.ts'
import NavHead from '@/components/NavHead.vue'
import { useUserStore } from '@/stores/index.ts'
import { cashWithdrawListApi, checkApplyForCash, incomeListGetApi } from '@/api/myWallet.ts'
import { onLoad } from '@dcloudio/uni-app'
import type { OrderItem } from '@/types/OrderItem.js'
import type { CashWithdrawItem, Tab, TabList } from '@/types/Cash.js'

const userStore = useUserStore()
const pageSize = 10

// 收入记录：独立分页状态，避免与提现记录共享导致数据错乱
const listData = ref<OrderItem[]>([])
const incomePageNum = ref(1)
const incomeFinish = ref(false)
const incomeListGet = async (userId: string, time: string) => {
  if (incomeFinish.value) return
  const res = await incomeListGetApi(userId, time, incomePageNum.value, pageSize)
  listData.value.push(...res.data.list)
  if (incomePageNum.value < res.data.totalPage) {
    incomePageNum.value++
  } else {
    incomeFinish.value = true
  }
}

// 提现记录：独立分页状态
const withdrawListData = ref<CashWithdrawItem[]>([])
const withdrawPageNum = ref(1)
const withdrawFinish = ref(false)
const withdrawListGet = async (userId: string, time: string) => {
  if (withdrawFinish.value) return
  const res = await cashWithdrawListApi(userId, time, withdrawPageNum.value, pageSize)
  withdrawListData.value.push(...res.data.list)
  if (withdrawPageNum.value < res.data.totalPage) {
    withdrawPageNum.value++
  } else {
    withdrawFinish.value = true
  }
}

const getUserId = () => userStore.profile?._id as string

/** 加载当前激活 tab 的数据 */
const loadActiveTabData = () => {
  const userId = getUserId()
  const time = selectedMonth.value
  if (activeTab.value === 'income') {
    incomeListGet(userId, time)
  } else {
    withdrawListGet(userId, time)
  }
}

const activeTab = ref<Tab>('withdraw')
const tabList: TabList[] = [
  { label: '提现记录', value: 'withdraw' },
  { label: '收入记录', value: 'income' },
]

const selectedMonth = ref(getCurrentMonth())
const range = ref(generateMonthOptions())

const reset = (target: Tab) => {
  if (target === 'income') {
    incomePageNum.value = 1
    incomeFinish.value = false
    listData.value = []
  } else {
    withdrawPageNum.value = 1
    withdrawFinish.value = false
    withdrawListData.value = []
  }
}

const handleTab = (tab: Tab) => {
  activeTab.value = tab
  selectedMonth.value = getCurrentMonth()
}

const change = (value: string | number) => {
  reset(activeTab.value)
  selectedMonth.value = String(value)
  loadActiveTabData()
}

onLoad(() => {
  incomeListGet(getUserId(), selectedMonth.value)
  withdrawListGet(getUserId(), selectedMonth.value)
})

const isApplyForCash = async (userId: string) => {
  const res = await checkApplyForCash(userId)
  return res.data.isApplyFor
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
      :show-scrollbar="false">
      <view style="padding: 0 24rpx;">
        <CashRecord :withdrawListData="withdrawListData"></CashRecord>
      </view>
    </scroll-view>

    <!--  收入记录  -->
    <scroll-view v-show="activeTab === 'income'" class="scroll-view" :scroll-y="true" :enhanced="true"
      :show-scrollbar="false">
      <view style="padding:0 24rpx;">
        <Record v-if="listData.length" :fields="fields" :list-data="listData"></Record>
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
