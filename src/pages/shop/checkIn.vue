<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import UpdateFile from '@/components/UpdateFIle.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info'
import { checkInShopApi } from '@/api/store'
import { useUserStore } from '@/stores'

// 证件图片 URL
const icCardFont = ref('')
const icCardBack = ref('')
const orderId = ref('') // 注:业务订单号
const userStore = useUserStore()

const handleUpdate = (_type: string, url: string) => {
  if (_type === 'font') icCardFont.value = url
  else if (_type === 'back') icCardBack.value = url
}

// 提交入住
const handleSubmit = () => {
  if (!icCardFont.value) {
    uni.showToast({ icon: 'none', title: '请上传身份证正面' })
    return
  }
  if (!icCardBack.value) {
    uni.showToast({ icon: 'none', title: '请上传身份证反面' })
    return
  }

  uni.showModal({
    title: '提示',
    content: '确定提交身份信息吗',
    confirmColor: '#eed261',
    success: async (confrim) => {
      if (confrim) {
        // 调用入住接口，上传证件图片
        const res = await checkInShopApi(
          userStore.profile?._id as string,
          orderId.value,
          icCardFont.value,
          icCardBack.value,
        )
        if (res.code === 200) {
          uni.showToast({ icon: 'success', title: '提交成功' })
          setTimeout(() => {
            uni.navigateBack()
          }, 800)
        }
      }
    },
  })
}

onLoad((options) => {
  console.log('办理入住参数', options)

  orderId.value = options?.orderId
  getSafeAreaBottom()
})
</script>

<template>
  <view class="checkIn">
    <NavHead title="办理入住" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="content-inner">
        <!-- 入住须知 -->
        <view class="card notice-card">
          <view class="section-title">入住须知</view>
          <view class="notice-item">1. 请上传本人有效身份证正反面照片，确保信息清晰可辨。</view>
          <view class="notice-item">2. 证件信息仅用于入住登记，我们将严格保护您的隐私。</view>
          <view class="notice-item">3. 请确保所填信息真实有效，以便顺利办理入住。</view>
        </view>

        <!-- 证件上传 -->
        <view class="card upload-card">
          <UpdateFile :ic-card-font="icCardFont" :ic-card-back="icCardBack" @update="handleUpdate" />
        </view>

        <view class="scroll-bottom-placeholder"></view>
      </view>
    </scroll-view>

    <!-- 底部提交 -->
    <view class="footer-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="submit-btn" @tap="handleSubmit">提交入住</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.checkIn {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
}

.content-inner {
  padding: 24rpx;
}

.scroll-bottom-placeholder {
  height: 100rpx;
}

/* 通用卡片 */
.card {
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

/* 入住须知 */
.notice-card {
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 20rpx;
  }

  .notice-item {
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.8;
    margin-bottom: 8rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 证件上传卡片 */
.upload-card {
  :deep(.update) {
    margin-top: 0;
  }
}

/* 底部操作栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  background-color: $qs-card-bg;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
  width: 100%;
  max-width: 600rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: linear-gradient(135deg, $qs-brandColor 0%, #f7d11a 100%);
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: $qs-font-title;
  box-shadow: 0 4rpx 12rpx rgba($qs-brandColor, 0.4);
}
</style>
