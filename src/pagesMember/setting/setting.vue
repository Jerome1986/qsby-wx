<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { changeAvatarApi, updateUserInfoApi } from '@/api/user.ts'
import { onLoad } from '@dcloudio/uni-app'
import { userInfoGet } from '@/composables/userInfo.ts'

// store
const userStore = useUserStore()

// 等待数据加载完成
const initData = async (userId: string) => {
  await userInfoGet(userId)
  // 确保数据加载完成后才赋值
  if (userStore.profile) {
    formData.value.nickname = userStore.profile.nickname || ''
    formData.value.age = userStore.profile.age?.toString() || ''
    formData.value.gender = userStore.profile.gender || 1
  }
}

onLoad(async (options: any) => {
  console.log('参数', options)
  if (options && options.userId) {
    await initData(options.userId)
  } else {
    console.log('缺少参数，页面返回')
    await uni.navigateBack()
  }
})

interface FormData {
  nickname: string
  age: string
  gender: number
}

// 初始表单
const formData = ref<FormData>({
  nickname: '',
  age: '',
  gender: 0, // 0-未选择, 1-男, 2-女
})

// 表单提交处理
const handleSubmit = async () => {
  console.log('提交表单:', formData.value)
  // 这里可以添加表单验证和提交逻辑
  if (userStore.profile?._id) {
    const res = await updateUserInfoApi(
      userStore.profile?._id,
      formData.value.nickname,
      formData.value.age,
      formData.value.gender,
    )
    if (res.code === 200) {
      // 更新store中的用户信息，触发响应式更新
      userStore.setProfile({
        nickname: formData.value.nickname,
        age: formData.value.age,
        gender: formData.value.gender,
      })
      console.log('用户信息已更新到store')

      await uni.navigateBack()
      setTimeout(() => {
        uni.showToast({ icon: 'none', title: '已保存', duration: 1000 })
      }, 300)
    }
  }
}

// 更换头像
const handleChangeAvatar = () => {
  // todo校验用户次数
  // 选择头像并上传
  uni.chooseImage({
    count: 1,
    success(e) {
      console.log(e.tempFilePaths[0])
      const name = 'avatar_' + Date.now()
      uni.uploadFile({
        url: 'https://x9zmst6evg.sealoshzh.site/upload/images',
        filePath: e.tempFilePaths[0],
        name,
        success: async (uploadFileRes) => {
          console.log(uploadFileRes.data)
          if (userStore.profile?._id) {
            // 将头像更新到数据库
            const avatarRes = await changeAvatarApi(userStore.profile?._id, uploadFileRes.data)
            if (avatarRes.code === 200 && avatarRes.data.avatarUrl) {
              // 同步更新store中的头像
              userStore.setProfile({
                avatarUrl: avatarRes.data.avatarUrl,
              })
              console.log('头像已更新到store')
              setTimeout(() => {
                uni.showToast({ icon: 'success', duration: 2000, title: avatarRes.message })
              }, 800)
            } else {
              // 超过3次修改
              await uni.showToast({ icon: 'none', duration: 2000, title: avatarRes.message })
            }
          }
        },
      })
    },
  })
}

// 退出登录
const handleLoginOut = () => {
  uni.showModal({
    title: '提示',
    content: '是否要退出登录',
    confirmColor: '#ffd018',
    success: (result) => {
      if (result.confirm) {
        userStore.clearProfile()
        setTimeout(() => {
          uni.switchTab({ url: '/pages/my/my' })
          uni.showToast({ icon: 'none', title: '退出登录' })
        }, 800)
      }
    },
  })
}
</script>
<!-- 设置页面 -->
<template>
  <view class="container">
    <!-- 表单区域 -->
    <view class="form-box">
      <view class="up-pic" @tap="handleChangeAvatar">
        <image class="avatar-img"
          :src="userStore.profile?.avatarUrl || 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png'"
          mode="aspectFill" />
        <view class="tip-label">更换头像</view>
      </view>

      <uni-forms :modelValue="formData" labelWidth="60px">
        <uni-forms-item label="昵称" name="nickname">
          <uni-easyinput type="text" v-model="formData.nickname" placeholder="请输入昵称" primaryColor="#ffd018" trim />
        </uni-forms-item>

        <uni-forms-item label="年龄" name="age">
          <uni-easyinput type="text" v-model="formData.age" placeholder="请输入年龄" primaryColor="#ffd018" trim />
        </uni-forms-item>

        <uni-forms-item label="性别" name="gender">
          <view class="gender-selector">
            <view class="gender-btn" :class="{ active: formData.gender === 1 }" @tap="formData.gender = 1">
              <text class="gender-icon">👨</text>
              <text class="gender-text">男</text>
            </view>
            <view class="gender-btn" :class="{ active: formData.gender === 2 }" @tap="formData.gender = 2">
              <text class="gender-icon">👩</text>
              <text class="gender-text">女</text>
            </view>
          </view>
        </uni-forms-item>
      </uni-forms>

      <!-- 保存按钮 -->
      <view class="text-center">
        <view class="mb-10">
          <button class="save-btn" @tap="handleSubmit">保存资料</button>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section" @tap="handleLoginOut">
      <view class="logout-text">退出登录</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 24rpx 20rpx;
}

/* 表单容器 */
.form-box {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  /* 表单项容器 */
  .form-item {
    margin-bottom: 32rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* 头像上传区域 */
  .up-pic {
    display: flex;
    justify-content: center;
    margin-bottom: 40rpx;
    position: relative;

    .avatar-img {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 3rpx solid #ffffff;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    }

    .tip-label {
      position: absolute;
      bottom: 4rpx;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      padding: 4rpx 12rpx;
      border-radius: 12rpx;
      font-size: 20rpx;
      font-weight: 400;
    }
  }

  /* uni-forms 样式覆盖 */
  :deep(.uni-forms-item) {
    margin-bottom: 32rpx;

    .uni-forms-item__label {
      font-size: 28rpx;
      font-weight: 500;
      color: #0b0a0a;
    }

    .uni-forms-item__content {
      .uni-easyinput {
        @include customUniEasyInput();
      }
    }
  }

  /* 性别选择器 */
  .gender-selector {
    display: flex;
    gap: 16rpx;

    .gender-btn {
      flex: 1;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      border: 1rpx solid #f1f1f1;
      border-radius: 8rpx;
      background-color: #fafafa;
      transition: all 0.2s ease;
      cursor: pointer;

      .gender-icon {
        font-size: 28rpx;
      }

      .gender-text {
        font-size: 26rpx;
        color: #0b0a0a;
      }

      &.active {
        border-color: #ffd018;
        background-color: rgba(255, 208, 24, 0.1);

        .gender-text {
          color: #ffd018;
          font-weight: 500;
        }
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }

  /* 保存按钮 */
  .text-center {
    margin-top: 48rpx;

    .mb-10 {
      .save-btn {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        background: linear-gradient(135deg, #ffd018 0%, #ffe066 100%);
        border: none;
        border-radius: 12rpx;
        color: #ffffff;
        font-size: 30rpx;
        font-weight: 500;
        box-shadow: 0 4rpx 16rpx rgba(255, 208, 24, 0.25);

        &:active {
          transform: translateY(1rpx);
          box-shadow: 0 2rpx 8rpx rgba(255, 208, 24, 0.3);
        }
      }
    }
  }
}

/* 退出登录 */
.logout-section {
  display: flex;
  justify-content: center;
  padding: 24rpx 0;

  .logout-text {
    color: #6a6451;
    font-size: 26rpx;
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    transition: all 0.2s ease;

    &:active {
      background-color: rgba(0, 0, 0, 0.03);
      color: $qs-font-title;
    }
  }
}
</style>
