import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  /** 订单列表待刷新次数（每次取消订单成功 +1，orderManage onShow 时刷新并清零） */
  const orderListDirtyCount = ref(0)

  const incrementOrderListDirty = () => {
    orderListDirtyCount.value += 1
  }

  const clearOrderListDirty = () => {
    orderListDirtyCount.value = 0
  }

  return {
    orderListDirtyCount,
    incrementOrderListDirty,
    clearOrderListDirty,
  }
})
