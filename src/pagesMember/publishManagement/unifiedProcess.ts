import { activityDelApi } from '@/api/activity'
import { projectDelApi } from '@/api/project'
import { tripDelApi } from '@/api/trip'
import type { SendType } from '@/types/Send'

/** 删除结果 */
export type DelProcessResult = { ok: boolean; message: string }

/** 统一删除：按 tab 调用对应 API，返回 { ok, message }，message 来自服务器 */
const toDelResult = (res: { code: number; message?: string }): DelProcessResult => ({
  ok: res.code === 200,
  message: res.message || (res.code === 200 ? '删除成功' : '删除失败'),
})

export const unifiedProcessDel: Record<
  SendType,
  (itemId: string, userId: string) => Promise<DelProcessResult>
> = {
  trip: (itemId, userId) => tripDelApi(userId, itemId).then(toDelResult),
  activity: (itemId, userId) => activityDelApi(userId, itemId).then(toDelResult),
  project: (itemId, userId) => projectDelApi(userId, itemId).then(toDelResult),
}
