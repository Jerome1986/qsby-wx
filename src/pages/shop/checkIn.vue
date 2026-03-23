<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import UpdateFile from '@/components/UpdateFIle.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { checkInExternalApi, checkInShopApi } from '@/api/store'
import { useUserStore } from '@/stores'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info'
import { vaildateMoible } from '@/utils/validateMobile'

// 证件图片 URL
const icCardFont = ref('')
const icCardBack = ref('')
const orderId = ref('') // 业务订单号（小程序订单）
const shopId = ref('') // 门店ID（抖音/外部订单）
const userStore = useUserStore()

/** 是否为外部/抖音订单（无 orderId，有 shopId） */
const isExternalFlow = () => !!shopId.value && !orderId.value

// 外部订单表单
const nickname = ref('')
const phone = ref('')
const roomNumber = ref('')
const source = ref<'douyin' | 'miniprogram' | 'offline' | ''>('')

const sourceColumns = [
  { value: 'douyin', label: '抖音' },
  { value: 'miniprogram', label: '小程序' },
  { value: 'offline', label: '线下门店' },
]

const sourcePopVisible = ref(false)
const handleSelectSource = (item: { value: string; label: string }) => {
  if (['douyin', 'miniprogram', 'offline'].includes(item.value)) {
    source.value = item.value as 'douyin' | 'miniprogram' | 'offline'
  }
  sourcePopVisible.value = false
}

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

  if (isExternalFlow()) {
    if (!nickname.value.trim()) {
      uni.showToast({ icon: 'none', title: '请输入姓名' })
      return
    }
    if (!phone.value.trim()) {
      uni.showToast({ icon: 'none', title: '请输入手机号' })
      return
    }
    if (!vaildateMoible(phone.value)) return
    if (!roomNumber.value.trim()) {
      uni.showToast({ icon: 'none', title: '请输入房间号' })
      return
    }
  }

  uni.showModal({
    title: '提示',
    content: '确定提交身份信息吗',
    confirmColor: '#eed261',
    success: async (confirm) => {
      if (!confirm) return
      const userId = userStore.profile?._id as string
      if (!userId) {
        uni.showToast({ icon: 'none', title: '请先登录' })
        return
      }

      if (isExternalFlow()) {
        const res = await checkInExternalApi({
          userId,
          shopId: shopId.value,
          icCardFont: icCardFont.value,
          icCardBack: icCardBack.value,
          nickname: nickname.value.trim(),
          phone: phone.value.trim(),
          roomNumber: roomNumber.value.trim(),
          source: source.value || undefined,
        })
        if (res.code === 200) {
          uni.showToast({ icon: 'success', title: '提交成功' })
          setTimeout(() => uni.navigateBack(), 800)
        } else {
          uni.showToast({ icon: 'none', title: res.message || '提交失败' })
        }
      } else {
        const res = await checkInShopApi(
          userId,
          orderId.value,
          icCardFont.value,
          icCardBack.value,
        )
        if (res.code === 200) {
          uni.showToast({ icon: 'success', title: '提交成功' })
          setTimeout(() => uni.navigateBack(), 800)
        } else {
          uni.showToast({ icon: 'none', title: res.message || '提交失败' })
        }
      }
    },
  })
}

onLoad((options) => {
  orderId.value = options?.orderId ?? ''
  shopId.value = options?.shopId ?? ''
  nickname.value = userStore.profile?.nickname ?? ''
  phone.value = userStore.profile?.mobile ?? ''
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

        <!-- 外部订单表单（抖音/团购等） -->
        <view v-if="isExternalFlow()" class="card form-card">
          <view class="section-title">入住信息</view>
          <view class="form-row">
            <text class="form-label">姓名</text>
            <input v-model="nickname" class="form-input" placeholder="请输入姓名" type="text" />
          </view>
          <view class="form-row">
            <text class="form-label">手机号</text>
            <input v-model="phone" class="form-input" placeholder="请输入手机号" type="number" />
          </view>
          <view class="form-row">
            <text class="form-label">房间号</text>
            <input v-model="roomNumber" class="form-input" placeholder="请输入房间号" type="text" />
          </view>
          <view class="form-row">
            <text class="form-label">来源</text>
            <view class="form-picker-wrap" @tap="sourcePopVisible = !sourcePopVisible">
              <view class="form-input form-picker" :class="{ 'has-value': source }">
                {{ source ? sourceColumns.find((s) => s.value === source)?.label : '请选择来源' }}
              </view>
              <text v-show="!sourcePopVisible" class="iconfont icon-laxiatubiao form-picker-arrow"></text>
              <text v-show="sourcePopVisible" class="iconfont icon-xiangshangtubiao form-picker-arrow"></text>
            </view>
            <!-- 来源弹框（FilterBar 风格） -->
            <view class="dialog-overlay" v-if="sourcePopVisible">
              <view class="dialog-mask" @tap="sourcePopVisible = false"></view>
              <view class="dialog-box" @tap.stop>
                <view class="dialog-title">选择来源</view>
                <view class="dialog-options">
                  <view
                    class="option-item"
                    :class="{ active: item.value === source }"
                    v-for="item in sourceColumns"
                    :key="item.value"
                    @tap="handleSelectSource(item)"
                  >
                    {{ item.label }}
                  </view>
                </view>
              </view>
            </view>
          </view>
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
  padding-bottom: 120rpx;
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

/* 外部订单表单 */
.form-card {
  .form-row {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-label {
    width: 180rpx;
    flex-shrink: 0;
    font-size: 28rpx;
    color: $qs-font-title;

    .required {
      color: $qs-brandColor;
      font-weight: bold;
    }
  }

  .form-picker-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8rpx;

    .form-picker-arrow {
      font-size: 16rpx;
      color: #0b0a0a;
      flex-shrink: 0;
    }
  }

  .form-input {
    flex: 1;
    height: 72rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: $qs-font-title;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .form-picker {
    width: 100%;
    display: flex;
    align-items: center;
    color: $qs-font-dec;

    &.has-value {
      color: $qs-font-title;
    }
  }
}

/* 来源弹框（页面居中） */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
}

.dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.dialog-box {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
}

.dialog-title {
  font-size: 30rpx;
  font-weight: bold;
  color: $qs-font-title;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid $qs-border;
}

.dialog-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  .option-item {
    padding: 28rpx 32rpx;
    font-size: 28rpx;
    color: $qs-font-title;
    background-color: #f8f8f8;
    border-radius: 16rpx;
    text-align: left;
    border: 2rpx solid transparent;

    &.active {
      color: $qs-font-title;
      background-color: rgba($qs-brandColor, 0.2);
      border-color: $qs-brandColor;
      font-weight: 600;
    }
  }
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
