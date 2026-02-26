<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import FilterBar from '@/components/FilterBar.vue'
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import NavTitle from '@/components/NavTitle.vue'

const cateData = ref([
  { _id: '01', cateName: '亲子' },
  { _id: '02', cateName: '社交' },
  { _id: '03', cateName: '定制' },
  { _id: '04', cateName: '银发' },
])

const handleSend = () => {
  uni.navigateTo({
    url: '/pages/public/public',
  })
}
</script>
<template>
  <view class="play">
    <NavHead title="趣哪•游 " :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  发布  -->
      <view class="banner" @tap="handleSend">
        <image
          class="img"
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/fbxc.jpg"
          mode="aspectFill"
        ></image>
      </view>
      <!--  title    -->
      <view class="title">
        <NavTitle title="发现有趣好玩的行程"></NavTitle>
      </view>
      <!--   筛选   -->
      <view class="filter">
        <FilterBar :cateData="cateData" title="所有行程"></FilterBar>
      </view>
      <!--   行程列表   -->
      <view class="list">
        <ProductCard></ProductCard>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
/* 页面容器 */
.play {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include page-background(); /* 渐变背景 */
}

/* 内容区域 */
.content {
  flex: 1;

  /* 顶部横幅 */
  .banner {
    padding: 0 24rpx;
    width: 100%;
    height: 240rpx;
  }

  /* 页面标题 */
  .title {
    padding: 0 24rpx;
    margin: 30rpx 0;
    color: $qs-font-title;
    font-weight: bold;
  }

  /* 行程列表 */
  .list {
    padding: 0 24rpx 60rpx;
    margin-top: 30rpx;
  }
}
</style>
