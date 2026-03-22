<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import TipsBlock from '@/components/TipsBlock.vue'
import { ref } from 'vue'
import { applyManagerApi, verifyManagerApplyApi } from '@/api/user.ts'
import { useUserStore } from '@/stores'
import type { ApplyForStatus, FormData } from '@/types/ApplyFor'
import { validateApplyForm, applyForStatusText } from './dataConfig'
import { onLoad } from '@dcloudio/uni-app'

// 定义store
const userStore = useUserStore()

// 查询用户申请状态
const checkUserApply = async (userId: string) => {
  const res = await verifyManagerApplyApi(userId)
  console.log(res)
  status.value = res.data.status
  formData.value.username = res.data.username
  formData.value.idCard = res.data.idCard
  formData.value.mobile = res.data.mobile
}

onLoad(() => {
  if (userStore.profile?._id) checkUserApply(userStore.profile?._id)
})

// 表单
const formData = ref<FormData>({
  username: '',
  idCard: '',
  mobile: '',
})

// 申请单状态
const status = ref<ApplyForStatus>('no')

// 提交申请
const handleSubmit = async () => {
  // 表单验证
  const errorMsg = validateApplyForm(formData.value)
  if (errorMsg) return uni.showToast({ icon: 'none', title: errorMsg })

  //调用申请接口
  if (userStore.profile?._id) {
    const res = await applyManagerApi(
      userStore.profile?._id,
      formData.value.username,
      formData.value.idCard,
      formData.value.mobile,
    )
    console.log('提交结果', res)
    if (res.code === 200) {
      status.value = res.data.status
      await uni.showToast({ icon: 'success', title: res.message, mask: true })
    }
  }
}
</script>
<template>
  <view class="applyFor">
    <NavHead title="申请主理人" :show-back="true"></NavHead>

    <!-- 表单 -->
    <view class="form">
      <uni-forms :modelValue="formData" labelWidth="160rpx">
        <uni-forms-item label="真实姓名" name="username">
          <uni-easyinput :inputBorder="false" v-model="formData.username" placeholder="请输入真实姓名" primaryColor="#ffd018"
            trim :disabled="status !== 'no'" />
        </uni-forms-item>

        <uni-forms-item label="身份证号" name="idCard">
          <uni-easyinput :inputBorder="false" v-model="formData.idCard" placeholder="请输入身份证号" primaryColor="#ffd018"
            trim :disabled="status !== 'no'" />
        </uni-forms-item>

        <uni-forms-item label="手机号" name="mobile">
          <uni-easyinput :inputBorder="false" v-model="formData.mobile" placeholder="请输入手机号" primaryColor="#ffd018"
            :maxlength="11" trim :disabled="status !== 'no'" />
        </uni-forms-item>
      </uni-forms>
    </view>

    <!-- 提交按钮 -->
    <view class="submit">
      <view class="btn" @tap="handleSubmit">{{ applyForStatusText[status]() }}</view>
    </view>

    <!--  温馨提示  -->
    <view class="tips">
      <view class="title">温馨提示</view>
      <view class="content">
        <view class="item">1. 请确保填写的信息真实有效，审核通过后不可修改;</view>
        <view class="item">2. 主理人需年满18周岁，具有完全民事行为能力;</view>
        <view class="item">3.
          若您有意向成为平台主理人，建议先通过线下渠道联系平台工作人员，完成资质审核与相关流程;</view>
        <view class="item">4. 审核通过后，再通过小程序内“申请成为主理人”提交线上申请;</view>
        <view class="item">5. 未完成线下审核直接线上申请，将无法成功成为主理人;</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.applyFor {
  padding: 24rpx 24rpx 60rpx 24rpx;
  min-height: 100vh;
  @include page-background();
}

/* 表单容器 */
.form {
  padding: 20rpx 30rpx;
  background: #ffffff;
  border-radius: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
}

:deep(.uni-forms-item) {
  margin-bottom: 20rpx;
  border-bottom: 2rpx solid #e4e4e4;

  &:nth-last-child(1) {
    margin-bottom: 0;
    border-bottom: none;
  }
}

/* 提交按钮区域 */
.submit {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;

  .btn {
    text-align: center;
    width: 100%;
    height: 108rpx;
    line-height: 108rpx;
    background: $qs-brandColor;
    border-radius: 30rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}

/* 温馨提示 */
.tips {
  margin-top: 40rpx;
  padding: 24rpx 30rpx;
  background: #ffffff;
  border-radius: 30rpx;
  @include customShadow();
}
</style>
