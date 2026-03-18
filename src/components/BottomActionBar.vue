<script setup lang="ts">
const props = defineProps<{
  pageType: string
  price?: number
  productId?: string
}>()
// 立即兑换
const exchange = () => {
  uni.navigateTo({
    url: '/pagesMember/myScore/exchange',
  })
}

// 立即购买
const buy = () => {
  console.log('立即购买')
  uni.navigateTo({
    url: `/pages/shop/createOrder?productId=${props.productId}`,
  })
}
</script>

<template>
  <view class="action-bar">
    <view class="action-tools">
      <!--
      隐藏的客服按钮：<button id="contactBtn" open-type="contact" class="contact-btn-hidden" />，通过样式隐藏且不占位。
      用 label 做展示：<label class="action-tool-item" for="contactBtn"> 负责图标和文案，样式与「进群」一致。
      点击逻辑：点击 label 会触发关联的 button，从而唤起客服会话。
      -->
      <button id="contactBtn" open-type="contact" class="contact-btn-hidden" />
      <view class="action-tool-item">
        <text class="iconfont icon-erweima action-tool-icon"></text>
        <text class="action-tool-text">进群</text>
      </view>
      <label class="action-tool-item" for="contactBtn">
        <text class="iconfont icon-kefu action-tool-icon"></text>
        <text class="action-tool-text">客服</text>
      </label>
    </view>
    <view class="action-submit-btn" @tap="exchange" v-if="pageType === 'score'">立即兑换</view>
    <view class="action-submit-btn" @tap="buy" v-if="pageType === 'product'">立即购买(￥{{ price }})</view>
  </view>
</template>

<style scoped lang="scss">
/*底部操作栏*/
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx calc(20rpx + env(safe-area-inset-bottom));
  background: $qs-card-bg;
  border-top: 1rpx solid #f0f0f0;
  box-sizing: border-box;

  /* 工具按钮区域 */
  .action-tools {
    display: flex;
    gap: 40rpx;

    .contact-btn-hidden {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
      overflow: hidden;
    }

    .action-tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6rpx;

      .action-tool-icon {
        font-size: 50rpx;
        color: $qs-font-title;
      }

      .action-tool-text {
        font-size: 24rpx;
        color: $qs-font-title;
      }
    }
  }

  /* 提交按钮 */
  .action-submit-btn {
    flex: 1;
    max-width: 360rpx;
    margin-left: 40rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #1a1a1a;
    border-radius: 44rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #ffb034;
  }
}
</style>
