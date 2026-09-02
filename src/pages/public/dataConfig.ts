import type { PublicFormData } from '@/types/Public'

// 创建表单
export const initFormData = (): PublicFormData => {
  return {
    cover: '', // 封面
    title: '', // 行程主题
    type: '', // 行程类型
    time: '', // 行程时间（提交时由 pickerTime 写入）
    address_name: '', // 行程地点--地图上的商户名
    event_address: '', // 行程地址--地图上的具体位置
    latitude: 0, // 纬度
    longitude: 0, // 经度
    wechat: '', // 联系微信
    phone: '', // 联系电话
    maxPeople: '', // 人数限制（默认留空，显示输入提示）
    maleCount: '', // 男士报名（默认留空，提交时按 0 处理）
    femaleCount: '', // 女士报名（默认留空，提交时按 0 处理）
    userFee: '', // 用户报名费用（默认留空，提交时按 0 处理）
    commission: '', // 主理人佣金（默认留空，提交时按 0 处理）
    requirement: '', // 行程需求
    images: [],
  }
}
