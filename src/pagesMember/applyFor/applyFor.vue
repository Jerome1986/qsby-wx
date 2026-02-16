<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'

// 表单数据
interface FormData {
  realName: string
  idCard: string
  phone: string
}

const formData = ref<FormData>({
  realName: '',
  idCard: '',
  phone: '',
})

// 提交申请
const handleSubmit = async () => {
  // 表单验证
  if (!formData.value.realName) {
    return uni.showToast({ icon: 'none', title: '请输入真实姓名' })
  }
  if (!formData.value.idCard) {
    return uni.showToast({ icon: 'none', title: '请输入身份证号' })
  }
  if (!formData.value.phone) {
    return uni.showToast({ icon: 'none', title: '请输入手机号' })
  }

  console.log('提交申请:', formData.value)
  // TODO: 调用申请接口
}
</script>
<template>
  <view class="applyFor">
    <NavHead title="申请主理人" :show-back="true"></NavHead>

    <!-- 表单 -->
    <view class="form">
      <uni-forms :modelValue="formData" labelWidth="160rpx">
        <uni-forms-item label="真实姓名" name="realName">
          <uni-easyinput
            :inputBorder="false"
            v-model="formData.realName"
            placeholder="请输入真实姓名"
            primaryColor="#ffd018"
            trim
          />
        </uni-forms-item>

        <uni-forms-item label="身份证号" name="idCard">
          <uni-easyinput
            :inputBorder="false"
            v-model="formData.idCard"
            placeholder="请输入身份证号"
            primaryColor="#ffd018"
            trim
          />
        </uni-forms-item>

        <uni-forms-item label="手机号" name="phone">
          <uni-easyinput
            :inputBorder="false"
            v-model="formData.phone"
            placeholder="请输入手机号"
            primaryColor="#ffd018"
            :maxlength="11"
            trim
          />
        </uni-forms-item>
      </uni-forms>
    </view>

    <!-- 提交按钮 -->
    <view class="submit">
      <view class="btn" @tap="handleSubmit">申请主理人</view>
    </view>

    <!--  温馨提示  -->
    <view class="tips">
      <view class="title">温馨提示</view>
      <view class="content">
        <view class="item">1. 请确保填写的信息真实有效，审核通过后不可修改;</view>
        <view class="item">2. 主理人需年满18周岁，具有完全民事行为能力;</view>
        <view class="item"
          >3.
          若您有意向成为平台主理人，建议先通过线下渠道联系平台工作人员，完成资质审核与相关流程;</view
        >
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
  .title {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 16rpx;
  }
  .content {
    .item {
      font-size: 24rpx;
      color: $qs-font-dec2;
      line-height: 1.8;
    }
  }
}
</style>
