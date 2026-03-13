import type { PublicFormData } from '@/types/Public'
import type { UploadFileItem } from 'wot-design-uni/components/wd-upload/types'
import { normalizeImagesToUrls } from './uploadUtils'

/** 详情项类型（行程/活动接口返回） */
type DetailItem = Record<string, unknown> & {
  cover?: string
  title?: string
  type?: string
  typeName?: string
  address_name?: string
  event_address?: string
  latitude?: number
  longitude?: number
  wechat?: string
  phone?: string
  maxPeople?: number
  maleCount?: number
  femaleCount?: number
  userFee?: number
  commission?: number
  requirement?: string
  images?: unknown
}

/**
 * 从详情构建表单数据
 * @param detail - 接口返回的详情
 * @param timeStamp - 解析后的时间戳
 * @param typeOptions - 类型选项，用于 typeName 反查 type
 */
export const buildFormFromDetail = (
  detail: DetailItem,
  timeStamp: number,
  typeOptions: { value: string; text: string }[],
): PublicFormData => {
  const resolvedType =
    detail.type ||
    (detail.typeName && typeOptions.find((o) => o.text === detail.typeName)?.value) ||
    ''
  return {
    cover: detail.cover ?? '',
    title: detail.title ?? '',
    type: resolvedType,
    time: String(isNaN(timeStamp) ? Date.now() : timeStamp),
    address_name: detail.address_name ?? '',
    event_address: detail.event_address ?? '',
    latitude: detail.latitude ?? 0,
    longitude: detail.longitude ?? 0,
    wechat: detail.wechat ?? '',
    phone: detail.phone ?? '',
    maxPeople: detail.maxPeople ?? 0,
    maleCount: detail.maleCount ?? 0,
    femaleCount: detail.femaleCount ?? 0,
    userFee: detail.userFee ?? 0,
    commission: detail.commission ?? 0,
    requirement: detail.requirement ?? '',
    images: normalizeImagesToUrls(detail.images),
  }
}

/** 从详情 images 构建 fileList（用于 wd-upload 回显） */
export const buildFileListFromDetailImages = (images: unknown): UploadFileItem[] => {
  const urls = normalizeImagesToUrls(images)
  return urls.map((url) => ({ url } as UploadFileItem))
}
