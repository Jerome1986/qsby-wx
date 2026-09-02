import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { AvatarAuditLog, UserItem } from '@/types/UserItem'

const passedAuditValues = ['pass', 'approved', 'success', 'done', '通过', '审核通过', '1']
const rejectedAuditValues = ['risky', 'reject', 'rejected', 'fail', 'failed', 'blocked', '不通过', '审核失败', '2']
const pendingAuditValues = ['pending', 'review', 'reviewing', '审核中', '0']

const normalizeAuditValue = (value?: string | number) => String(value || '').toLowerCase()

const isPassedAvatarAudit = (audit: AvatarAuditLog) => {
  const status = normalizeAuditValue(audit.status)
  const suggest = normalizeAuditValue(audit.suggest)

  return passedAuditValues.includes(status) || passedAuditValues.includes(suggest)
}

const isPendingAvatarAudit = (audit: AvatarAuditLog) => {
  const status = normalizeAuditValue(audit.status)
  const suggest = normalizeAuditValue(audit.suggest)

  if (isPassedAvatarAudit(audit)) return false
  if (rejectedAuditValues.includes(status) || rejectedAuditValues.includes(suggest)) return false

  return pendingAuditValues.includes(status) || pendingAuditValues.includes(suggest) || (!status && !suggest)
}

const getAuditTime = (audit: AvatarAuditLog) => {
  const time = audit.createdAt ? new Date(audit.createdAt).getTime() : Date.now()
  return Number.isNaN(time) ? Date.now() : time
}

// 定义 Store
export const useUserStore = defineStore(
  'user',
  () => {
    // 会员信息
    const profile = ref<UserItem>()
    const isManager = computed(() => profile.value?.role === 'manager')
    const managerEndTimestamp = computed(() => {
      if (!isManager.value || profile.value?.managerEndTime == null) return Number.NaN
      const timestamp = new Date(profile.value.managerEndTime).getTime()
      return Number.isFinite(timestamp) ? timestamp : Number.NaN
    })
    const managerValidityVersion = ref(0)
    const isValidManager = computed(
      () => {
        managerValidityVersion.value
        return isManager.value && Number.isFinite(managerEndTimestamp.value) && Date.now() < managerEndTimestamp.value
      },
    )
    const managerExpired = computed(() => isManager.value && !isValidManager.value)
    let managerExpiryTimer: ReturnType<typeof setTimeout> | undefined

    const scheduleManagerExpiryCheck = () => {
      if (managerExpiryTimer) clearTimeout(managerExpiryTimer)
      managerExpiryTimer = undefined

      const expiresAt = managerEndTimestamp.value
      if (!Number.isFinite(expiresAt)) return
      const delay = expiresAt - Date.now()
      if (delay <= 0) return

      managerExpiryTimer = setTimeout(
        () => {
          managerValidityVersion.value++
          scheduleManagerExpiryCheck()
        },
        Math.min(delay, 2_147_483_647),
      )
    }

    watch(
      () => [profile.value?.role, profile.value?.managerEndTime],
      () => {
        managerValidityVersion.value++
        scheduleManagerExpiryCheck()
      },
      { immediate: true },
    )

    // 保存会员信息，登录时使用
    const setProfile = (val: Partial<UserItem>) => {
      const reviewUrl = profile.value?.avatarReviewUrl
      const nextProfile = { ...profile.value, ...val } as UserItem

      if (reviewUrl && val.avatarUrl === reviewUrl) {
        delete nextProfile.avatarReviewStatus
        delete nextProfile.avatarReviewUrl
        delete nextProfile.avatarReviewAt
      }

      profile.value = nextProfile
    }

    // 标记头像已提交微信内容审核，仅作为接口异常时的当前提交兜底
    const setAvatarReviewPending = (avatarReviewUrl: string) => {
      if (!profile.value) return
      profile.value = {
        ...profile.value,
        avatarReviewStatus: 'pending',
        avatarReviewUrl,
        avatarReviewAt: Date.now(),
      }
    }

    // 根据最新审核日志同步头像审核状态
    const setAvatarReviewByAudit = (audit: AvatarAuditLog | null) => {
      if (!profile.value) return

      if (audit && isPassedAvatarAudit(audit) && audit.url) {
        profile.value = {
          ...profile.value,
          avatarUrl: audit.url,
        }
        clearAvatarReview()
        return
      }

      if (!audit || !isPendingAvatarAudit(audit)) {
        clearAvatarReview()
        return
      }

      profile.value = {
        ...profile.value,
        avatarReviewStatus: 'pending',
        avatarReviewUrl: audit.url,
        avatarReviewAt: getAuditTime(audit),
      }
    }

    // 清理头像审核本地状态
    const clearAvatarReview = () => {
      if (!profile.value) return

      const nextProfile = { ...profile.value }
      delete nextProfile.avatarReviewStatus
      delete nextProfile.avatarReviewUrl
      delete nextProfile.avatarReviewAt
      profile.value = nextProfile
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      // todo 清除等于默认值
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      isManager,
      isValidManager,
      managerExpired,
      setProfile,
      setAvatarReviewPending,
      setAvatarReviewByAudit,
      clearAvatarReview,
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
