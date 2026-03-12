import type { ApplyForCashFormData } from '@/types/Cash'

// 定义字段配置
export const fields: { label: string; key: string }[] = [
  { label: '购买人', key: 'userInfo.nickname' },
  { label: '产品金额', key: 'totalAmount' },
  { label: '下单时间', key: 'createdAt' },
  { label: '产品名称', key: 'productInfo.title' },
  { label: '订单编号', key: 'out_trade_no' },
  { label: '产品佣金', key: 'commission' },
]

/** 提现表单验证，返回错误信息，通过则返回 null */
export function validateApplyForCashForm(
  form: ApplyForCashFormData,
  balance: number = 0,
): string | null {
  if (!form.name?.trim()) return '请输入姓名'
  if (!form.bankCard?.trim()) return '请输入银行卡号'
  const bankCardReg = /^\d{16,19}$/
  if (!bankCardReg.test(form.bankCard.replace(/\s/g, ''))) return '请输入正确的银行卡号'
  if (!form.openBank?.trim()) return '请输入银行开户行'
  if (!form.mobile?.trim()) return '请输入预留手机号'
  const mobileReg = /^1(3[0-9]|4[5-9]|5[0-35-9]|6[2-6]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if (!mobileReg.test(form.mobile.trim())) return '请输入正确的手机号'

  const amount = Number(form.amount) || 0
  if (amount <= 0) return '提现金额不可为0'
  if (amount % 100 !== 0) return '提现金额必须是100的整数倍'
  if (amount > balance) return '提现金额不可大于账户余额'
  return null
}
