<script setup lang="ts">
import { ref } from 'vue'
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
</script>

<template>
  <view class="item" v-for="(item, index) in listData" :key="index">
    <view class="row" v-for="field in fields" :key="field.key">
      <view class="label">{{ field.label }}</view>
      <view class="value">{{ item[field.key] }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*明细列表*/
.item {
  padding: 24rpx;
  margin-bottom: 20rpx;
  background: #ffffff;
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
</style>
