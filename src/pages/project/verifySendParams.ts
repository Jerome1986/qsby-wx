import type { ProjectFormData } from '@/types/Project'

export interface VerifyProjectParams {
  cover: string
  formData: ProjectFormData
  agreed: boolean
  userId: string | undefined
}

/** 发布项目表单校验 */
export const validateProjectForm = (params: VerifyProjectParams): boolean => {
  const { cover, formData, agreed, userId } = params

  if (!cover) {
    uni.showToast({ title: '请上传封面图片', icon: 'none' })
    return false
  }
  if (!formData.cover) {
    uni.showToast({ title: '封面图上传中，请稍候', icon: 'none' })
    return false
  }
  if (!formData.title?.trim()) {
    uni.showToast({ title: '请输入项目标题', icon: 'none' })
    return false
  }
  if (formData.industry == null || formData.industry === '') {
    uni.showToast({ title: '请选择行业类别', icon: 'none' })
    return false
  }
  if (formData.cooperationMode == null || formData.cooperationMode === '') {
    uni.showToast({ title: '请选择合作方式', icon: 'none' })
    return false
  }
  if (formData.cooperationScale == null || formData.cooperationScale === '') {
    uni.showToast({ title: '请选择合作规模', icon: 'none' })
    return false
  }
  if (!formData.address_name?.trim() || !formData.event_address?.trim()) {
    uni.showToast({ title: '请选择行程地点', icon: 'none' })
    return false
  }
  if (!formData.wechat?.trim()) {
    uni.showToast({ title: '请输入联系微信', icon: 'none' })
    return false
  }
  if (!formData.phone?.trim()) {
    uni.showToast({ title: '请输入联系电话', icon: 'none' })
    return false
  }
  if (!agreed) {
    uni.showToast({ title: '请先阅读并同意提交须知', icon: 'none' })
    return false
  }
  if (!userId) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return false
  }

  return true
}
