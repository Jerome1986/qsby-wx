<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import NavHead from '@/components/NavHead.vue'
import { agreementDocs, normalizeAgreementType, type AgreementType } from './data'

const currentType = ref<AgreementType>('terms')

const doc = computed(() => agreementDocs[currentType.value])

onLoad((options) => {
  currentType.value = normalizeAgreementType(options?.type)
})
</script>

<template>
  <view class="agreement-page">
    <NavHead :title="doc.title" :show-back="true" bg-color="#fff4b9"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="content-inner">
        <view class="header-card">
          <view class="doc-title">{{ doc.title }}</view>
          <view class="meta-row">
            <text>生效日期：{{ doc.updatedAt }}</text>
          </view>
          <view class="meta-row">
            <text>运营主体：{{ doc.operator }}</text>
          </view>
          <view class="meta-row">
            <text>联系方式：{{ doc.contact }}</text>
          </view>
        </view>

        <view class="section-card" v-for="section in doc.sections" :key="section.title">
          <view class="section-title">{{ section.title }}</view>
          <view class="paragraph" v-for="paragraph in section.content" :key="paragraph">
            {{ paragraph }}
          </view>
        </view>

        <view class="bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.agreement-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  min-height: 0;
}

.content-inner {
  padding: 24rpx 24rpx 48rpx;
}

.header-card,
.section-card {
  padding: 28rpx;
  margin-bottom: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
}

.doc-title {
  margin-bottom: 20rpx;
  font-size: 38rpx;
  font-weight: bold;
  color: $qs-font-title;
  line-height: 1.4;
}

.meta-row {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $qs-font-dec;
  line-height: 1.6;
}

.section-title {
  position: relative;
  padding-left: 18rpx;
  margin-bottom: 18rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: $qs-font-title;
  line-height: 1.4;

  &::before {
    content: '';
    position: absolute;
    top: 8rpx;
    left: 0;
    width: 6rpx;
    height: 28rpx;
    background: $qs-brandColor;
    border-radius: 3rpx;
  }
}

.paragraph {
  margin-bottom: 16rpx;
  font-size: 27rpx;
  color: $qs-font-dec;
  line-height: 1.8;
  text-align: justify;
  word-break: break-all;

  &:last-child {
    margin-bottom: 0;
  }
}

.bottom-placeholder {
  height: 24rpx;
}
</style>
