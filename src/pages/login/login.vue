<script setup lang="ts">
import { ref } from 'vue'
import { wxLogin } from '@/api/login.ts'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'

// store
const userStore = useUserStore()

// 协议勾选状态
const isAgreePrivacy = ref(false)

// 切换协议勾选状态
const toggleAgreement = () => {
  isAgreePrivacy.value = !isAgreePrivacy.value
}

// 获取手机号凭证返回类型
type GetPhoneNumberEvent = {
  detail: {
    code?: string // 用于获取手机号的凭证
    errMsg?: string // 错误信息
    iv?: string // 加密算法的初始向量（已废弃）
    encryptedData?: string // 加密数据（已废弃）
  }
}

// 登录
const handleLogin = async (e: GetPhoneNumberEvent) => {
  console.log(e)
  if (!isAgreePrivacy.value) return uni.showToast({ icon: 'none', title: '同意并阅读协议条款' })
  const wxRes = await wxLogin(
    freshCode.value,
    e.detail.encryptedData!,
    e.detail.iv!,
    inviterCode.value,
  )
  console.log('登录返回', wxRes.data)
  if (wxRes.code === 200) {
    await uni.showToast({ icon: 'success', title: '登录成功' })
    await uni.switchTab({
      url: '/pages/home/home',
    })
    // 存储用户信息到store
    userStore.setProfile(wxRes.data)
  }
}

// 刷新CODE
const freshCode = ref('')
// 获取参数-邀请码
const inviterCode = ref('')
onLoad(async (options: any) => {
  console.log('入参', options)
  // 进页面就重新获取code，防止过期
  uni.login({
    success: async (res) => {
      freshCode.value = res.code + '' // 强制触发一次新的 code
      if (!freshCode.value) {
        await uni.showToast({ icon: 'none', title: '获取code失败' })
        console.error('uni.login 获取code失败', res)
        return
      }
    },
    fail: (err) => {
      uni.showToast({ icon: 'none', title: '微信登录失败' })
      console.error('login 失败', err)
    },
  })

  // 先判断分享链接进入
  if (options.inviterCode) {
    inviterCode.value = options.inviterCode
  } else {
    // 再判断二维码扫码进入
    const scene = decodeURIComponent(options.scene || '')
    if (scene) {
      const parts = scene.split('=')
      inviterCode.value = parts[1] || ''
    }
  }

  // 如果依旧没有邀请码，说明没人邀请
  if (!inviterCode.value) {
    console.log('无邀请码，正常进入')
    return
  }
})
</script>

<!-- 登录页面 -->
<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="bg-circle bg-circle-1"></view>
      <view class="bg-circle bg-circle-2"></view>
    </view>

    <!-- 主内容区域 -->
    <view class="login-content">
      <!-- 标题区域 -->
      <view class="title-block">
        <view class="title">欢迎使用千宿百院</view>
        <view class="subtitle">一家有温暖的社交民宿聚集地</view>
      </view>

      <!-- 登录按钮 -->
      <view class="login-section">
        <button
          class="login-btn"
          :disabled="!isAgreePrivacy"
          :class="{ disabled: !isAgreePrivacy }"
          open-type="getPhoneNumber"
          @getphonenumber="handleLogin"
        >
          一键登录
        </button>
      </view>

      <!-- 协议区域 -->
      <view class="agreement-section">
        <view class="agreement-content">
          <view class="checkbox-wrapper" @tap="toggleAgreement">
            <view class="checkbox-icon" :class="{ checked: isAgreePrivacy }">
              <text v-if="isAgreePrivacy" class="check-mark">✓</text>
            </view>
            <text class="agreement-text">已阅读并同意</text>
          </view>
          <view class="agreement-links">
            <text class="link">《服务条款》</text>
            <text class="and-text">和</text>
            <text class="link">《隐私协议》</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
  overflow: hidden;
}

// 背景装饰
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  .bg-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 208, 24, 0.1) 0%, rgba(255, 219, 51, 0.05) 100%);
  }

  .bg-circle-1 {
    width: 300rpx;
    height: 300rpx;
    top: -150rpx;
    right: -100rpx;
  }

  .bg-circle-2 {
    width: 200rpx;
    height: 200rpx;
    bottom: 100rpx;
    left: -80rpx;
  }
}

// 主内容区域
.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 0 60rpx;
}

// 标题区域
.title-block {
  text-align: center;
  margin-bottom: 120rpx;

  .title {
    font-size: 32px;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 16rpx;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 28rpx;
    color: $qs-font-dec;
    line-height: 1.3;
  }
}

// 登录按钮区域
.login-section {
  margin-bottom: 80rpx;

  .login-btn {
    width: 100%;
    height: 100rpx;
    background: linear-gradient(135deg, $qs-brandColor 0%, lighten($qs-brandColor, 8%) 100%);
    border: none;
    border-radius: 50rpx;
    color: #fff;
    font-weight: 600;
    font-size: 32rpx;
    box-shadow: 0 8rpx 24rpx rgba(255, 208, 24, 0.3);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active:not(.disabled) {
      transform: translateY(2rpx);
      box-shadow: 0 4rpx 16rpx rgba(255, 208, 24, 0.4);
    }

    &.disabled {
      background: rgba(255, 208, 24, 0.1);
      color: rgba(255, 208, 24, 0.6);
      box-shadow: none;
      cursor: not-allowed;
    }
  }
}

// 协议区域
.agreement-section {
  .agreement-content {
    text-align: center;

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      .checkbox-icon {
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        border: 2rpx solid $qs-font-dec2;
        margin-right: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        color: #fff;
        transition: all 0.2s ease;

        &.checked {
          background-color: $qs-brandColor;
          border-color: $qs-brandColor;
        }

        .check-mark {
          color: #fff;
          font-size: 20rpx;
          line-height: 1;
        }
      }

      .agreement-text {
        font-size: 26rpx;
        color: $qs-font-dec;
        transition: color 0.2s ease;
      }

      &:active .checkbox-icon {
        transform: scale(0.9);
      }
    }

    .agreement-links {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      .link {
        font-size: 26rpx;
        color: $qs-brandColor;
        font-weight: 500;
      }

      .and-text {
        margin: 0 6rpx;
        font-size: 24rpx;
        color: $qs-font-dec2;
      }
    }
  }
}
</style>
