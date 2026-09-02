/**
 * usePublicForm - 发布活动表单逻辑
 *
 * 职责：
 * - 封面图上传、地点选择、活动类型加载
 * - 表单数据管理（formData、pickerTime、fileList）
 * - 编辑模式详情拉取与回填
 * - 提交：新增走 add 接口，编辑走 edit 接口
 *
 * 使用：在 public.vue 中调用 usePublicForm()，onLoad 时执行 init(options)
 */
import { computed, ref } from 'vue'
import type { UploadChangeEvent, UploadFileItem } from 'wot-design-uni/components/wd-upload/types'
import { normalizeTimestamp } from '@/utils/generateMonth'
import {
  activityDetail,
  activityEditApi,
  activitySendApi,
  activityTypeFindAll,
} from '@/api/activity'
import { initFormData } from '@/pages/public/dataConfig'
import type { PublicFormData } from '@/types/Public'
import { useUserStore } from '@/stores'
import { validatePublicForm } from '@/pages/public/verifyFunctions'
import { getImagesFromFileList, normalizeImagesToUrls } from '@/pages/public/uploadUtils'
import { UPLOAD_ACTION } from '@/pages/public/constants'
import { buildFileListFromDetailImages, buildFormFromDetail } from '@/pages/public/formDetail'

/** 发布活动表单逻辑 */
export const usePublicForm = () => {
  const userStore = useUserStore()

  const formData = ref<PublicFormData>(initFormData()) // 表单数据（封面、主题、类型、时间、地点等）
  const title = ref('发布活动')
  const itemId = ref('') // 编辑时的 ID（来自 URL itemId）
  const isEditMode = ref(false) // 是否编辑模式（有 itemId 即为 true）
  const cover = ref('') // 封面图展示用（本地路径或 URL）
  const typeOptions = ref<{ value: string; text: string }[]>([]) // 行程/活动类型下拉选项（value=类型ID, text=名称）
  const pickerTime = ref<number>(Date.now()) // 行程时间（wd-datetime-picker 需 number，提交时同步到 formData.time）
  const fileList = ref<UploadFileItem[]>([]) // 行程图片列表（wd-upload 用，提交时提取 URL 到 formData.images）
  const requirementPreview = computed(() => {
    const text = formData.value.requirement?.trim() ?? ''
    if (!text) return ''

    const normalizedText = text.replace(/\s+/g, ' ')
    return normalizedText.length > 20 ? `${normalizedText.slice(0, 20)}...` : normalizedText
  })

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
      fail: (err) => {
        console.error('地图打开失败', err)

        uni.showToast({ icon: 'fail', title: '地图打开失败' })
      },
    })
  }

  /** 加载活动类型选项 */
  const loadTypeOptions = async () => {
    const res = await activityTypeFindAll()
    typeOptions.value = res.data.map((item) => ({
      value: item._id,
      text: item.name,
    }))
  }

  /** 行程图片上传变更 */
  const handleChange = (e: UploadChangeEvent) => {
    fileList.value = e.fileList
  }

  /** 跳转到独立页面编辑行程/活动需求 */
  const handleEditRequirement = () => {
    uni.navigateTo({
      url: '/pages/public/requirementEdit',
      events: {
        saveRequirement: (data: { requirement?: string }) => {
          formData.value.requirement = data.requirement ?? ''
        },
      },
      success: (res) => {
        res.eventChannel.emit('initRequirement', {
          requirement: formData.value.requirement ?? '',
        })
      },
    })
  }

  /** 拉取详情并回显表单（编辑模式） */
  const fetchDetail = async () => {
    if (!itemId.value) return
    try {
      const detail = (await activityDetail(itemId.value)).data
      if (!detail) return

      // 解析时间：支持 Date、时间戳、字符串，供 picker 与 formData 使用
      const timeVal = normalizeTimestamp(detail.time)
      const timeStamp =
        timeVal == null
          ? Date.now()
          : timeVal instanceof Date
            ? timeVal.getTime()
            : new Date(timeVal).getTime()

      pickerTime.value = isNaN(timeStamp) ? Date.now() : timeStamp
      // formDetail.buildFormFromDetail 负责 type/typeName 反查、字段默认值
      formData.value = buildFormFromDetail(detail, timeStamp, typeOptions.value)
      cover.value = (detail.cover as string) || ''

      // 回显已上传图片（需转为 wd-upload 的 fileList 格式）
      const imageUrls = normalizeImagesToUrls(detail.images)
      if (imageUrls.length > 0) {
        fileList.value = buildFileListFromDetailImages(detail.images)
      }
    } catch {
      uni.showToast({ icon: 'none', title: '获取详情失败' })
    }
  }

  /** 提交：新增走 add，编辑走 edit */
  const handleSubmit = () => {
    console.log(formData.value)
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
    const basePayload = {
      userId,
      ...formData.value,
      maxPeople: Number(formData.value.maxPeople),
      maleCount: Number(formData.value.maleCount ?? 0),
      femaleCount: Number(formData.value.femaleCount ?? 0),
      userFee: Number(formData.value.userFee ?? 0),
      commission: Number(formData.value.commission ?? 0),
    }
    uni.showModal({
      title: '提示',
      content: '确定发布吗？',
      confirmColor: '#eed261',
      success: async (result) => {
        if (result.confirm) {
          const res = isEdit
            ? await activityEditApi({ ...basePayload, _id: itemId.value })
            : await activitySendApi(basePayload)
          if (res.code === 200) {
            uni.showToast({ icon: 'success', title: isEdit ? '已更新' : '已发布', mask: true })
            setTimeout(() => {
              isEdit ? uni.navigateBack() : uni.switchTab({ url: '/pages/home/home' })
            }, 500)
          }
        }
      },
    })
  }

  /** 初始化：加载活动类型、拉取详情（编辑模式） */
  const init = async (options: { itemId?: string }) => {
    itemId.value = options?.itemId ?? ''
    isEditMode.value = !!itemId.value
    title.value = isEditMode.value ? '编辑活动' : '发布活动'
    pickerTime.value = Date.now()
    await loadTypeOptions()
    if (isEditMode.value) await fetchDetail()
  }

  return {
    formData,
    title,
    itemId,
    isEditMode,
    cover,
    typeOptions,
    requirementPreview,
    pickerTime,
    fileList,
    action: UPLOAD_ACTION,
    handleUpdateCover,
    changeLocal,
    handleChange,
    handleEditRequirement,
    handleSubmit,
    init,
  }
}
