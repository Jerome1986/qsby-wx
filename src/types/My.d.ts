// 跳转功能页面类型
export type FeatureType = 'friend' | 'wallet' | 'voucher' | 'score'
export interface FeatureItem {
  icon: string
  text: string
  type: FeatureType
}

// 我的工具页面类型
export type myUtilsType = 'manager' | 'share' | 'group' | 'message' | 'suggestion' | 'cooperate'

export interface MyUtilsItem {
  icon: string
  text: string
  type: myUtilsType
}
