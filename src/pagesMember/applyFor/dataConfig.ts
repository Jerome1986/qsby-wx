import type { ApplyForStatus, FormData } from '@/types/ApplyFor'
// 状态文本映射
export const applyForStatusText: Record<ApplyForStatus, () => string> = {
  no: () => '申请主理人',
  pending: () => '审核中',
  approved: () => '已通过',
  rejected: () => '已拒绝',
}

// 表单验证
export function validateApplyForm(formData: FormData): string | null {
  if (!formData.username?.trim()) {
    return '请输入真实姓名'
  }

  const idCardReg = /^\d{17}[\dXx]$/
  if (!idCardReg.test(formData.idCard)) {
    return '请输入正确的身份证号'
  }

  const mobileReg = /^1\d{10}$/
  if (!mobileReg.test(formData.mobile)) {
    return '请输入正确的手机号'
  }

  return null
}
