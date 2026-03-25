<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref } from 'vue'
import {
  drawPosterOnCanvas,
  POSTER_HEIGHT,
  POSTER_WIDTH,
  type PosterCanvasData,
} from './posterCanvasDraw'

const props = defineProps<{
  /** 海报基础数据 */
  poster: PosterCanvasData
  /** 接口返回的二维码地址（与 poster.qrCodeUrl 二选一或同时传，保证小程序里能稳定更新） */
  qrCodeUrl?: string
}>()

/** 弹窗与画布统一用的二维码地址 */
const qrSrc = computed(() => (props.qrCodeUrl || props.poster.qrCodeUrl || '').trim())

const modelValue = defineModel<boolean>({ default: false })

/** setup 同步阶段缓存，事件回调里 getCurrentInstance() 会为 null */
const instance = getCurrentInstance()

const saving = ref(false)

const handleMaskTap = () => {
  modelValue.value = false
}

const handleSavePoster = async () => {
  if (saving.value) return
  const inst = instance?.proxy
  if (!inst) {
    uni.showToast({ icon: 'none', title: '请稍后重试' })
    return
  }
  saving.value = true
  uni.showLoading({ title: '生成中…', mask: true })
  try {
    await nextTick()
    const tempPath = await new Promise<string>((resolve, reject) => {
      const q = uni.createSelectorQuery().in(inst) as any
      q.select('#pdmPosterCanvas')
        .fields({ node: true, size: true })
        .exec((res: { node?: any }[]) => {
          void (async () => {
            try {
              const canvas = res[0]?.node as any
              if (!canvas?.getContext) {
                reject(new Error('canvas 节点未就绪'))
                return
              }
              const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
              const dpr = uni.getSystemInfoSync().pixelRatio || 2
              canvas.width = POSTER_WIDTH * dpr
              canvas.height = POSTER_HEIGHT * dpr
              ctx.scale(dpr, dpr)
              await drawPosterOnCanvas(canvas, ctx, {
                ...props.poster,
                qrCodeUrl: qrSrc.value || props.poster.qrCodeUrl,
              })
              uni.canvasToTempFilePath(
                {
                  canvas,
                  fileType: 'png',
                  quality: 1,
                  success: (r: UniApp.CanvasToTempFilePathRes) => resolve(r.tempFilePath),
                  fail: (e: UniApp.GeneralCallbackResult) => reject(e),
                } as any,
                inst,
              )
            } catch (e) {
              reject(e)
            }
          })()
        })
    })
    await new Promise<void>((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath: tempPath,
        success: () => resolve(),
        fail: (e) => reject(e),
      })
    })
    uni.showToast({ icon: 'success', title: '已保存到相册' })
  } catch (e: unknown) {
    console.error('海报保存失败', e)
    const msg = e && typeof e === 'object' && 'errMsg' in e ? String((e as { errMsg?: string }).errMsg) : ''
    if (msg.includes('auth') || msg.includes('deny') || msg.includes('permission')) {
      uni.showModal({
        title: '需要相册权限',
        content: '请在设置中允许保存到相册',
        confirmColor: '#eed261',
        success: (r) => {
          if (r.confirm) uni.openSetting()
        },
      })
    } else {
      uni.showToast({ icon: 'none', title: '保存失败，请重试' })
    }
  } finally {
    uni.hideLoading()
    saving.value = false
  }
}
</script>

<template>
  <view v-if="modelValue" class="pdm-overlay">
    <view class="pdm-mask" @tap="handleMaskTap"></view>
    <view class="pdm-center" @tap.stop>
      <view class="pdm-box">
        <!-- 上 -->
        <view class="top">
          <view class="bg">
            <!-- 用户信息 -->
            <view class="userInfo">
              <image class="avatar" :src="poster.avatarUrl" mode="scaleToFill" />
              <view class="nickname">{{ poster.nickname }}</view>
            </view>
            <image class="tag" src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/share/t02.png"
              mode="scaleToFill" />
            <!-- 产品封面图 -->
            <view class="cover">
              <image :src="poster.coverUrl" mode="aspectFill" />
            </view>
            <!-- 产品信息 -->
            <view class="productInfo">
              <view class="name">{{ poster.title }}</view>
              <view class="address">{{ poster.address }}</view>
            </view>
            <!-- 价格 -->
            <view class="price">{{ poster.priceText }}</view>
          </view>
        </view>
        <!-- 底部 -->
        <view class="bottom">
          <view class="left">
            <image src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/share/t01.png"
              mode="scaleToFill" />
          </view>
          <view class="right">
            <view class="code">
              <image v-if="qrSrc" class="code-img" :src="qrSrc" mode="aspectFit" />
            </view>
            <view class="text">扫码查看</view>
          </view>
        </view>
      </view>
      <!-- 下载保存：使用 Canvas 绘制同结构海报后保存 -->
      <view class="save" :class="{ disabled: saving }" @tap.stop="handleSavePoster">
        {{ saving ? '生成中…' : '下载海报' }}
      </view>
    </view>
    <!-- 离屏 canvas，与 POSTER_WIDTH/HEIGHT 逻辑像素一致 -->
    <canvas id="pdmPosterCanvas" type="2d" class="poster-canvas-hidden"
      :style="{ width: POSTER_WIDTH + 'px', height: POSTER_HEIGHT + 'px' }" />
  </view>
</template>

<style scoped lang="scss">
/* 仅负责滚动；垂直居中交给 .pdm-center（min-height + flex），避免贴顶又保留长内容可滚动 */
.pdm-overlay {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.pdm-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.45);
}

/* 全屏占位在遮罩之上，否则半透明区域点不到 mask；用 pointer-events 让空白处穿透到遮罩 */
.pdm-center {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  padding: calc(32rpx + env(safe-area-inset-top)) 48rpx calc(32rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.pdm-box {
  pointer-events: auto;
  width: 100%;
  max-width: 640rpx;
  height: 1000rpx;
  background: $qs-card-bg;
  border-radius: 4rpx;
  overflow: hidden;

  .top {
    padding: 60rpx 40rpx 20rpx;
    height: 860rpx;
    background: linear-gradient(to bottom, #ffeba4, #ffffff);

    .bg {
      position: relative;
      padding: 48rpx;
      height: 100%;
      background: url(https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/share/bg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;

      /*用户信息*/
      .userInfo {
        display: flex;
        align-items: center;
        height: 80rpx;

        .avatar {
          margin-right: 16rpx;
          width: 45rpx;
          height: 45rpx;
          border-radius: 50%;
        }

        .nickname {
          font-size: 28rpx;
          color: $qs-font-title;
        }
      }

      /*产品封面*/
      .cover {
        width: 100%;
        height: 400rpx;
      }

      /*产品信息*/
      .productInfo {
        margin-top: 16rpx;

        .name {
          font-size: 28rpx;
          color: $qs-font-title;
          font-weight: bold;
        }

        .address {
          font-size: 24rpx;
          color: $qs-font-dec2;
        }
      }

      /*产品价格（与 posterCanvasDraw 价格区 margin/padding 对应）*/
      .price {
        margin-top: 48rpx;
        margin-bottom: 20rpx;
        padding-left: 16rpx;
        padding-right: 16rpx;
        box-sizing: border-box;
        text-align: end;
        color: $qs-font-title;
        font-size: 28rpx;
        font-weight: bold;
      }

      /*标签*/
      .tag {
        position: absolute;
        right: 20rpx;
        top: -20rpx;
        width: 185rpx;
        height: 120rpx;
      }
    }
  }

  .bottom {
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 140rpx;
    background-color: $qs-brandColor;

    /*UI插图*/
    .left {
      width: 400rpx;
      height: 100rpx;
    }

    /*二维码*/
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;

      .code {
        margin-bottom: 8rpx;
        width: 70rpx;
        height: 70rpx;
        background-color: #ffffff;
        overflow: hidden;
        border-radius: 4rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .code-img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .text {
        font-size: 20rpx;
        font-weight: bold;
        color: $qs-font-title;
      }
    }
  }
}

.save {
  pointer-events: auto;
  margin-top: 32rpx;
  width: 100%;
  max-width: 640rpx;
  height: 88rpx;
  background: $qs-brandColor;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  color: $qs-font-title;

  &.disabled {
    opacity: 0.7;
  }
}

/* 离屏绘制，不参与布局占位 */
.poster-canvas-hidden {
  position: fixed;
  left: -3000px;
  top: 0;
  pointer-events: none;
}
</style>
