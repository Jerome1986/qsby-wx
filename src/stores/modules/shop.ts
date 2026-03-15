import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreItem } from '@/types/store'

// 定义 Store
export const useShopStore = defineStore('shop', () => {
  // 会员信息
  const shopInfo = ref<StoreItem>()

  // 保存信息
  const setShopInfo = (val: any) => {
    shopInfo.value = { ...shopInfo.value, ...val }
  }

  // 清理信息
  const clearProfile = () => {
    // todo 清除等于默认值
    shopInfo.value = undefined
  }

  // 记得 return
  return {
    shopInfo,
    setShopInfo,
    clearProfile,
  }
})
