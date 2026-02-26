<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'
import BookFlow from '@/components/BookFlow.vue'
import Note from '@/components/Note.vue'
import ImageTextDetail from '@/components/ImageTextDetail.vue'
import BottomActionBar from '@/components/BottomActionBar.vue'
</script>
<template>
  <view class="shopProductDetail">
    <NavHead title="商品详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <!--  封面图  -->
      <view class="cover">
        <image
          src="https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/cover.jpg"
          mode="aspectFill"
        ></image>
      </view>
      <!--  商品名称  -->
      <view class="productInfo">
        <NavTitle title="湖景大床房"></NavTitle>
      </view>
      <!--  商品信息  -->
      <BookFlow type="product"></BookFlow>
      <!--  预约须知  -->
      <Note></Note>
      <!--  图文详情    -->
      <ImageTextDetail></ImageTextDetail>
      <!-- 底部占位，防止内容被操作栏遮挡 -->
      <view class="action-bar-placeholder"></view>
    </scroll-view>
    <!--  底部操作栏  -->
    <BottomActionBar page-type="product"></BottomActionBar>
  </view>
</template>

<style scoped lang="scss">
.shopProductDetail {
  display: flex;
  flex-direction: column;
  padding: 24rpx 24rpx 60rpx 24rpx;
  height: 100%;
  @include page-background();
}

.content {
  flex: 1;
  /*封面图*/
  .cover {
    height: 400rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }
  /*产品信息*/
  .productInfo {
    margin-top: 20rpx;
  }
}

/* 底部操作栏占位 */
.action-bar-placeholder {
  height: calc(130rpx + env(safe-area-inset-bottom));
}
</style>
