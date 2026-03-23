<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSafeAreaBottom } from '@/utils/system-info'
import type { CheckInExternalItem } from '@/types/store'
import { checkInExternalFindOne } from '@/api/store'
import { formatTimestamp } from '@/utils/generateMonth'

const id = ref('')
const detail = ref<CheckInExternalItem>()
const loading = ref(false)

const detailGet = async (idVal: string) => {
  loading.value = true
  try {
    const res = await checkInExternalFindOne(idVal)
    detail.value = res.data
  } catch {
    uni.showToast({ icon: 'none', title: '获取详情失败' })
  } finally {
    loading.value = false
  }
}

const handleCustomerCall = () => {
  const phone = detail.value?.phone || ''
  if (phone) uni.makePhoneCall({ phoneNumber: phone })
}

const handlePreviewIdCard = (type: 'font' | 'back') => {
  const url = type === 'font' ? detail.value?.icCardFont : detail.value?.icCardBack
  if (url) {
    uni.previewImage({
      current: url,
      urls: [detail.value?.icCardFont, detail.value?.icCardBack].filter(Boolean) as string[],
    })
  }
}

onLoad((options) => {
  id.value = options?.id || ''
  getSafeAreaBottom()
  if (id.value) {
    detailGet(id.value)
  }
})
</script>

<template>
  <view class="storeExternalCheckInDetail">
    <NavHead title="外部入住详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      <view v-else-if="detail" style="padding: 24rpx;">
        <!-- 基本信息 -->
        <view class="card">
          <view class="section-header">
            <view class="bar"></view>
            <text class="section-title">入住信息</text>
            <view class="dial-btn" @tap="handleCustomerCall" v-if="detail.phone">
              <text class="iconfont icon-dianhuabodadianhua"></text>
              <text>拨打电话</text>
            </view>
          </view>
          <view class="info-list">
            <view class="info-item">
              <text class="label">姓名</text>
              <text class="value">：{{ detail.nickname || '未填写' }}</text>
            </view>
            <view class="info-item">
              <text class="label">手机号</text>
              <text class="value">：{{ detail.phone || '未填写' }}</text>
            </view>
            <view class="info-item" v-if="detail.roomNumber">
              <text class="label">房间号</text>
              <text class="value">：{{ detail.roomNumber }}</text>
            </view>
            <view class="info-item" v-if="detail.source">
              <text class="label">来源</text>
              <text class="value">：{{ { douyin: '抖音', miniprogram: '小程序', offline: '线下门店' }[detail.source] ?? detail.source }}</text>
            </view>
            <view class="info-item" v-if="detail.createdAt">
              <text class="label">办理时间</text>
              <text class="value">：{{ formatTimestamp(detail.createdAt, 2) }}</text>
            </view>
          </view>
        </view>

        <!-- 身份证 -->
        <view class="card">
          <view class="section-header">
            <view class="bar"></view>
            <text class="section-title">身份证</text>
          </view>
          <view class="id-card-wrap" v-if="detail.icCardFont || detail.icCardBack">
            <view
              v-if="detail.icCardFont"
              class="id-card-img-wrap"
              @tap.stop="() => handlePreviewIdCard('font')"
            >
              <image class="id-card-img" :src="detail.icCardFont" mode="aspectFill" />
            </view>
            <view
              v-if="detail.icCardBack"
              class="id-card-img-wrap"
              @tap.stop="() => handlePreviewIdCard('back')"
            >
              <image class="id-card-img" :src="detail.icCardBack" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="!loading && !detail" class="empty">
        <text>记录不存在</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.storeExternalCheckInDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
}

.card {
  background-color: $qs-card-bg;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  @include customShadow();
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .bar {
    width: 6rpx;
    height: 28rpx;
    background-color: $qs-brandColor;
    border-radius: 3rpx;
    margin-right: 12rpx;
  }

  .section-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .dial-btn {
    display: flex;
    align-items: center;
    gap: 6rpx;
    font-size: 28rpx;
    color: $qs-brandColor;

    .iconfont {
      font-size: 32rpx;
    }
  }
}

.info-list {
  .info-item {
    margin-bottom: 8rpx;
    font-size: 28rpx;

    .label {
      color: $qs-font-dec2;
    }

    .value {
      color: $qs-font-dec;
    }
  }
}

.id-card-wrap {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;

  .id-card-img-wrap {
    width: 200rpx;
    height: 130rpx;
    border-radius: 8rpx;
    overflow: hidden;
    background-color: #f5f5f5;
  }

  .id-card-img {
    width: 100%;
    height: 100%;
  }
}
</style>
