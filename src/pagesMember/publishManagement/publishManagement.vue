<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { computed, ref } from 'vue'
import { sendFindAll } from '@/api/send'
import { activityTypeFindAll } from '@/api/activity'
import { useUserStore } from '@/stores'
import type { SendListItem } from '@/types/Send'
import type { ActivityTypeItem } from '@/types/Public'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { formatTimestamp } from '@/utils/generateMonth'
import { unifiedProcessDel } from './unifiedProcess'

const userStore = useUserStore()

type ActivityTabItem = ActivityTypeItem & { _id: string; name: string }

const tagList = ref<ActivityTabItem[]>([{ _id: 'all', name: '全部' }])
const currentCateId = ref('all')
const activeIndex = ref(0)
const tabIndicatorStyle = computed(() => {
  const tabWidth = 100 / Math.max(tagList.value.length, 1)
  return {
    left: `calc(${activeIndex.value * tabWidth}% + (${tabWidth}% - 48rpx) / 2)`,
  }
})

const displayList = computed(() => {
  if (currentCateId.value === 'all') return publicList.value
  return publicList.value.filter((item) => item.type === currentCateId.value)
})

/** 加载活动分类 tab */
const activityTypeGet = async () => {
  const res = await activityTypeFindAll()
  tagList.value = [{ _id: 'all', name: '全部' }, ...res.data]
}

/** 切换活动分类并重新拉取列表 */
const handleTab = (cateId: string, index: number) => {
  reset()
  activeIndex.value = index
  currentCateId.value = cateId
  if (cateId !== 'all') {
    console.log('TODO: 活动管理分类接口参数', cateId)
  }
  if (userStore.profile?._id) {
    publicListGet(userStore.profile._id)
  }
}

/** 重置分页与列表状态 */
const reset = () => {
  requestVersion.value++
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
const requestVersion = ref(0)
/** 获取活动发布列表（分页） */
const publicListGet = async (userId: string) => {
  if (finish.value || loading.value) return
  const currentRequestVersion = requestVersion.value
  const requestPageNum = pageNum.value
  if (currentCateId.value !== 'all') {
    console.log('TODO: 活动管理分类接口参数', currentCateId.value)
  }
  loading.value = true
  try {
    const res = await sendFindAll(userId, 'activity', requestPageNum, pageSize.value)
    if (currentRequestVersion !== requestVersion.value) return
    const list = res.data?.list ?? []
    if (requestPageNum === 1) {
      publicList.value = list
    } else {
      publicList.value.push(...list)
    }
    if (requestPageNum < (res.data?.totalPage ?? 0)) {
      pageNum.value = requestPageNum + 1
    } else {
      finish.value = true
    }
  } catch {
    // 请求失败时也标记已尝试过
  } finally {
    if (currentRequestVersion !== requestVersion.value) return
    loading.value = false
    hasFetched.value = true
  }
}

/** 上拉加载更多 */
const handleMore = () => {
  if (!finish.value && userStore.profile?._id) publicListGet(userStore.profile._id)
}

/** 页面加载时拉取列表 */
onLoad(async () => {
  await activityTypeGet()
  if (userStore.profile?._id) {
    publicListGet(userStore.profile._id)
  }
})

const wasHidden = ref(false)
onHide(() => {
  wasHidden.value = true
})
/** 从编辑/报名等页返回时刷新（首次 onShow 不刷新，避免清空 onLoad 已拉取的数据） */
onShow(() => {
  if (!wasHidden.value) return
  if (userStore.profile?._id) {
    reset()
    publicListGet(userStore.profile._id)
  }
})

/** 跳转编辑页 */
const handleEdit = (itemId: string) => {
  uni.navigateTo({ url: `/pages/public/public?itemId=${itemId}` })
}

/** 跳转核销列表页 */
const handleVerificationList = (item: SendListItem) => {
  uni.navigateTo({
    url: `/pagesMember/publishManagement/verificationList?itemId=${item._id}&type=activity&title=${encodeURIComponent(item.title)}`,
  })
}

/** 费用 */
const getFee = (item: SendListItem) => item.userFee ?? 0

/** 报名人数 */
const getCount = (item: SendListItem) => (Array.isArray(item.signUpList) ? item.signUpList.length : 0)
/** 删除 */
const handleDel = (itemId: string) => {
  const userId = userStore.profile?._id
  if (!userId) return
  uni.showModal({
    title: '提示',
    content: '确定要删除吗？',
    confirmColor: '#ffd018',
    success: async (res) => {
      if (!res.confirm) return
      const { ok, message } = await unifiedProcessDel.activity(itemId, userId)
      uni.showToast({ icon: ok ? 'success' : 'none', title: message })
      if (ok) {
        reset()
        publicListGet(userId)
      }
    },
  })
}

</script>
<template>
  <view class="publishManagement">
    <NavHead title="活动管理" :show-back="true"></NavHead>
    <view class="tabList">
      <view class="tabItem" v-for="(item, index) in tagList" :key="item._id"
        :class="{ activeTabItem: activeIndex === index }" @tap="handleTab(item._id, index)">
        {{ item.name }}
      </view>
      <view class="tab-indicator" :style="tabIndicatorStyle"></view>
    </view>
    <view class="list-wrapper">
      <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false"
        @scrolltolower="handleMore">
        <view class="list-content">
          <view class="orderItem" v-for="item in displayList" :key="item._id">
          <view class="delete-chip" @tap.stop="handleDel(item._id)">删除</view>
          <view class="card-body">
            <view class="left">
              <image class="cover"
                :src="item.cover || 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cover.jpg'"
                mode="aspectFill"></image>
            </view>
            <view class="right">
              <view class="title">{{ item.title }}</view>
              <view class="info-group">
                <view class="info-row" v-if="item.time">
                  <text class="label">活动日期：</text>
                  <text class="value">{{ formatTimestamp(item.time, 2) }}</text>
                </view>
                <view class="info-row" v-if="item.address_name">
                  <text class="label">活动门店：</text>
                  <text class="value">{{ item.address_name }}</text>
                </view>
                <view class="info-row" v-if="item.event_address">
                  <text class="label">活动地址：</text>
                  <text class="value">{{ item.event_address }}</text>
                </view>
                <view class="info-row">
                  <text class="label">报名金额：</text>
                  <text class="value price">¥{{ getFee(item) }}元</text>
                </view>
                <view class="info-row">
                  <text class="label">活动人数：</text>
                  <text class="value">{{ getCount(item) }}人</text>
                </view>
              </view>
            </view>
          </view>
          <view class="card-footer">
            <view class="edit-btn" @tap="handleEdit(item._id)">
              重新编辑
            </view>
            <view class="footer-right">
              <view class="action-btn" @tap="handleVerificationList(item)">报名列表</view>
            </view>
          </view>
          </view>
          <view class="load-more-tip" v-if="displayList.length && (loading || !finish)">
            <text v-if="loading">加载中...</text>
            <text v-else>上拉加载更多</text>
          </view>
          <view class="scroll-bottom-placeholder" style="height: 20rpx"></view>
          <Transition name="empty-fade">
            <view class="empty" v-if="hasFetched && !loading && !displayList.length">
              <image class="empty-img"
                src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/noData.png" mode="widthFix">
              </image>
              <text class="empty-text">暂无数据</text>
            </view>
          </Transition>
        </view>
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

/* 活动列表 */
.content {
  flex: 1;
  width: 100%;

  .list-content {
    padding: 6rpx 8rpx 12rpx;
  }

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
  position: relative;
  padding: 24rpx;
  border-radius: 30rpx;
  background-color: #ffffff;
  @include customShadow();
  margin-bottom: 24rpx;
}

.delete-chip {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  z-index: 2;
  padding: 8rpx 22rpx;
  border: 1px solid rgba(255, 59, 59, 0.45);
  border-radius: 24rpx;
  background-color: rgba(255, 59, 59, 0.08);
  font-size: 24rpx;
  line-height: 1;
  color: #ff3b3b;
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
    box-sizing: border-box;
    padding-right: 116rpx;
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
  text-align: center;
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
}
</style>
