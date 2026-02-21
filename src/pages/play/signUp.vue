<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info'

// 表单数据
const formData = ref({
  nickname: '',
  aliasName: '',
  gender: '男',
  phone: '',
})

onLoad(() => {
  getSafeAreaBottom()
})
</script>
<template>
  <view class="signUp">
    <NavHead title="报名信息" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  商品信息  -->
      <view class="productInfo">
        <view class="top">
          <view class="cover">
            <image
              mode="aspectFill"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
            ></image>
          </view>
          <view class="info">
            <!-- 标题和日期 -->
            <view class="info-group">
            <view class="title">12.27体验冬日里的庐山2天1晚</view>
              <view class="row">
                <text class="label">行程日期：</text>
                <text class="text">2025-12-27 12:00:00</text>
              </view>
            </view>
            <!-- 门店和地址 -->
            <view class="info-group">
              <view class="row">
                <text class="label">行程门店：</text>
                <text class="text">门店名称旅游名称（某公司）</text>
              </view>
              <view class="row">
                <text class="label">行程地址：</text>
                <text class="text">地址文案地址文案地址文案地址文案地址文案文案</text>
              </view>
            </view>
          </view>
        </view>
        <view class="price">
          <view class="label">行程报名费用</view>
          <view class="value">￥400.00</view>
        </view>
      </view>
      <!--  报名人信息  -->
      <view class="section-title">报名人信息</view>
      <view class="userInfo">
        <uni-forms ref="formRef" :modelValue="formData" labelWidth="140rpx">
          <uni-forms-item label="昵称" name="nickname">
            <uni-easyinput
              v-model="formData.nickname"
              :inputBorder="false"
              placeholder="代用名"
              primaryColor="#ffd018"
              trim
            />
          </uni-forms-item>
          <uni-forms-item label="性别" name="gender">
            <radio-group @change="(e: any) => (formData.gender = e.detail.value)">
              <label class="radio-label">
                <radio value="男" :checked="formData.gender === '男'" color="#ffd018" />
                <text>男</text>
              </label>
              <label class="radio-label">
                <radio value="女" :checked="formData.gender === '女'" color="#ffd018" />
                <text>女</text>
              </label>
            </radio-group>
          </uni-forms-item>
          <uni-forms-item label="手机号" name="phone">
            <uni-easyinput
              v-model="formData.phone"
              :inputBorder="false"
              placeholder="13561517777"
              primaryColor="#ffd018"
              type="number"
              trim
            />
          </uni-forms-item>
        </uni-forms>
      </view>
      <!--  温馨提示  -->
      <view class="tips">
        <view class="tips-title">温馨提示：</view>
        <view class="tips-item"
          >1、报名成功后，请按照行程安排准时到达指定集合地点，逾期未到视为自动放弃，费用不予退还。</view
        >
        <view class="tips-item"
          >2、如需取消报名，请提前24小时联系组织方，逾期取消将扣除相应手续费。</view
        >
        <view class="tips-item"
          >3、活动期间请遵守组织方安排，注意人身及财产安全，如遇突发情况请及时与工作人员沟通。</view
        >
        <view class="tips-item"
          >4、请确保所填写的联系方式真实有效，以便组织方及时与您取得联系。</view
        >
        <view class="tips-item"
          >5、本平台仅提供信息展示及报名服务，活动最终解释权归组织方所有。</view
        >
      </view>
      <!-- 底部占位 -->
      <view class="scroll-bottom-placeholder"></view>
    </scroll-view>
    <!--  底部操作区域  -->
    <view class="signUpBar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="price">
        <view class="row">
          <text class="label">费用</text>
          <text class="value">￥400.00</text>
        </view>
        <view class="row discount">
          <text class="label">主理人折扣</text>
          <text class="value">-￥200.00</text>
        </view>
      </view>
      <view class="btn">提交报名</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.signUp {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 180rpx;
  height: 100%;
  @include page-background();
}

/* 内容区域 */
.content {
  flex: 1;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

/* 商品信息卡片 */
.productInfo {
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  .top {
    padding-bottom: 24rpx;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    .cover {
      width: 192rpx;
      height: 215rpx;
      background: #f7d11a;
      border-radius: 24rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 24rpx;

      .info-group {
        .title {
          font-weight: bold;
          font-size: 28rpx;
          color: $qs-font-title;
          line-height: 1.4;
          @include ellipsis(2);
        }

        .row {
          margin-top: 4rpx;
          font-size: 22rpx;
          line-height: 1.6;

          .label {
            color: $qs-font-dec2;
          }

          .text {
            color: $qs-font-dec;
          }
        }
      }
    }
  }

  .price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .label {
      font-size: 28rpx;
      font-weight: bold;
      color: $qs-font-title;
    }

    .value {
      font-weight: bold;
      font-size: 28rpx;
      color: #ff3434;
    }
  }
}

/* 区块标题 */
.section-title {
  margin-top: 30rpx;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  color: $qs-font-dec;
}

/* 报名人信息卡片 */
.userInfo {
  padding: 0 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  :deep(.uni-forms) {
    .uni-forms-item {
      padding: 24rpx 0;
      margin-bottom: 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .uni-forms-item__label {
        font-size: 28rpx;
        color: $qs-font-title;
        padding: 0;
      }

      .uni-forms-item__content {
        display: flex;
        align-items: center;
      }
    }
  }

  :deep(.uni-easyinput) {
    .uni-easyinput__content {
      background-color: transparent !important;
      padding: 0 !important;
    }

    .uni-easyinput__placeholder-class {
      font-size: 28rpx;
      color: $qs-font-dec2;
    }

    .uni-easyinput__content-input {
      font-size: 28rpx;
      color: $qs-font-title;
    }
  }

  radio-group {
    display: flex;
    align-items: center;
  }

  .radio-label {
    display: flex;
    align-items: center;
    margin-right: 40rpx;
    font-size: 28rpx;
    color: $qs-font-title;

    radio {
      transform: scale(0.8);
    }

    text {
      margin-left: 8rpx;
    }
  }
}

/* 温馨提示 */
.tips {
  margin-top: 30rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  @include customShadow();

  .tips-title {
    font-size: 26rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 16rpx;
  }

  .tips-item {
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.8;
    margin-bottom: 16rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 底部操作区域 */
.signUpBar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border-top: 1px solid #f1f1f1;
  box-sizing: border-box;

  .price {
    display: flex;
    flex-direction: column;

    .row {
      display: flex;
      align-items: baseline;

      .label {
        font-size: 26rpx;
        color: $qs-font-title;
      }

      .value {
        margin-left: 8rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #ff3434;
      }
    }

    .discount {
      margin-top: 4rpx;

      .label,
      .value {
        font-size: 22rpx;
        font-weight: normal;
        color: $qs-font-dec;
      }
    }
  }

  .btn {
    padding: 0 60rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #ffd018;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
