<script setup lang="ts">
import NavHead from '@/components/NavHead.vue'
import NavTitle from '@/components/NavTitle.vue'
import BookFlow from '@/components/BookFlow.vue'
import Note from '@/components/Note.vue'
import ImageTextDetail from '@/components/ImageTextDetail.vue'
import BottomActionBar from '@/components/BottomActionBar.vue'
import { ref } from 'vue'
import { shopPorductByOne } from '@/api/store'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import type { ProductItem } from '@/types/store'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const producntData = ref<ProductItem>()
const productId = ref('')
const inviterCode = ref('')

const buildShareQuery = (query: Record<string, string | undefined>) => {
  return Object.entries(query)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
    .join('&')
}

const getShopProductSharePath = () => {
  const query = buildShareQuery({
    productId: productId.value,
    proType: 'shop',
    inviterCode: userStore.profile?.referralCode,
  })
  return query ? `/pages/shop/shopProductDetail?${query}` : '/pages/shop/shopProductDetail'
}

const productGet = async (productId: string) => {
  const res = await shopPorductByOne(productId)
  console.log('产品', res)

  producntData.value = res.data
}


onLoad((options) => {
  console.log('参数', options)

  if (options?.productId) {
    productId.value = options.productId
    productGet(productId.value)
  }
  inviterCode.value = options?.inviterCode || ''
})

onShareAppMessage(() => {
  return {
    title: producntData.value?.name || '千宿百院',
    path: getShopProductSharePath(),
    imageUrl: producntData.value?.cover,
  }
})

</script>
<template>
  <view class="shopProductDetail">
    <NavHead title="商品详情" :show-back="true"></NavHead>
    <scroll-view class="content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view style="padding: 24rpx;">
        <!--  封面图  -->
        <view class="cover">
          <image :src="producntData?.cover" mode="aspectFill"></image>
        </view>
        <!--  商品名称  -->
        <view class="productInfo">
          <NavTitle :title="producntData?.name as string"></NavTitle>
        </view>
        <!--  商品信息  -->
        <BookFlow
          type="product"
          :price="producntData?.price"
          :spec-label="producntData?.specLabel"
          :commission="producntData?.commission"
        ></BookFlow>
        <!--  预约须知  -->
        <Note :store-id="producntData?.storeId"></Note>
        <!--  图文详情    -->
        <ImageTextDetail :images="producntData?.images || []" :description="producntData?.description || ''">
        </ImageTextDetail>
        <!-- 底部占位，防止内容被操作栏遮挡 -->
        <view class="action-bar-placeholder"></view>
      </view>
    </scroll-view>
    <!--  底部操作栏  -->
    <BottomActionBar
      page-type="product"
      :price="producntData?.price"
      :spec-label="producntData?.specLabel"
      :product-id="producntData?._id"
      :inviter-code="inviterCode"
      :show-group="false"
    ></BottomActionBar>
  </view>
</template>

<style scoped lang="scss">
.shopProductDetail {
  display: flex;
  flex-direction: column;
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
