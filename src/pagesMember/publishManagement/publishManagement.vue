<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue'
import { sendFindAll } from '@/api/send'
import { useUserStore } from '@/stores'
import type { SendListItem, SendType } from '@/types/Send'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { formatTimestamp } from '@/utils/generateMonth'

const userStore = useUserStore()

const tagList: { id: string; label: string; value: SendType }[] = [
  { id: '1', label: '趣哪游', value: 'trip' },
  { id: '2', label: '同城活动', value: 'activity' },
  { id: '3', label: '有趣的项目', value: 'project' },
]

const currentTab = ref<SendType>('trip')
const activeIndex = ref(0)
/** 切换 tab 并重新拉取列表 */
const handleTab = (tabItem: SendType, index: number) => {
  reset()
  activeIndex.value = index
  currentTab.value = tabItem
  if (userStore.profile?._id && currentTab.value) {
    publicListGet(userStore.profile._id, currentTab.value)
  }
}

/** 重置分页与列表状态 */
const reset = () => {
  pageNum.value = 1
  publicList.value = []
  finish.value = false
  loading.value = false
  hasFetched.value = false
}

const publicList = ref<SendListItem[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finish = ref(false)
const hasFetched = ref(false)
/** 获取发布列表（分页） */
const publicListGet = async (userId: string, publicType: SendType) => {
  if (finish.value || loading.value) return
  loading.value = true
  try {
    const res = await sendFindAll(userId, publicType, pageNum.value, pageSize.value)
    const list = res.data?.list ?? []
    publicList.value.push(...list)
    if (pageNum.value < (res.data?.totalPage ?? 0)) {
      pageNum.value++
    } else {
      finish.value = true
    }
  } catch {
    // 请求失败时也标记已尝试过
  } finally {
    loading.value = false
    hasFetched.value = true
  }
}

/** 上拉加载更多 */
const handleMore = () => {
  if (!finish.value) publicListGet(userStore.profile?._id as string, currentTab.value)
}

/** 页面加载时拉取列表 */
onLoad(() => {
  if (userStore.profile?._id && currentTab.value) {
    publicListGet(userStore.profile._id, currentTab.value)
  }
})

const wasHidden = ref(false)
onHide(() => {
  wasHidden.value = true
})
/** 从编辑/报名等页返回时刷新（首次 onShow 不刷新，避免清空 onLoad 已拉取的数据） */
onShow(() => {
  if (!wasHidden.value) return
  if (userStore.profile?._id && currentTab.value) {
    reset()
    publicListGet(userStore.profile._id, currentTab.value)
  }
})

/** 跳转编辑页（项目跳 sendProject，行程/活动跳 public） */
const handleEdit = (itemId: string) => {
  if (currentTab.value === 'project') {
    uni.navigateTo({ url: `/pages/project/sendProject?projectId=${itemId}` })
  } else {
    uni.navigateTo({ url: `/pages/public/public?sendType=${currentTab.value}&itemId=${itemId}` })
  }
}

/** 跳转报名列表页 */
const handleSignUpList = (itemId: string) => {
  uni.navigateTo({
    url: `/pagesMember/publishManagement/signupList?itemId=${itemId}&type=${currentTab.value}`,
  })
}

/** 费用：项目用 viewFee，否则用 userFee */
const getFee = (item: SendListItem) => item.viewFee ?? item.userFee ?? 0

/** 报名人数 */
const getCount = (item: SendListItem) => (Array.isArray(item.signUpList) ? item.signUpList.length : 0)
</script>
<template>
  <view class="publishManagement">
    <NavHead title="发布管理" :show-back="true"></NavHead>
    <view class="tabList">
      <view class="tabItem" v-for="(item, index) in tagList" :key="item.id"
        :class="{ activeTabItem: activeIndex === index }" @tap="handleTab(item.value, index)">
        {{ item.label }}
      </view>
      <view class="tab-indicator" :style="{ left: `calc(${activeIndex * 33.333}% + (33.333% - 48rpx) / 2)` }"></view>
    </view>
    <view class="list-wrapper">
      <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false"
        @scrolltolower="handleMore">
        <view class="orderItem" v-for="item in publicList" :key="item._id">
          <view class="card-body">
            <view class="left">
              <image class="cover"
                :src="item.cover || 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cover.jpg'"
                mode="aspectFill"></image>
            </view>
            <view class="right">
              <view class="title">{{ item.title }}</view>
              <view class="info-group">
                <!-- 行程/活动：日期、门店、地址、报名金额、人数 -->
                <template v-if="currentTab === 'trip' || currentTab === 'activity'">
                  <view class="info-row" v-if="item.time">
                    <text class="label">{{ currentTab === 'trip' ? '行程日期：' : '活动日期：' }}</text>
                    <text class="value">{{ formatTimestamp(item.time, 2) }}</text>
                  </view>
                  <view class="info-row" v-if="item.address_name">
                    <text class="label">{{ currentTab === 'trip' ? '行程门店：' : '活动门店：' }}</text>
                    <text class="value">{{ item.address_name }}</text>
                  </view>
                  <view class="info-row" v-if="item.event_address">
                    <text class="label">{{ currentTab === 'trip' ? '行程地址：' : '活动地址：' }}</text>
                    <text class="value">{{ item.event_address }}</text>
                  </view>
                  <view class="info-row">
                    <text class="label">报名金额：</text>
                    <text class="value price">¥{{ getFee(item) }}元</text>
                  </view>
                  <view class="info-row">
                    <text class="label">{{ currentTab === 'trip' ? '行程人数：' : '活动人数：' }}</text>
                    <text class="value">{{ getCount(item) }}人</text>
                  </view>
                </template>
                <!-- 项目：基地名称、地址、查看费用、报名人数 -->
                <template v-else-if="currentTab === 'project'">
                  <view class="info-row" v-if="item.address_name || item.address">
                    <text class="label">项目名称：</text>
                    <text class="value">{{ item.address_name || item.address || '-' }}</text>
                  </view>
                  <view class="info-row" v-if="item.event_address">
                    <text class="label">项目地址：</text>
                    <text class="value">{{ item.event_address }}</text>
                  </view>
                  <view class="info-row">
                    <text class="label">查看费用：</text>
                    <text class="value price">¥{{ getFee(item) }}元</text>
                  </view>
                  <view class="info-row">
                    <text class="label">报名人数：</text>
                    <text class="value">{{ getCount(item) }}人</text>
                  </view>
                </template>
              </view>
            </view>
          </view>
          <view class="card-footer">
            <view class="edit-btn" @tap="handleEdit(item._id)">
              {{ currentTab === 'project' ? '重新编辑项目' : '重新编辑行程' }}
            </view>
            <view class="footer-right">
              <view class="action-btn primary" @tap="handleSignUpList(item._id)">查看报名列表</view>
              <view class="action-btn">删除</view>
            </view>
          </view>
        </view>
        <view class="load-more-tip" v-if="publicList.length && (loading || !finish)">
          <text v-if="loading">加载中...</text>
          <text v-else>上拉加载更多</text>
        </view>
        <view class="scroll-bottom-placeholder" style="height: 20rpx"></view>
        <Transition name="empty-fade">
          <view class="empty" v-if="hasFetched && !loading && !publicList.length">
            <image class="empty-img"
              src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png" mode="widthFix">
            </image>
            <text class="empty-text">暂无数据</text>
          </view>
        </Transition>
      </scroll-view>
    </view>
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
  position: relative;
  padding: 24rpx 0 24rpx;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 30rpx;
  @include customShadow();

  .tabItem {
    position: relative;
    z-index: 1;
    flex: 1;
    text-align: center;
    color: $qs-font-dec;
  }

  .activeTabItem {
    color: $qs-font-title;
    font-weight: bold;
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

/* 列表区域容器 */
.list-wrapper {
  margin-top: 24rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 30rpx;
}

/* 行程单列表 */
.content {
  flex: 1;
  width: 100%;

  /* 加载更多提示 */
  .load-more-tip {
    padding: 24rpx 0;
    text-align: center;
    font-size: 24rpx;
    color: $qs-font-dec;
  }

  /* 空状态 */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;

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

/* 空状态淡入淡出，减轻 v-if 切换闪屏 */
.empty-fade-enter-active,
.empty-fade-leave-active {
  transition: opacity 0.15s ease;
}

.empty-fade-enter-from,
.empty-fade-leave-to {
  opacity: 0;
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
  width: 200rpx;
  height: 215rpx;

  .cover {
    width: 100%;
    height: 100%;
    border-radius: 16rpx;
    overflow: hidden;
  }
}

/* 右侧信息区域：与封面等高 */
.right {
  flex: 1;
  min-width: 0;
  height: 215rpx;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    @include ellipsis(1);
    margin-bottom: 8rpx;
  }

  .info-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 0;
  }

  .info-row {
    display: flex;
    align-items: center;
    font-size: 24rpx;

    .label {
      flex-shrink: 0;
      color: $qs-font-dec;
    }

    .value {
      flex: 1;
      margin-left: 8rpx;
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
  padding: 10rpx 20rpx;
  width: 200rpx;
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
