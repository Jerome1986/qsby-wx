<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import { ref } from 'vue';


const cover = ref('https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/qiansubaiyuan.jpg')
// 品牌配图（可替换为实际图片 URL）
const brandImages = [

  'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/02.jpg',
  'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/brand/03.jpg',
]
</script>

<template>
  <view class="brand">
    <NavHead title="千宿百院" :show-back="false" />
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view style="padding: 24rpx;">
        <!-- 封面 + 主标题 -->
        <view class="hero-card">
          <view class="hero-cover">
            <image :src="cover" mode="aspectFill" />
            <view class="hero-mask"></view>
            <view class="hero-title">千宿百院</view>
            <view class="hero-subtitle">品牌介绍</view>
          </view>
        </view>

        <!-- 开篇 -->
        <view class="card intro-card">
          <view class="card-content">
            千宿百院，作为国内文旅住宿领域的创新型集团品牌，专注于文化旅游与住宿体验的深度融合，以「盘活闲置资产、赋能乡村振兴、创造多元价值」为核心使命，构建集民宿开发、投资、度假村及酒店运营管理、文化旅游、品牌运营于一体的全产业链生态，为游客打造沉浸式文旅生活新体验，为行业注入可持续发展新动能。
          </view>
        </view>

        <!-- 一、品牌核心 -->
        <view class="card section-card">
          <view class="section-header">
            <view class="section-num">01</view>
            <view class="section-title">品牌核心：盘活闲置，唤醒价值</view>
          </view>
          <view class="card-content">
            《千宿百院》深耕「闲置资产活化」赛道，聚焦乡村空心村、闲置农房、城镇烂尾楼等沉睡资源，通过自有资金投入、专业规划设计与精细化运营，将「闲置空间」转化为「文旅精品」。
          </view>
          <view class="bullet-list">
            <view class="bullet-item">在乡村，保留老建筑的乡土肌理与文化记忆，改造为兼具在地风情与现代舒适的民宿集群；</view>
            <view class="bullet-item">在城镇，挖掘闲置楼宇的区位价值与人文潜力，升级为融合生活美学与社交属性的旅居空间。</view>
          </view>
          <view class="card-content">
            通过「变废为宝」的创新实践，千宿百院让每一处空间重焕生机，既守护了文化根脉，又为区域文旅发展注入新活力。
          </view>
        </view>

        <!-- 二、品牌特色 -->
        <view class="card section-card">
          <view class="section-header">
            <view class="section-num">02</view>
            <view class="section-title">品牌特色：社交+民宿+主理人</view>
          </view>
          <view class="card-content highlight">
            《千宿百院》以「社交+民宿+主理人」模式为核心竞争力，构建「游客-主理人-品牌」三方共赢的生态体系。
          </view>
          <view class="sub-block">
            <view class="sub-title">1. 主理人赋能，激发创业活力</view>
            <view class="card-content">
              品牌为有情怀、有创意的主理人提供民宿空间、运营指导、资源对接等全方位赋能，让主理人成为民宿的「创业者」。主理人可以通过我们千宿百院旗下所有门店去赚钱。一句话总结：我出房子，你出力，利润你拿，我们就是帮所有主理人去创业，民宿所有投入资金均由我们千宿百院负责。
            </view>
          </view>
          <view class="sub-block">
            <view class="sub-title">2. 社交场景营造，深化体验价值</view>
            <view class="card-content">
              突破传统住宿的功能局限，在民宿及周边空间打造露营派对、手作工坊、在地美食市集、文化沙龙等社交场景，让游客在住宿之外，能结识同好、深度互动，从「住下来」到「留下来」，感受更有温度的旅行。
            </view>
          </view>
          <view class="sub-block">
            <view class="sub-title">3. 标杆项目引领，多元业态布局</view>
            <view class="card-content">
              过去一年中，千宿百院已成功打造多家「乡村共享部落」及标杆性民宿品牌，涵盖乡村度假、古镇旅居、自然疗愈等多元场景。每一个项目既是游客的「心灵栖息地」，也是主理人的「创业舞台」，更是区域文旅的「流量引擎」。
            </view>
          </view>
        </view>

        <!-- 三、品牌愿景 -->
        <view class="card section-card">
          <view class="section-header">
            <view class="section-num">03</view>
            <view class="section-title">品牌愿景：让住宿有温度，让乡村有未来</view>
          </view>
          <view class="card-content">
            《千宿百院》始终以「文化赋能住宿，住宿激活乡村」为愿景，致力于成为文旅融合与乡村振兴的领军品牌。未来，品牌将持续拓展版图，以更多元的业态、更创新的模式、更优质的服务，连接人与空间、人与文化、人与人，让每一处闲置资产都成为价值载体，让每一位主理人都能实现创业理想，让每一位游客都能在旅途中遇见美好、收获温暖。
          </view>
        </view>

        <!-- 配图 -->
        <view class="card images-card">
          <view class="card-title">品牌风采</view>
          <view class="images-grid">
            <view class="image-item" v-for="(img, index) in brandImages" :key="index">
              <image :src="img" mode="aspectFill" />
            </view>
          </view>
        </view>

        <view class="scroll-bottom-placeholder"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.brand {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  @include page-background();
}

.content {
  flex: 1;

  .scroll-bottom-placeholder {
    height: 20rpx;
  }
}

/* 卡片通用 */
.card {
  padding: 24rpx;
  background-color: $qs-card-bg;
  border-radius: 24rpx;
  @include customShadow();
  margin-top: 24rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: bold;
  color: $qs-font-title;
  margin-bottom: 20rpx;
}

.card-content {
  font-size: 26rpx;
  color: $qs-font-dec;
  line-height: 1.85;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.highlight {
    color: $qs-font-title;
    font-weight: 500;
  }
}

/* 封面 hero */
.hero-card {
  margin-top: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.hero-cover {
  position: relative;
  width: 100%;
  height: 360rpx;
  border-radius: 24rpx;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
  }

  .hero-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%);
  }

  .hero-title {
    position: absolute;
    left: 24rpx;
    bottom: 48rpx;
    font-size: 44rpx;
    font-weight: bold;
    color: #ffffff;
    letter-spacing: 4rpx;
  }

  .hero-subtitle {
    position: absolute;
    left: 24rpx;
    bottom: 20rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 章节卡片 */
.section-card {
  .section-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;
  }

  .section-num {
    width: 56rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    font-size: 24rpx;
    font-weight: bold;
    color: #ffffff;
    background: $qs-brandColor;
    border-radius: 12rpx;
    flex-shrink: 0;
  }

  .section-title {
    flex: 1;
    font-size: 30rpx;
    font-weight: bold;
    color: $qs-font-title;
    line-height: 1.4;
  }

  .sub-block {
    margin-top: 24rpx;
    padding-left: 20rpx;
    border-left: 4rpx solid $qs-brandColor;
  }

  .sub-title {
    font-size: 26rpx;
    font-weight: 600;
    color: $qs-font-title;
    margin-bottom: 12rpx;
  }

  .bullet-list {
    margin: 16rpx 0 20rpx;
  }

  .bullet-item {
    position: relative;
    padding-left: 24rpx;
    font-size: 26rpx;
    color: $qs-font-dec;
    line-height: 1.85;
    margin-bottom: 12rpx;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 14rpx;
      width: 8rpx;
      height: 8rpx;
      background: $qs-brandColor;
      border-radius: 50%;
    }
  }
}

/* 配图 */
.images-card {
  .images-grid {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .image-item {
    width: 100%;
    height: 360rpx;
    border-radius: 16rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
