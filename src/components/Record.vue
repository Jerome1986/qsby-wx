<script setup lang="ts">
defineProps<{
  listData: any
  fields: any
  showTitle?: boolean // 是否显示标题样式（第一行加粗）
}>()
</script>

<template>
  <view
    class="item"
    :class="{ 'title-mode': showTitle }"
    v-for="(item, index) in listData"
    :key="index"
  >
    <view
      class="row"
      v-for="(field, fieldIndex) in fields"
      :key="field.key"
      :class="{ 'row-title': showTitle && fieldIndex === 0 }"
    >
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
  @include customShadow();
  &:last-of-type {
    margin-bottom: 0;
    box-shadow: none;
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

    /* 标题行样式（第一行加粗） */
    &.row-title {
      .label,
      .value {
        font-weight: bold;
        color: #0b0a0a;
      }
    }
  }

  /* showTitle 模式下，非标题行的 value 颜色 */
  &.title-mode {
    .row:not(.row-title) {
      .value {
        color: $qs-font-dec2;
      }
    }
  }
}
</style>
