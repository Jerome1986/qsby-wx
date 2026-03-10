<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { publicListGetAll } from '@/api/publicManagement.ts'
import { useUserStore } from '@/stores'
import type { EventItem, PublicType } from '@/types/PublicManagement'
import { onLoad } from '@dcloudio/uni-app'
import { formatTimestamp } from '@/utils/generateMonth.ts'
import NoData from '@/components/NoData.vue'

// store
const userStore = useUserStore()

// tab列表处理
const tagList = [
  { id: '1', label: '趣哪游', value: 'trip' },
  { id: '2', label: '同城活动', value: 'activity' },
  { id: '3', label: '有趣的项目', value: 'project' },
]

const currentTab = ref<PublicType>('trip')
const activeIndex = ref(0)
const handleTab = (tabItem: PublicType, index: number) => {
  reset()

  activeIndex.value = index
  currentTab.value = tabItem

  if (userStore.profile?._id && currentTab.value) {
    console.log(currentTab.value)
    publicListGet(userStore.profile?._id, currentTab.value)
  }
}

// 重置页面
const reset = () => {
  pageNum.value = 1
  publicList.value = []
  finish.value = false
  loading.value = false
}

// 获取发布列表
const publicList = ref<EventItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finish = ref(false)
const publicListGet = async (userId: string, publicType: PublicType) => {
  if (finish.value && loading.value) return
  loading.value = false
  const res = await publicListGetAll(userId, publicType, pageNum.value, pageSize.value)
  console.log(res)

  publicList.value.push(...res.data.list)

  if (pageNum.value < res.data.totalPage) {
    console.log('当前页', pageNum.value)

    pageNum.value++
    console.log('页数增加', pageNum.value, '总页数', res.data.totalPage)
  } else {
    finish.value = true
    loading.value = true
  }
}

// 加载更多
const handleMore = () => {
  if (finish.value && loading.value) return
  publicListGet(userStore.profile?._id as string, currentTab.value)
}

onLoad(() => {
  if (userStore.profile?._id && currentTab.value) {
    publicListGet(userStore.profile?._id, currentTab.value)
  }
})

// 重新编辑
const handleEdit = async (EventId: string) => {
  console.log(EventId)
}

// 跳转报名列表
const handleSignUpList = () => {
  uni.navigateTo({
    url: '/pagesMember/publishManagement/signupList',
  })
}
</script>
<template>
  <view class="publishManagement">
    <NavHead title="发布管理" :show-back="true"></NavHead>
    <view class="tabList">
      <view class="tabItem" v-for="(item, index) in tagList" :key="item.id"
        :class="{ activeTabItem: activeIndex === index }" @tap="handleTab(item.value as PublicType, index)">{{
          item.label }}</view>
    </view>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="handleMore">
      <view class="orderItem" v-for="item in publicList" :key="item._id">
        <view class="card-body">
          <!-- 封面区域 -->
          <view class="left">
            <image class="cover" :src="item.cover" mode="aspectFill"></image>
          </view>
          <!-- 信息区域 -->
          <view class="right">
            <view class="title">{{ item.title }}</view>
            <view class="info-row">
              <text class="label">行程日期：</text>
              <text class="value">{{ formatTimestamp(item.time, 2) }}</text>
            </view>
            <view class="info-row">
              <text class="label">行程门店：</text>
              <text class="value">{{ item.address_name }}</text>
            </view>
            <view class="info-row">
              <text class="label">行程地址：</text>
              <text class="value">{{ item.event_address }}</text>
            </view>
            <view class="info-row">
              <text class="label">报名金额：</text>
              <text class="value price">¥{{ item.userFee }}元</text>
            </view>
            <view class="info-row">
              <text class="label">行程人数：</text>
              <text class="value">{{ item.revenue }}人</text>
            </view>
          </view>
        </view>
        <!-- 底部按钮 -->
        <view class="card-footer">
          <view class="edit-btn" @tap="handleEdit(item._id)">重新编辑行程</view>
          <view class="footer-right">
            <view class="action-btn primary" @tap="handleSignUpList">查看报名列表</view>
            <view class="action-btn">删除</view>
          </view>
        </view>
      </view>
      <!-- 底部占位，防止阴影被裁剪 -->
      <view class="scroll-bottom-placeholder" style="height: 20rpx;"></view>
      <!--   空状态   -->
      <view class="empty" v-if="!publicList.length">
        <image class="empty-img" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png"
          mode="widthFix"></image>
        <text class="empty-text">暂无数据</text>
      </view>
    </scroll-view>

  </view>
</template>

<style scoped lang="scss">
.publishManagement {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  height: 100%;
  @include page-background();



}

/*标签*/
.tabList {
  padding: 24rpx 0;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #cdcdcd;

  .tabItem {
    color: $qs-font-dec;
  }

  .activeTabItem {
    color: $qs-font-title;
    font-weight: bold;
  }
}

/* 行程单列表 */
.content {
  margin-top: 24rpx;
  flex: 1;

  /* 空状态 */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;

    .empty-img {
      width: 320rpx;
    }

    .empty-text {
      margin-top: 24rpx;
      font-size: 28rpx;
      color: $qs-font-dec;
    }
  }

}

.orderItem {
  padding: 24rpx;
  border-radius: 30rpx;
  background-color: #ffffff;
  @include customShadow();
  margin-bottom: 24rpx;
}

.card-body {
  display: flex;
  align-items: stretch;
  gap: 20rpx;
}

/* 左侧封面区域 */
.left {
  flex-shrink: 0;
  display: flex;

  .cover {
    width: 200rpx;
    min-height: 215rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }
}

/* 右侧信息区域 */
.right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    @include ellipsis(1);
    margin-bottom: 8rpx;
  }

  .info-row {
    display: flex;
    font-size: 24rpx;

    .label {
      flex-shrink: 0;
      color: $qs-font-dec;
    }

    .value {
      flex: 1;
      color: $qs-font-dec;
      @include ellipsis(1);

      &.price {
        color: #ff3b3b;
        font-weight: bold;
      }
    }
  }
}

/* 底部按钮区域 */
.card-footer {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.edit-btn {
  padding: 10rpx 30rpx;
  background-color: $qs-brandColor;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: $qs-font-title;
  white-space: nowrap;
}

.action-btn {
  padding: 10rpx 30rpx;
  border-radius: 30rpx;
  border: 1px solid #cdcdcd;
  font-size: 24rpx;
  color: $qs-font-title;

  &.primary {
    border-color: $qs-brandColor;
    background-color: rgba(255, 208, 24, 0.1);
  }
}
</style>
