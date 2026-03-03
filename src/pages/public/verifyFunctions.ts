import type { PublicFormData } from '@/types/Public'

// 表单校验
export const validatePublicForm = (form: PublicFormData): boolean => {
  // 1️⃣ 基础必填校验
  if (!form.cover) {
    uni.showToast({ icon: 'none', title: '请上传封面图' })
    return false
  }

  if (!form.title?.trim()) {
    uni.showToast({ icon: 'none', title: '请输入行程主题' })
    return false
  }

  if (!form.type) {
    uni.showToast({ icon: 'none', title: '请选择行程类型' })
    return false
  }

  if (!form.time) {
    uni.showToast({ icon: 'none', title: '请选择行程时间' })
    return false
  }

  if (!form.address_name || !form.event_address) {
    uni.showToast({ icon: 'none', title: '请选择行程地点' })
    return false
  }

  if (!form.wechat?.trim()) {
    uni.showToast({ icon: 'none', title: '请输入联系微信' })
    return false
  }

  if (!form.phone?.trim()) {
    uni.showToast({ icon: 'none', title: '请输入联系电话' })
    return false
  }

  // 2️⃣ 格式校验
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(form.phone)) {
    uni.showToast({ icon: 'none', title: '手机号格式不正确' })
    return false
  }

  // 3️⃣ 数字类校验
  const maxPeople = Number(form.maxPeople)
  const maleCount = Number(form.maleCount)
  const femaleCount = Number(form.femaleCount)
  const userFee = Number(form.userFee)
  const commission = Number(form.commission)

  if (!maxPeople || maxPeople <= 0) {
    uni.showToast({ icon: 'none', title: '请输入有效的人数限制' })
    return false
  }

  if (maleCount < 0 || femaleCount < 0) {
    uni.showToast({ icon: 'none', title: '报名人数不能为负数' })
    return false
  }

  if (maleCount + femaleCount > maxPeople) {
    uni.showToast({ icon: 'none', title: '男女报名人数不能超过总人数限制' })
    return false
  }

  if (userFee < 0) {
    uni.showToast({ icon: 'none', title: '报名费用不能为负数' })
    return false
  }

  if (commission < 0) {
    uni.showToast({ icon: 'none', title: '佣金不能为负数' })
    return false
  }

  if (commission > userFee) {
    uni.showToast({ icon: 'none', title: '佣金不能大于报名费用' })
    return false
  }

  // 4️⃣ 时间校验（不能早于当前时间）
  if (new Date(form.time).getTime() < Date.now()) {
    uni.showToast({ icon: 'none', title: '行程时间不能早于当前时间' })
    return false
  }

  if (!form.images || form.images.length === 0) {
    uni.showToast({ icon: 'none', title: '请上传行程内容图片' })
    return false
  }

  return true
}
