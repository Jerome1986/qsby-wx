<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref, onMounted } from 'vue'
import { safeAreaBottom, getSafeAreaBottom } from '@/utils/system-info'

onMounted(() => {
  getSafeAreaBottom()
})

// 表单数据
const formData = ref({
  nickname: '',
  gender: '1',
  phone: '',
})

// 是否同意免责声明
const agreed = ref(false)

// 提交查看
const handleSubmit = () => {
  if (!formData.value.nickname) {
    return uni.showToast({ title: '请输入昵称', icon: 'none' })
  }
  if (!formData.value.phone) {
    return uni.showToast({ title: '请输入手机号', icon: 'none' })
  }
  if (!agreed.value) {
    return uni.showToast({ title: '请先阅读并同意免责声明', icon: 'none' })
  }
  // TODO: 提交支付逻辑
}

// 温馨提示
const tipsList = ref([
  '支付查看费用后，您将获取项目发布人的联系方式，请在有效期内联系。',
  '本平台仅提供信息展示与对接服务，不参与任何合作决策，请自行甄别项目真实性。',
  '如有疑问请联系平台客服处理。',
])

// 查看免责声明
const handleDisclaimer = () => {
  // TODO: 跳转免责声明页面
}
</script>

<template>
  <view class="checkProject">
    <NavHead title="查看项目" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!-- 产品信息卡 -->
      <view class="card product-card">
        <view class="product-top">
          <view class="cover">
            <image
              mode="aspectFill"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            ></image>
          </view>
          <view class="product-info">
            <view class="name">一起开一个游乐园</view>
            <view class="info-row">
              <text class="iconfont icon-fangzi"></text>
              <text class="text">千宿百院创业孵化基地</text>
            </view>
            <view class="info-row">
              <text class="iconfont icon-address"></text>
              <text class="text">湖北省武汉市洪山区地址信息</text>
            </view>
          </view>
        </view>
        <!-- 查看费用 -->
        <view class="fee-row">
          <text class="fee-label">查看费用</text>
          <text class="fee-price">¥9.9</text>
        </view>
      </view>

      <!-- 报名人信息标题 -->
      <view class="form-title">报名人信息</view>

      <!-- 表单卡片 -->
      <view class="card form-card">
        <uni-forms label-width="160rpx" label-align="left">
          <uni-forms-item label="昵称" name="nickname">
            <uni-easyinput v-model="formData.nickname" placeholder="代用名" :inputBorder="false" />
          </uni-forms-item>
          <uni-forms-item label="性别" name="gender">
            <radio-group @change="(e: any) => (formData.gender = e.detail.value)">
              <label class="radio-label">
                <radio value="1" :checked="formData.gender === '1'" color="#ffd018" />
                <text>男</text>
              </label>
              <label class="radio-label">
                <radio value="2" :checked="formData.gender === '2'" color="#ffd018" />
                <text>女</text>
              </label>
            </radio-group>
          </uni-forms-item>
          <uni-forms-item label="手机号" name="phone">
            <uni-easyinput
              v-model="formData.phone"
              placeholder="13561517777"
              type="number"
              :inputBorder="false"
            />
          </uni-forms-item>
        </uni-forms>
      </view>

      <!-- 温馨提示 -->
      <view class="card tips-card">
        <view class="tips-title">温馨提示：</view>
        <view class="tips-item" v-for="(tip, index) in tipsList" :key="index">
          <text>{{ index + 1 }}. {{ tip }}</text>
        </view>
      </view>

      <!-- 免责声明勾选 -->
      <view class="agreement" @tap="agreed = !agreed">
        <radio :checked="agreed" color="#ffd018" style="transform: scale(0.7)" />
        <text class="agree-text">我已仔细阅读并同意</text>
        <text class="agree-link" @tap.stop="handleDisclaimer">《免责声明》</text>
      </view>

      <!-- 底部占位 -->
      <view style="height: 140rpx"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="fee-info">
        <text class="fee-text">费用</text>
        <text class="fee-amount">¥9.9</text>
      </view>
      <view class="submit-btn" @tap="handleSubmit">提交查看</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.checkProject {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  padding: 24rpx;
}

/* 通用卡片 */
.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

/* 产品信息卡 */
.product-card {
  .product-top {
    display: flex;
    gap: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid $qs-border;

    .cover {
      width: 160rpx;
      height: 160rpx;
      border-radius: 10rpx;
      overflow: hidden;
      flex-shrink: 0;
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12rpx;

      .name {
        font-size: 30rpx;
        font-weight: bold;
        color: $qs-font-title;
        @include ellipsis(2);
      }

      .info-row {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: $qs-font-dec;

        .iconfont {
          margin-right: 8rpx;
          font-size: 26rpx;
        }

        .text {
          flex: 1;
          @include ellipsis(1);
        }
      }
    }
  }

  .fee-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;

    .fee-label {
      font-size: 28rpx;
      font-weight: bold;
      color: $qs-font-title;
    }

    .fee-price {
      font-size: 32rpx;
      font-weight: bold;
      color: #ff3b3b;
    }
  }
}

/* 表单标题 */
.form-title {
  font-size: 28rpx;
  color: $qs-font-dec;
  margin-bottom: 16rpx;
}

/* 表单卡片 */
.form-card {
  padding: 0 24rpx;

  :deep(.uni-forms) {
    padding: 0;
  }

  :deep(.uni-forms-item) {
    border-bottom: 1rpx solid $qs-border;
    margin-bottom: 0;
    padding: 20rpx 0;

    .uni-forms-item__label {
      font-size: 28rpx;
      color: $qs-font-title;
      font-weight: 500;
    }

    .uni-forms-item__error {
      display: none;
    }
  }

  :deep(.uni-forms-item:last-child) {
    border-bottom: none;
  }

  :deep(.uni-easyinput__content) {
    background-color: transparent !important;

    .uni-easyinput__inner {
      padding-left: 0 !important;
      font-size: 28rpx;
      color: $qs-font-title;
    }
  }

  .radio-label {
    margin-right: 40rpx;
    font-size: 28rpx;
    color: $qs-font-title;
    display: inline-flex;
    align-items: center;

    text {
      margin-left: 8rpx;
    }
  }
}

/* 温馨提示 */
.tips-card {
  .tips-title {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 16rpx;
  }

  .tips-item {
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.8;
  }
}

/* 免责声明勾选 */
.agreement {
  display: flex;
  align-items: center;
  padding: 16rpx 0;

  .agree-text {
    font-size: 26rpx;
    color: $qs-font-dec;
  }

  .agree-link {
    font-size: 26rpx;
    color: $qs-brandColor;
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
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .fee-info {
    margin-right: 30rpx;

    .fee-text {
      font-size: 26rpx;
      color: $qs-font-dec;
      margin-right: 8rpx;
    }

    .fee-amount {
      font-size: 32rpx;
      font-weight: bold;
      color: #ff3b3b;
    }
  }

  .submit-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: $qs-brandColor;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
