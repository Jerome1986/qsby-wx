// 获取用户信息
import { userInfoGetApi } from '@/api/user.ts'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

// 根据用户ID获取用户信息
export const userInfoGet = async (userId: string) => {
  console.log('用户ID', userId)
  const res = await userInfoGetApi(userId)
  console.log('页面请求', res)
  if (res.code === 200) {
    userStore.setProfile(res.data)
  }
}
