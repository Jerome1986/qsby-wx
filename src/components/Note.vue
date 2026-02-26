<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'

// 预约须知数据（后续从接口获取）
const noteList = [
  {
    title: '入住时间说明',
    content:
      '入住时间为当日14:00以后，退房时间为次日12:00前。如需提前入住或延迟退房，请提前联系前台确认，视当日房态安排，可能产生额外费用。',
  },
  {
    title: '预订与取消政策',
    content:
      '预订成功后请按时入住。入住前24小时内取消或未按时到店，酒店有权按订单金额收取相应费用，具体以订单页面显示为准。',
  },
]
</script>

<template>
  <view class="note">
    <NavTitle title="预约须知"></NavTitle>
    <view class="note-list">
      <view class="note-item" v-for="(item, index) in noteList" :key="index">
        <view class="note-title">{{ index + 1 }}. {{ item.title }}</view>
        <view class="note-content">{{ item.content }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/*预约须知*/
.note {
  padding: 39rpx 37rpx;
  margin-top: 20rpx;
  background: #ffffff;
  border-radius: 20rpx;
  @include customShadow();

  .note-list {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 30rpx;

    .note-item {
      .note-title {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        margin-bottom: 12rpx;
      }
      .note-content {
        font-size: 24rpx;
        color: $qs-font-dec;
        line-height: 1.6;
        text-align: justify;
      }
    }
  }
}
</style>
