import type { ApplyManagerResult, ChangerAvatarResult, UserItem } from '@/types/UserItem'
import { request } from '@/utils/http'
import type { UpdateResult } from '@/types/Gobal'
import type { ApplyForStatusResult } from '@/types/ApplyFor'

/**
 * 获取用户信息
 * @param userId - 用户ID
 * @returns
 */
export const userInfoGetApi = (userId: string) => {
  return request<UserItem>({
    method: 'GET',
    url: '/user/byOne',
    data: { userId },
  })
}

/**
 * 用户更新头像，一天3次
 * @param userId - 用户ID
 * @param avatarUrl - 上传头像返回的链接
 */
export const changeAvatarApi = (userId: string, avatarUrl: string) => {
  return request<ChangerAvatarResult>({
    method: 'POST',
    url: '/user/changeAvatar',
    data: { userId, avatarUrl },
  })
}

/**
 * 用户更新个人信息
 * @param userId - 用户ID
 * @param nickname - 用户昵称
 * @param age - 年龄
 * @param gender - 性别
 */
export const updateUserInfoApi = (
  userId: string,
  nickname: string,
  age: string,
  gender: number,
) => {
  return request<UpdateResult>({
    method: 'POST',
    url: '/user/updateInfo',
    data: { userId, nickname, age, gender },
  })
}

/**
 * 申请主理人接口
 * @param userId  - 用户ID
 * @param username - 真实姓名
 * @param idCard - 身份证号
 * @param mobile - 手机号
 */
export const applyManagerApi = (
  userId: string,
  username: string,
  idCard: string,
  mobile: string,
) => {
  return request<ApplyManagerResult>({
    method: 'POST',
    url: '/user/managerApply',
    data: { userId, username, idCard, mobile },
  })
}

/**
 * 验证当前用户是否主理人申请，返回申请状态
 * @param userId - 用户ID
 */
export const verifyManagerApplyApi = (userId: string) => {
  return request<ApplyForStatusResult>({
    method: 'GET',
    url: '/user/findApplyByUser',
    data: { userId },
  })
}
