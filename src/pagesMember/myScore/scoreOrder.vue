<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { fieldsScoreOrder } from '@/pagesMember/myScore/dataConfig.ts'
import OrderItem from '@/components/OrderItem.vue'
import { scoreOrderFindAll } from '@/api/order'
import type { ScoreOrder } from '@/types/Score'
import { onLoad } from '@dcloudio/uni-app'



const scoreOrder = ref<ScoreOrder[]>([])
const finish = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)

const reset = () => {
  pageNum.value = 1
  scoreOrder.value = []
  finish.value = false
}

const socreOrderGet = async (tab: string) => {
  if (finish.value) return
  const res = await scoreOrderFindAll(tab, pageNum.value, pageSize.value)
  console.log('list', res.data)

  scoreOrder.value.push(...res.data.list)

  if (pageNum.value < res.data.totalPage) {
    pageNum.value++
  } else {
    finish.value = true
  }
}

onLoad(() => socreOrderGet(activeTab.value))

const tabList = ref([
  { label: '全部', value: 'all' },
  { label: '未使用', value: 'paid' },
  { label: '已使用', value: 'verified' },
])
const activeTab = ref('all')
const activeTabIndex = ref(0)
const changeTab = (index: number, tab: string) => {
  console.log(index, tab)
  reset()
  activeTab.value = tab
  activeTabIndex.value = index
  socreOrderGet(activeTab.value)
}

// 触底
const handleScroll = () => {
  console.log('触底')
  if (finish.value) return
  socreOrderGet(activeTab.value)
}
</script>
<template>
  <view class="scoreOrder">
    <NavHead title="积分订单" :show-back="true"></NavHead>
    <!--  tab  -->
    <view style="padding: 24rpx;">
      <view class="tabList">
        <!--  订单类型  -->
        <view class="tabItem" :class="{ activeTab: activeTabIndex === index }" v-for="(item, index) in tabList"
          :key="item.value" @tap="changeTab(index, item.value)">{{ item.label }}</view>
        <view class="tab-indicator" :style="{ left: `calc(${activeTabIndex * 33.333}% + (33.333% - 48rpx) / 2)` }">
        </view>
      </view>
    </view>
    <!-- 订单列表   -->
    <scroll-view class="list" :scroll-y="true" @scrolltolower="handleScroll" :enhanced="true" :show-scrollbar="false">
      <view style="padding:0 24rpx;">
        <OrderItem :list-data="scoreOrder" :fields="fieldsScoreOrder"></OrderItem>
        <view style="height: 40rpx;"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.scoreOrder {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

.tabList {
  position: relative;
  padding: 30rpx 0 24rpx;
  display: flex;
  justify-content: space-between;
  background-color: $qs-card-bg;
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
}
</style>
