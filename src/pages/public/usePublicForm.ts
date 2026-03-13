/**
 * usePublicForm - 发布行程/活动表单逻辑
 *
 * 职责：
 * - 封面图上传、地点选择、行程类型加载
 * - 表单数据管理（formData、pickerTime、fileList）
 * - 编辑模式详情拉取与回填
 * - 提交：新增走 add 接口，编辑走 edit 接口
 *
 * 使用：在 public.vue 中调用 usePublicForm()，onLoad 时执行 init(options)
 */
import { ref } from 'vue'
import type { UploadChangeEvent, UploadFileItem } from 'wot-design-uni/components/wd-upload/types'
import { normalizeTimestamp } from '@/utils/generateMonth'
import { sendTripApi, tripDetailGetApi, tripEditApi, tripTypeGetAllApi } from '@/api/trip'
import { activityDetail, activityEditApi, activitySendApi, activityTypeFindAll } from '@/api/activity'
import { initFormData } from '@/pages/public/dataConfig'
import type { PublicFormData } from '@/types/Public'
import { useUserStore } from '@/stores'
import { validatePublicForm } from '@/pages/public/verifyFunctions'
import { getImagesFromFileList, normalizeImagesToUrls } from '@/pages/public/uploadUtils'
import { UPLOAD_ACTION } from '@/pages/public/constants'
import { buildFileListFromDetailImages, buildFormFromDetail } from '@/pages/public/formDetail'

export type SendType = 'trip' | 'activity'

/** 发布行程/活动表单逻辑 */
export const usePublicForm = () => {
  const userStore = useUserStore()

  const formData = ref<PublicFormData>(initFormData())
  const title = ref('发布')
  const itemId = ref('')
  const isEditMode = ref(false)
  const sendType = ref<SendType>('trip')
  const cover = ref('')
  const typeOptions = ref<{ value: string; text: string }[]>([])
  const showRequirementInput = ref(false)
  const pickerTime = ref<number>(Date.now())
  const fileList = ref<UploadFileItem[]>([])

  /** 上传封面图 */
  const handleUpdateCover = () => {
    uni.chooseImage({
      count: 1,
      success: (res) => {
        cover.value = res.tempFilePaths[0]
        const name = 'cover' + Date.now()
        uni.uploadFile({
          url: UPLOAD_ACTION,
          filePath: res.tempFilePaths[0],
          name,
          success: (uploadFileRes) => {
            formData.value.cover = uploadFileRes.data as string
          },
        })
      },
    })
  }

  /** 选择行程地点（调起地图） */
  const changeLocal = () => {
    uni.chooseLocation({
      success: (res) => {
        formData.value.address_name = res.name
        formData.value.event_address = res.address
        formData.value.latitude = res.latitude
        formData.value.longitude = res.longitude
      },
      fail: () => {
        uni.showToast({ icon: 'fail', title: '地图打开失败' })
      },
    })
  }

  /** 加载行程/活动类型选项 */
  const loadTypeOptions = async (type: SendType) => {
    const res =
      type === 'trip' ? await tripTypeGetAllApi() : await activityTypeFindAll()
    typeOptions.value = res.data.map((item) => ({
      value: item._id,
      text: item.name,
    }))
  }

  /** 行程图片上传变更 */
  const handleChange = (e: UploadChangeEvent) => {
    fileList.value = e.fileList
  }

  /** 拉取详情并回显表单（编辑模式） */
  const fetchDetail = async () => {
    if (!itemId.value || !sendType.value) return
    try {
      const detail =
        sendType.value === 'trip'
          ? (await tripDetailGetApi(itemId.value)).data
          : (await activityDetail(itemId.value)).data
      if (!detail) return

      const timeVal = normalizeTimestamp(detail.time)
      const timeStamp =
        timeVal == null
          ? Date.now()
          : timeVal instanceof Date
            ? timeVal.getTime()
            : new Date(timeVal).getTime()

      pickerTime.value = isNaN(timeStamp) ? Date.now() : timeStamp
      formData.value = buildFormFromDetail(detail, timeStamp, typeOptions.value)
      cover.value = (detail.cover as string) || ''

      const imageUrls = normalizeImagesToUrls(detail.images)
      if (imageUrls.length > 0) {
        fileList.value = buildFileListFromDetailImages(detail.images)
      }
      if (detail.requirement) showRequirementInput.value = true
    } catch {
      uni.showToast({ icon: 'none', title: '获取详情失败' })
    }
  }

  /** 提交：新增走 add，编辑走 edit */
  const handleSubmit = async () => {
    formData.value.time = String(pickerTime.value)
    const fromFileList = getImagesFromFileList(fileList.value)
    formData.value.images =
      fromFileList.length > 0
        ? fromFileList
        : isEditMode.value && fileList.value.length > 0 && formData.value.images?.length
          ? formData.value.images
          : []

    if (!validatePublicForm(formData.value, isEditMode.value)) return
    const userId = userStore.profile?._id
    if (!userId) return

    const isEdit = isEditMode.value && !!itemId.value
    const basePayload = { userId, ...formData.value }

    // 按 sendType 与 isEdit 分别调用对应 API（避免联合类型推断 _id 为可选）
    let res: { code: number; message?: string }
    if (sendType.value === 'trip') {
      res = isEdit
        ? await tripEditApi({ ...basePayload, _id: itemId.value })
        : await sendTripApi(basePayload)
    } else {
      res = isEdit
        ? await activityEditApi({ ...basePayload, _id: itemId.value })
        : await activitySendApi(basePayload)
    }
    if (res.code === 200) {
      uni.showToast({ icon: 'success', title: isEdit ? '已更新' : '已发布', mask: true })
      isEdit ? uni.navigateBack() : uni.switchTab({ url: '/pages/home/home' })
    }
  }

  /** 初始化：根据 URL 参数加载类型、拉取详情（编辑模式） */
  const init = async (options: { sendType?: string; itemId?: string }) => {
    itemId.value = options?.itemId ?? ''
    isEditMode.value = !!itemId.value

    if (options?.sendType === 'trip') {
      title.value = isEditMode.value ? '编辑行程' : '发布行程'
      sendType.value = 'trip'
      pickerTime.value = Date.now()
      await loadTypeOptions('trip')
      if (isEditMode.value) await fetchDetail()
    } else if (options?.sendType === 'activity') {
      title.value = isEditMode.value ? '编辑活动' : '发布活动'
      sendType.value = 'activity'
      pickerTime.value = Date.now()
      await loadTypeOptions('activity')
      if (isEditMode.value) await fetchDetail()
    }
  }

  return {
    formData,
    title,
    itemId,
    isEditMode,
    sendType,
    cover,
    typeOptions,
    showRequirementInput,
    pickerTime,
    fileList,
    action: UPLOAD_ACTION,
    handleUpdateCover,
    changeLocal,
    handleChange,
    handleSubmit,
    init,
  }
}
