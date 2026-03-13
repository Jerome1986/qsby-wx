<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { fieldsScoreOrder, scoreOrderItems } from '@/pagesMember/myScore/dataConfig.ts'
import OrderItem from '@/components/OrderItem.vue'

const tabList = ref([
  { label: '全部', value: 'ALL' },
  { label: '未使用', value: 'UNUSED' },
  { label: '已使用', value: 'USED' },
])

const activeTabIndex = ref(0)
const changeTab = (index: number) => {
  console.log(index)
  activeTabIndex.value = index
}

// 触底
const handleScroll = () => {
  console.log('触底')
}
</script>
<template>
  <view class="scoreOrder">
    <NavHead title="积分订单" :show-back="true"></NavHead>
    <!--  tab  -->
    <view class="tabList">
      <!--  订单类型  -->
      <view class="tabItem" :class="{ activeTab: activeTabIndex === index }" v-for="(item, index) in tabList"
        :key="item.value" @tap="changeTab(index)">{{ item.label }}</view>
      <view
        class="tab-indicator"
        :style="{ left: `calc(${activeTabIndex * 33.333}% + (33.333% - 48rpx) / 2)` }"
      ></view>
    </view>
    <!-- 订单列表   -->
    <scroll-view class="list" :scroll-y="true" @scrolltolower="handleScroll" :enhanced="true" :show-scrollbar="false">
      <OrderItem :list-data="scoreOrderItems" :fields="fieldsScoreOrder"></OrderItem>
      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.scoreOrder {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

.tabList {
  position: relative;
  padding: 30rpx 0 24rpx;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 30rpx;
  @include customShadow();

  .tabItem {
    position: relative;
    z-index: 1;
    text-align: center;
    flex: 1;
    color: $qs-font-dec;
  }

  .activeTab {
    font-weight: bold;
    color: $qs-font-title;
  }

  .tab-indicator {
    position: absolute;
    bottom: 12rpx;
    left: 0;
    width: 48rpx;
    height: 6rpx;
    background-color: $qs-brandColor;
    border-radius: 6rpx;
    transition: left 0.25s ease;
  }
}

.list {
  flex: 1;
  margin-top: 30rpx;
}
</style>
