import { ref } from 'vue'
import type { OrderType } from '@/types/OrderItem'
import { verifySignUpApi } from '@/api/verifySignUp'
import type { PublicType } from '@/types/PublicManagement'

// 验证是否报名
export const isVerify = ref(false)
export const isSignUp = async (targetId: string, proType: OrderType, userId: string) => {
  const res = await verifySignUpApi(proType as PublicType, targetId, userId)
  console.log('报名结果', res)

  isVerify.value = res.data.isSignUp
}
