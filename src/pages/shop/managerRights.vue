<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { navBarOptions, rightsJump, type NavbarType } from './data';

const handleGo = (type: NavbarType) => {
  console.log('跳转')
  
  rightsJump[type](type)
}
</script>
<template>
  <view class="managerRights">
    <NavHead title="主理人计划" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="rights-item" v-for="(item, index) in navBarOptions" :key="index" @tap="handleGo(item.type)">
        <image class="bg" :src="item.img" mode="aspectFill"></image>
        <image class="label" mode="aspectFit" :src="item.text"></image>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.managerRights {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
}

/* 权益项 */
.rights-item {
  position: relative;
  width: 100%;
  height: 220rpx;
  border-radius: 30rpx;
  overflow: hidden;
  margin-bottom: 24rpx;

  .bg {
    width: 100%;
    height: 100%;
  }

  .label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500rpx;
    height: 100rpx;
  }
}
</style>
