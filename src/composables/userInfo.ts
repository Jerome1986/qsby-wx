// 获取用户信息
import { avatarAuditLogGetApi, userInfoGetApi } from '@/api/user.ts'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

// 同步头像审核状态
export const syncAvatarAuditStatus = async (openid: string, fallbackPendingUrl?: string) => {
  try {
    const res = await avatarAuditLogGetApi(openid)
    if (res.code === 200) {
      if (res.data) {
        userStore.setAvatarReviewByAudit(res.data)
      } else if (fallbackPendingUrl) {
        userStore.setAvatarReviewPending(fallbackPendingUrl)
      } else if (userStore.profile?.avatarReviewStatus !== 'pending') {
        userStore.setAvatarReviewByAudit(null)
      }
    } else if (fallbackPendingUrl) {
      userStore.setAvatarReviewPending(fallbackPendingUrl)
    }
  } catch (err) {
    console.error(err)
    if (fallbackPendingUrl) userStore.setAvatarReviewPending(fallbackPendingUrl)
  }
}

// 根据用户ID获取用户信息
export const userInfoGet = async (userId: string) => {
  console.log('用户ID', userId)
  const res = await userInfoGetApi(userId)
  console.log('页面请求', res)
  if (res.code === 200) {
    userStore.setProfile(res.data)
    if (res.data.openid) await syncAvatarAuditStatus(res.data.openid)
  }
}
