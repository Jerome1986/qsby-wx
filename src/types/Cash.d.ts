/** 页面TAB类型 */
export type Tab = 'income' | 'withdraw'

export interface TabList {
  label: string
  value: Tab
}

/** 提现申请表（表单提交用） */
export interface ApplyForCashFormData {
  /** 用户ID */
  userId: string
  /** 姓名 */
  name: string
  /** 银行卡号 */
  bankCard: string
  /** 银行开户行 */
  openBank: string
  /** 预留手机号 */
  mobile: string
  /** 需要提交的金额 */
  amount: number
}

/** 提现申请状态 */
export type CashWithdrawStatus = 'pending' | 'approved' | 'rejected'

/** 提现申请数据表（数据库存储） */
export interface CashWithdrawItem {
  /** 记录ID（MongoDB ObjectId） */
  _id: string
  /** 用户ID */
  userId: string
  /** 姓名 */
  name: string
  /** 银行卡号 */
  bankCard: string
  /** 银行开户行 */
  openBank: string
  /** 预留手机号 */
  mobile: string
  /** 提现金额（单位：元） */
  amount: number
  /** 账户余额 */
  balance: number
  /** 状态：pending=待审核 approved=已通过 rejected=已拒绝 */
  status: CashWithdrawStatus
  /** 创建时间 */
  createdAt: Date | string
  /** 更新时间 */
  updatedAt?: Date | string
  /** 审核备注（拒绝时可选） */
  remark?: string
}

/** 提现申请分页结果 */
export interface WithdrawPageResult {
  list: CashWithdrawItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
