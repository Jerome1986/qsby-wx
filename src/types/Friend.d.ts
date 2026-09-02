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
  /** 当前查询月份，格式为 YYYY-MM */
  time: string
  list: OrderItem[]
  summary: {
    /** 当前月份已核销订单数量 */
    totalVerifiedCount: number
    /** 当前月份已核销订单消费总额 */
    totalConsumption: number
    /** 当前页订单消费小计 */
    pageConsumption: number
  }
  pagination: {
    pageNum: number
    pageSize: number
    total: number
    totalPage: number
  }
}
