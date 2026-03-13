<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { ref } from 'vue'
import { formatTimestamp, generateMonthOptions, getCurrentMonth } from '@/utils/generateMonth.ts'
import NavHead from '@/components/NavHead.vue'
import { onLoad } from '@dcloudio/uni-app'
import { friendDetailOrderApi } from '@/api/friend'
import type { UserItem } from '@/types/UserItem'
import type { OrderItem } from '@/types/OrderItem'
import { formatFieldValue } from '@/utils/formatField'

// ========== 页面状态（来自路由或接口） ==========
const userId = ref('')
const totalConsumption = ref(0) // 个人消费金额，来自上一页传参
const totalCount = ref(0) // 已核销金额/次数，来自上一页传参
const userInfo = ref<UserItem>() // 好友用户信息，首次请求时从接口获取
const friendData = ref<OrderItem[]>([]) // 好友消费订单列表

// ========== 分页与加载状态 ==========
const pageNum = ref(1)
const pageSize = ref(10)
const finish = ref(false) // 是否已加载完所有页

/** 获取好友详情订单列表（按月份分页） */
const friendOrderGet = async (userId: string, time: string) => {
  if (finish.value) return
  const res = await friendDetailOrderApi(userId, time, pageNum.value, pageSize.value)
  console.log(res)
  if (!userInfo.value) {
    userInfo.value = res.data.userInfo
  }
  friendData.value.push(...res.data.list)
  totalCount.value = res.data.total
  if (pageNum.value < res.data.totalPage) {
    pageNum.value++
  } else {
    finish.value = true
  }
}

// ========== 生命周期：页面加载 ==========
onLoad((options) => {
  console.log(options)
  if (options) {
    userId.value = options.userId ?? ''
    totalConsumption.value = Number(options.totalConsumption) || 0
  }
  friendOrderGet(userId.value, selectedMonth.value)
})

// ========== 月份选择 ==========
const selectedMonth = ref(getCurrentMonth())
const range = ref(generateMonthOptions())

/** 切换月份时重置分页并重新请求 */
const change = (value: any) => {
  pageNum.value = 1
  finish.value = false
  friendData.value = []
  selectedMonth.value = value
  console.log('选择的月份', selectedMonth.value)
  friendOrderGet(userId.value, selectedMonth.value)
}

// ========== 消费明细展示配置 ==========
/** 字段配置，key 支持点路径（如 productInfo.title） */
const fields: { label: string; key: string }[] = [
  { label: '产品金额', key: 'totalAmount' },
  { label: '下单时间', key: 'createdAt' },
  { label: '产品名称', key: 'productInfo.title' },
  { label: '订单编号', key: 'out_trade_no' },
]


</script>
<template>
  <view class="friendDetail">
    <NavHead title="好友详情" :show-back="true"></NavHead>

    <!-- 区域1：好友用户信息（头像、昵称、注册时间） -->
    <view class="userInfo">
      <!-- 头像  -->
      <view class="avatar">
        <image :src="userInfo?.avatarUrl" mode="aspectFit">
        </image>
      </view>
      <!-- 信息  -->
      <view class="info">
        <view class="nickname">{{ userInfo?.nickname }}</view>
        <view class="registerTime">注册时间：{{ formatTimestamp(userInfo?.registerTime, 2) }}</view>
      </view>
    </view>

    <!-- 区域2：统计卡片（个人消费、已核销金额，数据来自路由传参） -->
    <view class="nav">
      <!-- 个人消费 -->
      <view class="nav-item">
        <image style="width: 94rpx; height: 102rpx" class="img"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/frirend/moneyBag.png" mode="aspectFit">
        </image>
        <view class="text">
          <view class="label">个人消费</view>
          <view class="value">{{ totalConsumption.toFixed(2) }}</view>
        </view>
      </view>
      <!-- 已核销金额 -->
      <view class="nav-item">
        <image class="img" style="width: 85rpx; height: 109rpx"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/frirend/hexiao.png" mode="aspectFit">
        </image>
        <view class="text">
          <view class="label">已核销订单</view>
          <view class="value">{{ totalCount }}</view>
        </view>
      </view>
    </view>

    <!-- 区域3：消费明细（按月份筛选订单列表） -->
    <view class="consumptionDetails">
      <NavTitle title="消费明细"> </NavTitle>
      <!-- 月份选择器 -->
      <view class="my-select">
        <uni-data-select v-model="selectedMonth" :localdata="range" hideRight @change="change"></uni-data-select>
      </view>
      <!-- 订单明细列表 / 空状态 -->
      <scroll-view class="list" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
        <template v-if="friendData.length">
          <view class="item" v-for="(item, index) in friendData" :key="index">
            <view class="row" v-for="field in fields" :key="field.key">
              <view class="label">{{ field.label }}</view>
              <view class="value">{{ formatFieldValue(field, item) }}</view>
            </view>
          </view>
        </template>
        <!-- 无数据时展示 -->
        <view v-else class="empty">
          <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
            mode="widthFix"></image>
          <text class="empty-text">暂无数据</text>
        </view>
        <view style="height: 40rpx;"></view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.friendDetail {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

/* 区域1：用户信息 */
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

/* 区域2：统计卡片 */
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

/* 区域3：消费明细 */
.consumptionDetails {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  margin-top: 20rpx;
  width: 100%;
  flex: 1;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 30rpx;

  .my-select {
    margin-top: 18rpx;
    @include customSelected();
  }

  /* 明细列表 / 空状态 */
  .list {
    flex: 1;
    margin-top: 20rpx;
    width: 100%;

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: calc(100% - 40rpx);

      .empty-img {
        width: 480rpx;
      }

      .empty-text {
        margin-top: 24rpx;
        font-size: 28rpx;
        color: $qs-font-dec;
      }
    }

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
