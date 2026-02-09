<script setup lang="ts">
import { ref } from 'vue'
import { generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import CashRecord from '@/pagesMember/myWallet/components/CashRecord.vue'
import IncomeRecord from '@/pagesMember/myWallet/components/IncomeRecord.vue'

// 当前激活的tab
const activeTab = ref('cash')
// tab
const tabList = [
  { label: '提现记录', value: 'cash' },
  { label: '收入记录', value: 'income' },
]

// 处理TAB点击
const handleTab = (tab: string) => {
  activeTab.value = tab
}

// 默认选择当前月份
const selectedMonth = ref(getCurrentMonth())

const range = ref(generateMonthOptions())
const change = (value: any) => {
  selectedMonth.value = value
  console.log('选择的月份', selectedMonth.value)
}

const handleBalance = () => {
  uni.navigateTo({
    url: '/pagesMember/myWallet/applyForCash ',
  })
}
</script>
<template>
  <view class="myWallet">
    <!--  金额信息  -->
    <view class="userMoney">
      <view class="top">
        <view class="user">
          <image
            class="avatar"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testAvatar/jerome.jpg"
            mode="aspectFit"
          ></image>
          <view class="nickname">何五年</view>
        </view>
        <view class="money">￥1888.00</view>
      </view>
      <!--  底部体现按钮  -->
      <view class="bottom">
        <view class="label">可提现金额 (元)</view>
        <view class="btn" @tap="handleBalance">去提现</view>
      </view>
    </view>
    <!--  切换TAB  -->
    <view class="tap">
      <view
        class="item"
        :class="{ activeItem: activeTab === item.value }"
        v-for="(item, index) in tabList"
        :key="index"
        @tap="handleTab(item.value)"
        >{{ item.label }}</view
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
    <!--  提现记录  -->
    <scroll-view
      v-if="activeTab === 'cash'"
      class="scroll-view"
      :scroll-y="true"
      :enhanced="true"
      :show-scrollbar="false"
    >
      <CashRecord></CashRecord>
    </scroll-view>

    <!--  收入记录  -->
    <scroll-view
      v-if="activeTab === 'income'"
      class="scroll-view"
      :scroll-y="true"
      :enhanced="true"
      :show-scrollbar="false"
    >
      <IncomeRecord></IncomeRecord>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.myWallet {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
  /*用户汇总区域*/
  .userMoney {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40rpx;
    height: 342rpx;
    background-image: url('https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/myWallet/bg.png');
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
        color: #ffda00;
        background-color: #121313;
      }
    }
  }
  /*tab*/
  .tap {
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
    width: 100%;
    margin: 20rpx 0;
    @include customSelected();
  }
  .scroll-view {
    flex: 1;
  }
}
</style>
