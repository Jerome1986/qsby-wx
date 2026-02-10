<script setup lang="ts">
defineProps<{
  listData: any
  fields: any
}>()
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
