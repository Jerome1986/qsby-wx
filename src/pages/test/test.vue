<script setup lang="ts">
import { testAddApi, testApi } from '@/api/test'
import type { TestEvent } from '@/types/Test'
import type { EventItem } from '@/types/PublicManagement'
import { ref } from 'vue'

const data = ref<TestEvent[]>([])
const newData = ref<EventItem[]>([])

const handleTest = async () => {
  const res = await testApi()
  const list = res.data.data
  data.value = list

  newData.value = list.map((item) => {
    let images: string[] = []
    if (typeof item.content_images === 'string') {
      try {
        const parsed = JSON.parse(item.content_images)
        images = parsed.map((img: { url: string }) => img.url)
      } catch {
        images = []
      }
    }

    let status: 'pending' | 'active' | 'finished' | 'cancelled' = 'pending'
    if (item.status === 1) status = 'active'
    else if (item.status === 2) status = 'finished'
    else if (item.status === 3) status = 'cancelled'

    return {
      userId: '6985c0957e6fae97e7a5b517',
      cover: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/0eb77b50ad3ce2170e3740ea8ed59c1d.jpg',
      title: item.event_name,
      type: '69a404cf7e6fae97e7a5b520',
      typeName: '旅游',
      time: item.event_day,
      address_name: item.address_name,
      event_address: item.event_address,
      latitude: Number(item.lat),
      longitude: Number(item.lng),
      wechat: item.wechat,
      phone: item.telphone,
      maxPeople: Number(item.num_member),
      maleCount: Number(item.virtual_men),
      femaleCount: Number(item.virtual_female),
      userFee: Number(item.price),
      commission: 0,
      requirement: item.event_content,
      images: ['https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/testHouseCover/6d515cb9ff32c5bffdcd9ded8413fa83.jpg'],
      status,
      enrollCount: item.total_apply,
      revenue: Number(item.total_money),
      createAt: item.createtime,
      updateAt: item.updatetime,
    }
  })
  console.log(newData.value)
  const name = '测试'
  const add = await testAddApi(newData.value)
  console.log(add)
}
</script>

<template>
  <view class="test">
    <view @tap="handleTest">测试</view>
  </view>
</template>

<style scoped lang="scss"></style>
