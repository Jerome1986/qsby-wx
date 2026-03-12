import type { OrderItem } from './OrderItem'
import type { UserItem } from './UserItem'

// 好友展示类型
export interface FriendData extends UserItem {
  /** 个人总消费金额 */
  totalConsumption: number
  /** 个人总消费次数 */
  totalCount: number
}

export interface FriendListPageResult {
  list: FriendData[]
  totalFriend: number
  teamConsumption: number
  pageNum: number
  pageSize: number
  totalPage: number
}

// 单个好友详情返回类型
export interface FriendDetailOrderResult {
  userInfo: UserItem
  list: OrderItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
