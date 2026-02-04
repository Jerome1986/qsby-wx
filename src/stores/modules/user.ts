import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserItem } from '@/types/UserItem'

// 定义 Store
export const useUserStore = defineStore(
  'user',
  () => {
    // 会员信息
    const profile = ref<UserItem>()

    // 保存会员信息，登录时使用
    const setProfile = (val: any) => {
      profile.value = { ...profile.value, ...val }
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      // todo 清除等于默认值
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
