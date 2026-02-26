<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
</script>
<template>
  <view class="createOrder">
    <NavHead title="确认订单" :show-back="true"></NavHead>
  </view>
</template>

<style scoped lang="scss">
.createOrder {
  height: 100%;
  @include page-background();
}
</style>
