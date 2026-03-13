import type { UploadFileItem } from 'wot-design-uni/components/wd-upload/types'

/** 将接口返回的 images 统一转为 string[]（兼容 string[] 与 { url?: string }[]） */
export const normalizeImagesToUrls = (images: unknown): string[] => {
  if (!Array.isArray(images)) return []
  return images
    .map((item) => (typeof item === 'string' ? item : (item as { url?: string })?.url ?? ''))
    .filter(Boolean)
}

/** 从 fileList 提取图片 URL（兼容上传后 response、展示用 url/path、接口返回的 string） */
export const getImagesFromFileList = (list: UploadFileItem[]): string[] => {
  return list
    .map((f) => {
      if (typeof f === 'string') return f
      const res = (f as { response?: unknown }).response
      if (typeof res === 'string') return res
      if (res && typeof res === 'object' && res !== null && 'data' in res) {
        return (res as { data: string }).data
      }
      const url = (f as { url?: string }).url
      if (typeof url === 'string') return url
      const path = (f as { path?: string }).path
      if (typeof path === 'string') return path
      return ''
    })
    .filter(Boolean)
}
