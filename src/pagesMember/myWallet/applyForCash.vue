<script setup lang="ts">
import { ref } from 'vue'
import NavHead from '@/components/NavHead.vue'
import type { ApplyForCashFormData } from '@/types/Cash'
import { validateApplyForCashForm } from './dataCofing'
import { cashWithdrawApi } from '@/api/myWallet'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const formData = ref<ApplyForCashFormData>({
  userId: userStore.profile?._id ?? '',
  name: '',
  bankCard: '',
  openBank: '',
  mobile: '',
  amount: 0,
})

// 提交状态
const isSuccess = ref(false)

// 处理提交
const handleSubmit = async () => {
  formData.value.amount = Number(formData.value.amount) || 0
  const balance = userStore.profile?.balance ?? 0
  const errorMsg = validateApplyForCashForm(formData.value, balance)
  if (errorMsg) return uni.showToast({ icon: 'none', title: errorMsg })

  console.log('提交的数据', formData.value)
  // 调用提交接口
  const res = await cashWithdrawApi(formData.value)
  if (res.code === 200) {
    // 提交成功
    isSuccess.value = true
    uni.showToast({ icon: 'success', title: '申请成功' })
  }
}

// 回首页
const goHome = () => {
  uni.switchTab({ url: '/pages/home/home' })
}
</script>
<template>
  <view class="applyForCash">
    <NavHead title="余额提现" :show-back="true"></NavHead>
    <!-- 提交前表单   -->
    <template v-if="!isSuccess">
      <!-- 提现表单  -->
      <view class="form">
        <uni-forms :modelValue="formData" labelWidth="200rpx">
          <uni-forms-item label="姓名" name="name">
            <uni-easyinput :inputBorder="false" v-model="formData.name" placeholder="请输入姓名" trim
              primaryColor="#ffd018" />
          </uni-forms-item>
          <uni-forms-item label="银行卡号" name="bankCard">
            <uni-easyinput :inputBorder="false" v-model="formData.bankCard" placeholder="请输入银行卡号" trim
              primaryColor="#ffd018" />
          </uni-forms-item>
          <uni-forms-item name="openBank" label="银行开户行">
            <uni-easyinput :inputBorder="false" v-model="formData.openBank" placeholder="请输入银行开户行" trim
              primaryColor="#ffd018" />
          </uni-forms-item>
          <uni-forms-item name="mobile" label="预留手机号">
            <uni-easyinput :inputBorder="false" v-model="formData.mobile" placeholder="请输入手机号" trim
              primaryColor="#ffd018" />
          </uni-forms-item>
          <uni-forms-item name="amount" label="提现金额">
            <uni-easyinput :inputBorder="false" v-model="formData.amount" type="number" placeholder="请输入提现金额（100的整数倍）"
              primaryColor="#ffd018" />
          </uni-forms-item>
        </uni-forms>
      </view>
      <!-- 账户余额  -->
      <view class="balance">
        <view class="label">账户余额</view>
        <view class="value">￥{{ userStore.profile?.balance ?? 0 }}</view>
      </view>
      <!-- 提交  -->
      <view class="submit">
        <view class="btn" @tap="handleSubmit">提交审核</view>
        <view class="tips">提交后我们将在24小时内完成审核</view>
      </view>
    </template>
    <!-- 提交成功状态   -->
    <template v-else>
      <view class="success">
        <view class="content">
          <image class="img" mode="aspectFit"
            src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cash/success.png"></image>
          <view class="text">提交成功</view>
          <view class="time">提交时间：2025-07-01</view>
          <view class="btn" @tap="goHome">返回首页</view>
        </view>
      </view>
    </template>
  </view>
</template>

<style scoped lang="scss">
.applyForCash {
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

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

/*账户余额*/
.balance {
  padding: 30rpx 34rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);

  .label {
    font-size: 26rpx;
    color: #0b0a0a;
  }

  .value {
    font-size: 28rpx;
    color: #ff3b3b;
  }
}

/*提交审核*/
.submit {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100rpx;

  .btn {
    @include customBtn();
  }

  .tips {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #919191;
  }
}

/*成功状态*/
.success {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .img {
      margin-bottom: 20rpx;
      width: 380rpx;
      height: 372rpx;
    }

    .text {
      font-weight: bold;
      font-size: 40rpx;
      color: #1a1a1a;
    }

    .time {
      margin-bottom: 280rpx;
      font-size: 24rpx;
      color: #919191;
    }

    .btn {
      @include customBtn();
    }
  }
}
</style>
