// 表单数据类型
export interface FormData {
  /** 真实姓名 */
  username: string
  /** 身份证号码 */
  idCard: string
  /** 手机号 */
  mobile: string
}

// 表单状态
export type ApplyForStatus = 'no' | 'pending' | 'approved' | 'rejected'

export interface ApplyForStatusResult {
  username: string
  idCard: string
  mobile: string
  status: ApplyForStatus
}
