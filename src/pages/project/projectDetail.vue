<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref, computed } from 'vue'
import { safeAreaBottom, getSafeAreaBottom } from '@/utils/system-info'
import OrganizerInfo from '@/components/OrganizerInfo.vue'
import { projectAllCateGetApi, projectDetailGetApi } from '@/api/project'
import { userInfoGetApi } from '@/api/user'
import { useUserStore } from '@/stores'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import type { ProjectItem } from '@/types/Project'
import type { UserItem } from '@/types/UserItem'
import { verifySignUpApi } from '@/api/verifySignUp'
import type { OrderType } from '@/types/OrderItem'
import type { PublicType } from '@/types/PublicManagement'

const userStore = useUserStore()
const projectId = ref('')
const detailData = ref<ProjectItem | null>(null)
const userData = ref<UserItem | null>(null)
const loading = ref(true)

// 分类映射
const industryMap = ref<Record<string, string>>({})
const modeMap = ref<Record<string, string>>({})
const scaleMap = ref<Record<string, string>>({})
const industryName = computed(() =>
  detailData.value ? industryMap.value[detailData.value.industry] ?? '-' : '-',
)
const modeName = computed(() =>
  detailData.value ? modeMap.value[detailData.value.cooperationMode] ?? '-' : '-',
)
const scaleName = computed(() =>
  detailData.value ? scaleMap.value[detailData.value.cooperationScale] ?? '-' : '-',
)

const fetchDetail = async () => {
  if (!projectId.value) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const [projectRes, cateRes] = await Promise.all([
      projectDetailGetApi(projectId.value),
      projectAllCateGetApi(),
    ])
    detailData.value = projectRes.data
    industryMap.value = Object.fromEntries(cateRes.data.typeList.map((item) => [item._id, item.name]))
    modeMap.value = Object.fromEntries(cateRes.data.modeList.map((item) => [item._id, item.name]))
    scaleMap.value = Object.fromEntries(cateRes.data.scaleList.map((item) => [item._id, item.name]))
    if (detailData.value?.userId) {
      const userRes = await userInfoGetApi(detailData.value.userId)
      userData.value = userRes.data
    }
  } catch {
    detailData.value = null
  } finally {
    loading.value = false
  }
}

// 验证是否报名
const isVerify = ref(false)
const isSignUp = async (targetId: string, proType: OrderType) => {

  const res = await verifySignUpApi(
    proType as PublicType,
    targetId,
    userStore.profile?._id as string
  )
  console.log('报名结果', res)

  isVerify.value = res.data.isSignUp
}

onLoad((options) => {
  getSafeAreaBottom()
  projectId.value = options?.projectId ?? ''
  isSignUp(projectId.value, 'project')
  fetchDetail()
})

// 打开地图
const handleOpenMap = () => {
  const d = detailData.value
  if (!d?.latitude || !d?.longitude) {
    uni.showToast({ icon: 'none', title: '暂无位置信息' })
    return
  }
  uni.openLocation({
    latitude: d.latitude,
    longitude: d.longitude,
    name: d.address_name ?? d.event_address ?? '项目位置',
    address: d.event_address ?? '',
  })
}

// 复制微信
const handleCopyWx = () => {
  const wx = detailData.value?.wechat
  if (!wx || !isVerify.value) {
    uni.showToast({ icon: 'none', title: '当前无权限，请先获取再复制' })
    return
  }

  uni.setClipboardData({
    data: wx,
    success: () => uni.showToast({ icon: 'success', title: '已复制微信号' }),
  })
}

// 拨打电话
const handleCallPhone = () => {
  const phone = detailData.value?.phone
  if (!phone || !isVerify.value) {
    uni.showToast({ icon: 'none', title: '当前无权限，请先获取再联系' })
    return
  }
  uni.makePhoneCall({ phoneNumber: phone })
}

// 跳转项目发布支付页面
const handleUnlock = () => {
  if (userStore.profile?._id === detailData.value?.userId) {
    uni.showToast({ icon: 'none', title: '当前项目为本人发布，无须获取' })
    return
  }
  uni.navigateTo({
    url: `/pages/project/checkProject?projectId=${projectId.value}`,
  })
}

onShareAppMessage((res) => {
  const title = detailData.value?.title ?? '有趣的项目'
  const imageUrl = detailData.value?.cover
  // 来自页面内按钮且已登录：先跳登录页（新用户可绑定邀请关系），登录后自动跳项目详情
  if (res.from === 'button' && userStore.profile) {
    return {
      title,
      path: `/pages/login/login?inviterCode=${userStore.profile.referralCode}&projectId=${projectId.value}`,
      imageUrl,
    }
  }
  // 默认分享（如右上角菜单）：直接跳项目详情
  const query = `projectId=${projectId.value}${userStore.profile?.referralCode ? `&inviterCode=${userStore.profile.referralCode}` : ''}`
  return {
    title,
    path: `/pages/project/projectDetail?${query}`,
    imageUrl,
  }
})
</script>
<template>
  <view class="projectDetail">
    <NavHead title="项目详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="detailData" style="padding: 24rpx;">
        <!-- 产品信息 + 位置信息（恢复原布局） -->
        <view class="product-card">
          <view class="product-top">
            <view class="cover">
              <image mode="aspectFill"
                :src="detailData.cover || 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/cover.jpg'">
              </image>
            </view>
            <view class="product-info">
              <view class="name">{{ detailData.title }}</view>
              <view class="detail-item">
                <text class="label">行业类别：</text>
                <text class="value">{{ industryName }}</text>
              </view>
              <view class="detail-item">
                <text class="label">合作方式：</text>
                <text class="value">{{ modeName }}</text>
              </view>
              <view class="detail-item">
                <text class="label">合作规模：</text>
                <text class="value">{{ scaleName }}</text>
              </view>
            </view>
          </view>
          <!-- 位置信息 -->
          <view class="location-row" v-if="detailData.address_name || detailData.event_address" @tap="handleOpenMap">
            <view class="location-left">
              <view class="loc-name">{{ detailData.address_name || '项目位置' }}</view>
              <view class="loc-address">{{ detailData.event_address || '' }}</view>
            </view>
            <view class="location-right">
              <text class="iconfont icon-address"></text>
              <text class="map-text">地图</text>
            </view>
          </view>
        </view>

        <!-- 组织方 -->
        <OrganizerInfo v-if="userData" :userData="userData" @copyWx="handleCopyWx" @callPhone="handleCallPhone">
        </OrganizerInfo>

        <!-- 项目介绍（与 productDetail activity 同步） -->
        <view class="activity">
          <view class="title">项目介绍</view>
          <view class="content" v-if="detailData.introduction">{{ detailData.introduction }}</view>
          <view class="images" v-for="(item, index) in (detailData.images || [])" :key="index">
            <image mode="widthFix" :src="item"></image>
          </view>
          <view v-if="!detailData.introduction && !detailData.images?.length" class="empty-tip">暂无介绍</view>
        </view>
      </view>
      <view v-else class="empty">项目不存在</view>

      <!-- 底部占位 -->
      <view class="scroll-bottom-placeholder"></view>
    </scroll-view>

    <!-- 底部操作区（与 productDetail footerBar 同步） -->
    <view class="footerBar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <button class="share" open-type="share">
        <view class="icon">
          <image mode="aspectFill" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/share.png">
          </image>
        </view>
        <view>分享</view>
      </button>
      <view v-if="!isVerify" class="sign" @tap="handleUnlock">获取项目发布人</view>
      <view class="sign disable" v-else>已获取</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器（与 productDetail 同步） */
.projectDetail {
  padding-bottom: 180rpx;
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

/* 内容区域 scroll */
.content {
  flex: 1;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

.loading,
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  font-size: 28rpx;
  color: $qs-font-dec;
}

/* 产品信息 + 位置信息卡片（恢复原布局） */
.product-card {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  .product-top {
    display: flex;
    gap: 20rpx;
    padding-bottom: 24rpx;
    border-bottom: 1rpx solid $qs-border;

    .cover {
      width: 192rpx;
      height: 215rpx;
      border-radius: 10rpx;
      overflow: hidden;
      flex-shrink: 0;
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 215rpx;

      .name {
        font-size: 32rpx;
        font-weight: bold;
        color: $qs-font-title;
        line-height: 1.4;
        @include ellipsis(2);
      }

      .detail-item {
        font-size: 28rpx;
        color: $qs-font-dec2;
      }
    }
  }

  .location-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24rpx;

    .location-left {
      flex: 1;
      margin-right: 20rpx;

      .loc-name {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        margin-bottom: 8rpx;
      }

      .loc-address {
        font-size: 24rpx;
        color: $qs-font-dec;
        @include ellipsis(1);
      }
    }

    .location-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;

      .iconfont {
        font-size: 40rpx;
        color: $qs-brandColor;
      }

      .map-text {
        font-size: 22rpx;
        color: $qs-font-dec;
        margin-top: 4rpx;
      }
    }
  }
}

/* 活动介绍卡片（与 productDetail activity 同步） */
.activity {
  margin-top: 24rpx;
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  .title {
    font-size: 28rpx;
    font-weight: bold;
    color: $qs-font-title;
    margin-bottom: 20rpx;
  }

  .content {
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.8;
    margin-bottom: 20rpx;
  }

  .images {
    margin-top: 16rpx;

    image {
      width: 100%;
      border-radius: 16rpx;
    }
  }

  .empty-tip {
    font-size: 26rpx;
    color: $qs-font-dec;
  }
}

/* 底部操作区域（与 productDetail footerBar 同步） */
.footerBar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border-top: 1px solid #f1f1f1;

  .share {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
    color: $qs-font-dec;
    background-color: transparent;
    padding: 0;
    border: none;

    .icon {
      width: 46rpx;
      height: 39rpx;
      margin-bottom: 4rpx;
    }
  }

  .sign {
    flex: 1;
    margin-left: 40rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background: #ffd018;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }

  .disable {
    background: $qs-font-dec2;
  }
}
</style>
