<script setup lang="ts">
import NavTitle from '@/components/NavTitle.vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const handleStoreManage = () => {
  if (userStore.profile?.role === 'manager' && userStore.profile._id) {
    const shopId = userStore.profile?.shopId || ''
    if (!shopId) {
      uni.showToast({ icon: 'none', title: '暂无关联门店' })
      return
    }
    uni.navigateTo({
      url: `/pagesMember/storeManage/storeManage?shopId=${shopId}`,
    })
  } else {
    uni.showToast({ icon: 'none', title: '请先登录' })
  }
}
</script>

<template>
  <view class="store-manage" @tap="handleStoreManage">
    <NavTitle title="门店管理"></NavTitle>
    <view class="dec">店长管理门店订单丨待核销丨已核销丨办理入住</view>
    <view class="bg">
      <image
        src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/minsu.png"
        mode="aspectFit"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
.store-manage {
  position: relative;
  padding: 36rpx 30rpx;
  margin-top: 30rpx;
  height: 168rpx;
  background: $qs-card-bg;
  border-radius: 30rpx;
  @include customShadow();

  .dec {
    padding-left: 12rpx;
    margin-top: 24rpx;
    font-size: 22rpx;
    color: #6a6451;
  }

  .bg {
    position: absolute;
    right: 18rpx;
    top: 11rpx;
    width: 124rpx;
    height: 147rpx;
  }
}
</style>
