<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { ref } from 'vue'
import { generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import NoData from '@/components/NoData.vue'

// 消费明细数据类型
interface ConsumptionItem {
  buyerName: string
  amount: string
  orderTime: string
  productName: string
  orderNo: string
  commission: string
  [key: string]: string // 索引签名，允许用字符串索引
}

// 定义字段配置
const fields: { label: string; key: keyof ConsumptionItem }[] = [
  { label: '购买人', key: 'buyerName' },
  { label: '产品金额', key: 'amount' },
  { label: '下单时间', key: 'orderTime' },
  { label: '产品名称', key: 'productName' },
  { label: '订单编号', key: 'orderNo' },
  { label: '产品佣金', key: 'commission' },
]

// 列表数据（后期从接口获取）
const listData = ref<ConsumptionItem[]>([
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  {
    buyerName: '何**',
    amount: '4950.00',
    orderTime: '2026-2-08 17:16',
    productName: '12.27体验冬日里的庐山2天1晚',
    orderNo: 'OD_2025112700286605',
    commission: '100元',
  },
  // ... 更多数据
])

// 默认选择当前月份
const selectedMonth = ref(getCurrentMonth())

const range = ref(generateMonthOptions())
const change = (value: any) => {
  selectedMonth.value = value
  console.log('选择的月份', selectedMonth.value)
}
</script>
<template>
  <view class="friendDetail">
    <!--  用户信息  -->
    <view class="userInfo">
      <!-- 头像  -->
      <view class="avatar">
        <image
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testAvatar/jerome.jpg"
          mode="aspectFit"
        ></image>
      </view>
      <!-- 信息  -->
      <view class="info">
        <view class="nickname">何无念</view>
        <view class="registerTime">注册时间：2022-12-09</view>
      </view>
    </view>
    <!--  个人消费/核销记录  -->
    <view class="nav">
      <!-- 个人消费/  -->
      <view class="nav-item">
        <image
          style="width: 94rpx; height: 102rpx"
          class="img"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/friendDetail/moneyBag.png"
          mode="aspectFit"
        ></image>
        <view class="text">
          <view class="label">个人消费</view>
          <view class="value">2.00</view>
        </view>
      </view>
      <!-- 核销记录  -->
      <view class="nav-item">
        <image
          class="img"
          style="width: 85rpx; height: 109rpx"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/friendDetail/hexiao.png"
          mode="aspectFit"
        ></image>
        <view class="text">
          <view class="label">已核销金额</view>
          <view class="value">20.00</view>
        </view>
      </view>
    </view>
    <!-- 没数据  -->
    <view class="consumptionDetails" v-if="false">
      <NavTitle title="消费明细"> </NavTitle>
      <NoData
        image-url="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/friendDetail/noData.png"
        tips="这里啥也没有，去探索未知的新世界吧"
      ></NoData>
    </view>

    <!--  明细消费  -->
    <view class="consumptionDetails" v-else>
      <NavTitle title="消费明细"> </NavTitle>
      <!-- 日期选择  -->
      <view class="my-select">
        <uni-data-select
          v-model="selectedMonth"
          :localdata="range"
          hideRight
          @change="change"
        ></uni-data-select>
      </view>
      <!--  明细列表  -->
      <scroll-view class="list" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
        <view class="item" v-for="(item, index) in listData" :key="index">
          <view class="row" v-for="field in fields" :key="field.key">
            <view class="label">{{ field.label }}</view>
            <view class="value">{{ item[field.key] }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.friendDetail {
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}
/*用户信息*/
.userInfo {
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  .avatar {
    width: 111rpx;
    height: 111rpx;
    border-radius: 50%;
    overflow: hidden;
  }
  .info {
    margin-left: 20rpx;
    .nickname {
      font-weight: bold;
      font-size: 36rpx;
      color: $qs-font-title;
    }
    .registerTime {
      margin-top: 8rpx;
      font-size: 24rpx;
      color: $qs-font-dec;
    }
  }
}

/*导航功能-个人消费、核销金额*/
.nav {
  display: flex;
  gap: 24rpx;
  height: 188rpx;
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 33rpx;
    height: 100%;
    background: #fffae6;
    border-radius: 30rpx;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    .img {
      overflow: hidden;
    }
    .text {
      flex: 1;
      text-align: end;
      font-weight: bold;
      .label {
        font-size: 28rpx;
        color: $qs-font-title;
        @include ellipsis(1);
      }
      .value {
        margin-top: 20rpx;
        font-size: 40rpx;
      }
    }
  }
}
/*消费明细*/
.consumptionDetails {
  padding: 28rpx;
  margin-top: 20rpx;
  width: 100%;
  height: calc(100% - 188rpx - 111rpx - 50rpx);
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 30rpx;
  .my-select {
    margin-top: 18rpx;
    @include customSelected();
  }

  /*明细列表*/
  .list {
    margin-top: 20rpx;
    width: 100%;
    /*
     * 高度计算：
     * 100% - 上padding(28rpx) - NavTitle(40rpx) - my-select(18rpx+38rpx)
     *      - list的margin-top(20rpx)
     * = 100% - 144rpx
     */
    height: calc(100% - 144rpx);
    .item {
      padding: 24rpx;
      margin-bottom: 20rpx;
      background: #f6f6f6;
      border-radius: 30rpx;
      &:last-of-type {
        margin-bottom: 0;
      }
      .row {
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        &:last-of-type {
          margin-bottom: 0;
        }

        .label {
          color: $qs-font-dec2;
        }
        .value {
          color: $qs-font-title;
        }
      }
    }
  }
}
</style>
