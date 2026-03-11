// 个人流水明细类型
export interface UserBalanceFlow {
  /** 流水ID */
  _id: string
  /** 用户ID */
  user_id: string
  /** 账户类型 cash=现金余额 commission=佣金 voucher=代金券 points=积分 */
  account_type: 'cash' | 'commission' | 'voucher' | 'points'
  /** 资金方向 income=收入 expense=支出 */
  direction: 'income' | 'expense'
  /** 变动金额 */
  amount: number
  /** 变动前余额 */
  before_balance: number
  /** 变动后余额 */
  after_balance: number
  /** 支付方式 cash=现金 voucher=代金券 commission=佣金 points=积分 */
  pay_type: 'cash' | 'voucher' | 'commission' | 'points'
  /** 业务类型 order=订单 refund=退款 withdraw=提现 commission=佣金结算 activity=活动奖励 admin=后台调整 */
  business_type: 'order' | 'refund' | 'withdraw' | 'commission' | 'activity' | 'admin'
  /** 业务ID */
  business_id: string
  /** 状态 pending=处理中 success=成功 failed=失败 */
  status: 'pending' | 'success' | 'failed'
  /** 备注 */
  remark?: string
  /** 创建时间 */
  created_at: Date
}

// 查询代金券账单格式
export interface VoucherBill {
  /** 月份 */
  month: string
  /** 已使用金额 */
  used: number
  /** 对应月份剩余的余额 */
  balance: number
}
