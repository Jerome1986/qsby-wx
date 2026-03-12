<script setup lang="ts">
import type { CashWithdrawItem, CashWithdrawStatus } from '@/types/Cash'
import { formatTimestamp } from '@/utils/generateMonth'

const props = withDefaults(defineProps<{
  withdrawListData: CashWithdrawItem[]
}>(), {
  withdrawListData: () => []
})

const statusMap: Record<CashWithdrawStatus, { text: string; class: string }> = {
  approved: { text: '成功', class: 'status-success' },
  rejected: { text: '拒绝', class: 'status-rejected' },
  pending: { text: '待审核', class: 'status-pending' },
}

const getStatus = (status: CashWithdrawStatus) => statusMap[status] ?? statusMap.pending
</script>

<template>
  <template v-if="withdrawListData.length">
    <view class="list" v-for="item in withdrawListData" :key="item._id">
      <view class="image">
        <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cash/hongbao.png" mode="aspectFit">
        </image>
      </view>
      <view class="right">
        <view class="title">
          <view class="orderNo">
            <text>提现 -</text>
            <text :class="getStatus(item.status).class">{{ getStatus(item.status).text }}</text>
            <view v-if="item.remark" class="remark">{{ item.remark }}</view>
          </view>
          <view class="amount">-{{ item.amount }}</view>
        </view>
        <view class="content">
          <view class="balance">余额：{{ item.balance }}</view>
          <view class="time">{{ formatTimestamp(item.createdAt, 2) }}</view>
        </view>
      </view>
    </view>
  </template>
  <view v-else class="empty">
    <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
      mode="widthFix"></image>
    <text class="empty-text">暂无数据</text>
  </view>
  <view style="height: 40rpx;"></view>
</template>

<style scoped lang="scss">
/*提现记录*/

.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 30rpx;
  height: 166rpx;
  background: #ffffff;
  border-radius: 30rpx;
  @include customShadow();

  &:last-of-type {
    margin-bottom: 0;
  }

  .image {
    flex-shrink: 0;
    margin-right: 20rpx;
    width: 85rpx;
    height: 83rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .right {
    flex: 1;
    min-width: 0;

    .title {
      margin-bottom: 10rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 0;
      font-size: 30rpx;
      color: #0b0a0a;

      .orderNo .status-success {
        color: #07c160;
      }

      .orderNo .status-rejected {
        color: #ff3b3b;
      }

      .orderNo .status-pending {
        color: #919191;
      }

      .orderNo {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      .orderNo .remark {
        flex: 1;
        min-width: 0;
        display: block;
        font-size: 24rpx;
        color: #919191;
        margin-left: 8rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .amount {
        flex-shrink: 0;
        flex-grow: 0;
        min-width: 120rpx;
        margin-left: 16rpx;
        text-align: right;
      }
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 0;
      font-size: 24rpx;
      color: #919191;

      .balance {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        flex-shrink: 0;
        margin-left: 16rpx;
      }
    }
  }
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
