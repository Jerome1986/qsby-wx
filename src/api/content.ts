import type {
  BrandContent,
  BookingNoteContent,
  ContentPageData,
  RightsBenefitsItem,
  TipsItem,
} from '@/types/Content'
import { request } from '@/utils/http'

/** 获取品牌页内容（Content 集合 code=brand） */
export const contentBrandApi = () => {
  return request<BrandContent | null>({
    method: 'GET',
    url: '/content/brand',
  })
}

/** 获取权益说明列表（RightsBenefits 集合，按 type 排序） */
export const contentRightsListApi = () => {
  return request<RightsBenefitsItem[]>({
    method: 'GET',
    url: '/content/rightsList',
  })
}

/** 获取门店介绍（Content 集合 code=store_intro） */
export const contentStoreIntroApi = () => {
  return request<ContentPageData | null>({
    method: 'GET',
    url: '/content/storeIntro',
  })
}

/** 获取周边推荐（Content 集合 code=surrounding） */
export const contentSurroundingApi = () => {
  return request<ContentPageData | null>({
    method: 'GET',
    url: '/content/surrounding',
  })
}

/** 获取预约须知（BookingNote 集合 code=booking_note） */
export const contentBookingNoteApi = () => {
  return request<BookingNoteContent | null>({
    method: 'GET',
    url: '/content/bookingNote',
  })
}

/** 获取温馨提示列表（按 type 筛选） */
export const contentTipsListApi = (type: 'trip' | 'activity' | 'project') => {
  return request<TipsItem[]>({
    method: 'GET',
    url: '/content/tipsList',
    data: { type },
  })
}
