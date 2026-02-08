import type { ChangerAvatarResult, UserItem } from '@/types/UserItem'
import { request } from '@/utils/http'
import type { UpdateResult } from '@/types/Gobal'

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
