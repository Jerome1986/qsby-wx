import type { UserItem } from './UserItem'

// 好友展示类型
export interface FriendData extends UserItem {
  /** 个人总消费金额 */
  totalConsumption: number
  /** 个人总消费次数 */
  totalConsumptionTimes: number
}

export interface FriendListPageResult {
  list: FriendData[]
  totalFriend: number
  teamConsumption: number
  pageNum: number
  pageSize: number
  totalPage: number
}
