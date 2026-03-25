<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { getSafeAreaBottom, safeAreaBottom } from '@/utils/system-info.ts'
import { useUserStore } from '@/stores'
import { computed, ref } from 'vue'
import OrganizerInfo from '@/components/OrganizerInfo.vue'
import { tripDetailGetApi } from '@/api/trip.ts'
import type { PlayListItem } from '@/types/Play'
import { formatTimestamp } from '@/utils/generateMonth.ts'
import { userInfoGetApi } from '@/api/user.ts'
import type { UserItem } from '@/types/UserItem'
import { activityDetail } from '@/api/activity'
import type { ActivityListItem } from '@/types/Activity'
import { openLocation } from '@/composables/openLocation'
import { isSignUp, isVerify } from '@/composables/isVerifySignUp'
import type { OrderType } from '@/types/OrderItem'
import ProductDetailModal from './ProductDetailModal.vue'
import type { PosterCanvasData } from './posterCanvasDraw'
import { posterCodeApi } from '@/api/poster'

// 页面标题
const title = ref('详情')
const productId = ref<string>('')
const proType = ref('')

const userStore = useUserStore()

// 获取详情
const detailData = ref<PlayListItem | ActivityListItem>({} as PlayListItem | ActivityListItem)
const detailGet = async (id: string, proType: string) => {
  let res
  if (proType === 'activity') {
    res = await activityDetail(id)
    console.log('活动详情', res)
    detailData.value = res.data
  } else {
    res = await tripDetailGetApi(id)
    console.log('行程详情', res)
    detailData.value = res.data
  }
  await userInfoGet(res.data.userId as string)
}

// 获取用户信息
const userData = ref<UserItem>({} as UserItem)
const userInfoGet = async (userId: string) => {
  const res = await userInfoGetApi(userId)
  console.log('用户信息', res)
  userData.value = res.data
}

// 处理报名
const handleSign = () => {
  const totalPerson = Number(detailData.value.maleCount) + Number(detailData.value.femaleCount)
  // 跳转之前对人数进行判断
  if (totalPerson >= Number(detailData.value.maxPeople)) {
    uni.showToast({ icon: 'none', title: '当前行程人数已满', mask: true })
    return
  }
  uni.navigateTo({
    url: `/pages/signUp/signUp?productId=${detailData.value._id}&proType=${proType.value}`,
  })
}

onLoad(async (options: any) => {
  console.log('options:', options)
  // 获取页面参数
  if (options) {
    title.value = options.title
    productId.value = options.productId
    proType.value = options.proType
    await detailGet(productId.value, proType.value)
    await isSignUp(options?.productId, proType.value as OrderType, userStore.profile?._id as string)
  }
  // 获取底部安全区域高度
  getSafeAreaBottom()
})



// 复制微信号
const handleCopyWx = () => {
  if (!isVerify.value) {
    console.log('未报名')

    uni.showToast({ icon: 'none', title: '请报名后查看' })
    return
  }
  // 调用uni的剪贴板API
  uni.setClipboardData({
    data: detailData.value?.wechat as string, // 要复制的内容
    success: () => {
      // 复制成功的提示
      uni.showToast({
        title: '微信号复制成功',
        icon: 'success',
        duration: 2000, // 提示显示时长（毫秒）
      })
    },
    fail: (err) => {
      // 复制失败的提示
      console.error('复制失败：', err)
      uni.showToast({
        title: '复制失败，请重试',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

// 拨打电话
const handleCallPhone = () => {
  if (!isVerify.value) {
    console.log('未报名')

    uni.showToast({ icon: 'none', title: '请报名后查看' })
    return
  }
  uni.makePhoneCall({
    phoneNumber: detailData.value.phone as string,
  })
}

// 生成海报
const showPoster = ref(false)
const qrCodeUrl = ref('')
const handleGeneratePoster = async () => {
  const res = await posterCodeApi(
    userStore.profile?.referralCode as string,
    detailData.value._id as string,
    proType.value
  )
  if (res.data.qrCodeUrl) {
    qrCodeUrl.value = res.data.qrCodeUrl
    showPoster.value = true
    console.log(res.data.qrCodeUrl)
  } else {
    uni.showToast({ icon: 'none', title: '请稍微再试' })
  }
}

const defaultAvatar =
  'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/my/avatar.png'

/** 弹窗与 Canvas 海报共用数据 */
const posterData = computed<PosterCanvasData>(() => {
  const d = detailData.value
  const addr = [d.event_address, d.address_name].filter(Boolean).join(' ')
  return {
    avatarUrl: (userStore.profile?.avatarUrl as string) || defaultAvatar,
    nickname: (userStore.profile?.nickname as string) || '游客',
    coverUrl: (d.cover as string) || '',
    title: (d.title as string) || '',
    address: addr || '—',
    priceText: d.userFee != null ? `￥${d.userFee}` : '—',
    qrCodeUrl: qrCodeUrl.value || undefined,
  }
})

onShareAppMessage((res) => {
  if (res.from === 'button' && userStore.profile) {
    // 来自页面内按钮
    return {
      title: detailData.value.title,
      path: `/pages/login/login?inviterCode=${userStore.profile.referralCode}&productId=${productId.value}&proType=${proType.value}`,
      imageUrl: detailData.value.cover,
    }
  }
  // 默认分享
  return {
    title: detailData.value.title,
    path: `/pages/productDetail/productDetail?inviterCode=${userStore.profile?.referralCode}`,
    imageUrl: detailData.value.cover,
  }
})
</script>

<template>
  <view class="playDetail">
    <NavHead :title="title" :show-back="true"></NavHead>
    <!--  滚动内容区域  -->
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="body">
        <!-- 商品信息 -->
        <view class="productInfo">
          <view class="top">
            <view class="cover">
              <image mode="aspectFill" :src="detailData.cover as string"></image>
            </view>
            <view class="info">
              <view class="title-row">
                <view class="title">{{ detailData.title }}</view>
                <view class="poster-btn" @tap="handleGeneratePoster">生成海报</view>
              </view>
              <view class="location-info">
                <view class="time">
                  <text class="iconfont icon-shijian1"></text>
                  <text>{{ formatTimestamp(detailData.time!, 2) }}</text>
                </view>
                <view class="address">
                  <text class="iconfont icon-fangzi"></text>
                  <text>{{ detailData.address_name }}</text>
                </view>
                <view class="address">
                  <text class="iconfont icon-address"></text>
                  <text>{{ detailData.event_address }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="bottom">
            <view class="row">
              <view class="text">报名费用</view>
              <view class="value">￥{{ detailData.userFee }}</view>
            </view>
            <view class="row" v-if="userStore.profile?.role === 'manager'">
              <view class="text">佣金</view>
              <view class="value">￥{{ detailData.commission }}</view>
            </view>
          </view>
        </view>

        <!-- 商户信息 -->
        <view class="shopInfo">
          <view class="top">
            <view class="left">
              <view class="title">{{ detailData.address_name }}</view>
              <view class="address">{{ detailData.event_address }}</view>
            </view>
            <view class="right"
              @tap="openLocation(detailData.latitude as number, detailData.longitude as number, detailData.address_name as string, detailData?.event_address as string)">
              <text class="iconfont icon-ditu"></text>
              <view class="text">地图</view>
            </view>
          </view>
          <view class="bottom">
            <view class="signUp">已报名（{{ Number(detailData.maleCount) + Number(detailData.femaleCount) }}/{{
              detailData.maxPeople
            }}）</view>
            <view class="num">
              <view class="item">
                <text class="male">男</text>
                <text class="count">{{ detailData.maleCount }}人</text>
              </view>
              <view class="item">
                <text class="female">女</text>
                <text class="count">{{ detailData.femaleCount }}人</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 组织方 -->
        <OrganizerInfo :userData="userData" @copyWx="handleCopyWx" @callPhone="handleCallPhone"></OrganizerInfo>
        <!-- 活动介绍 -->
        <view class="activity">
          <view class="title">活动介绍</view>
          <view class="content" v-if="detailData.requirement">{{ detailData.requirement }}</view>
          <view class="images" v-for="(item, index) in detailData.images" :key="index">
            <image mode="widthFix" :src="item"></image>
          </view>
        </view>
        <!-- 底部占位，防止阴影被裁剪 -->
        <view class="scroll-bottom-placeholder"></view>
      </view>
    </scroll-view>
    <!--  底部操作区  -->
    <view class="footerBar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <button class="share" open-type="share">
        <view class="icon">
          <image mode="aspectFill" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/share.png">
          </image>
        </view>
        <view>分享</view>
      </button>
      <!--   报名按钮   -->
      <view class="sign" @tap="handleSign">行程报名</view>
    </view>
    <!-- 生成海报弹窗（内容由你后续填充） -->
    <ProductDetailModal v-model="showPoster" :poster="posterData" :qr-code-url="qrCodeUrl" />
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.playDetail {
  padding-bottom: 180rpx;
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background();
}

/* 内容区域 scroll */
.content {
  flex: 1;

  .body {
    padding: 24rpx;
  }

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

/* 商品信息卡片 */
.productInfo {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  .top {
    padding-bottom: 24rpx;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    .cover {
      width: 192rpx;
      height: 215rpx;
      background: $qs-font-dec;
      border-radius: 24rpx;
      overflow: hidden;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 24rpx;

      .location-info {
        .time {
          margin-top: 0;
        }
      }

      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16rpx;

        .title {
          flex: 1;
          font-weight: bold;
          font-size: 28rpx;
          color: $qs-font-title;
          line-height: 1.4;
          @include ellipsis(2);
        }

        .poster-btn {
          flex-shrink: 0;
          margin-left: 16rpx;
          text-align: center;
          width: 130rpx;
          height: 44rpx;
          line-height: 44rpx;
          background: $qs-brandColor;
          border-radius: 22rpx;
          font-size: 22rpx;
          color: $qs-font-title;
        }
      }

      .time,
      .address {
        display: flex;
        align-items: flex-start;
        font-size: 24rpx;
        color: $qs-font-dec;

        .iconfont {
          width: 32rpx;
          margin-right: 8rpx;
          font-size: 28rpx;
          text-align: center;
        }

        text:last-child {
          flex: 1;
          @include ellipsis(2);
        }
      }

      .time {
        margin-top: 16rpx;
      }

      .address {
        margin-top: 12rpx;
      }
    }
  }

  .bottom {
    margin-top: 16rpx;

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .text {
        font-size: 28rpx;
        color: $qs-font-title;
        font-weight: bold;
      }

      .value {
        font-weight: bold;
        font-size: 28rpx;
        color: #ff3434;
      }
    }
  }
}

/* 商户信息卡片 */
.shopInfo {
  margin-top: 24rpx;
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();

  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 20rpx;
    border-bottom: 1px solid #f5f5f5;

    .left {
      flex: 1;
      margin-right: 24rpx;

      .title {
        font-size: 28rpx;
        font-weight: bold;
        color: $qs-font-title;
        margin-bottom: 12rpx;
      }

      .address {
        font-size: 24rpx;
        color: $qs-font-dec;
        line-height: 1.5;
        @include ellipsis(2);
      }
    }

    .right {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      .iconfont {
        font-size: 40rpx;
        color: #f7821a;
      }

      .text {
        margin-top: 4rpx;
        font-size: 24rpx;
        color: $qs-font-dec;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;

    .signUp {
      font-size: 26rpx;
      color: $qs-font-title;
    }

    .num {
      display: flex;
      gap: 24rpx;

      .item {
        display: flex;
        align-items: center;
        font-size: 26rpx;

        .male {
          color: #5b9bd5;
        }

        .female {
          color: #ff8fab;
        }

        .count {
          color: $qs-font-title;
        }
      }
    }
  }
}

/* 活动介绍卡片 */
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
}

/* 底部操作区域 */
.footerBar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx 24rpx;
  background: $qs-card-bg;
  border-top: 1px solid #f1f1f1;

  .share {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
    color: $qs-font-dec;
    background-color: transparent;

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
    background-color: $qs-brandColor;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
  }
}
</style>
