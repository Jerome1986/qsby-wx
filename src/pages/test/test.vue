<script setup lang="ts">
import { submitActivityTestData, testAddApi, testApi } from '@/api/test'
import type { EventItem } from '@/types/PublicManagement'
import type { TestEvent } from '@/types/Test'
import { ref } from 'vue'

const COVER_URL = 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/test02.jpg'
const IMAGES_URL = [COVER_URL]

const data = ref<TestEvent[]>([])
const newData = ref<EventItem[]>([])

/** 生成 14 组活动测试数据 */
const buildActivityTestData = (): EventItem[] => {
  const now = new Date()
  const baseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const types = [
    { type: '69a404cf7e6fae97e7a5b520', typeName: '体育运动' },
    { type: '69a404cf7e6fae97e7a5b521', typeName: '餐饮聚餐' },
    { type: '69a404cf7e6fae97e7a5b522', typeName: '文体艺术' },
    { type: '69a404cf7e6fae97e7a5b523', typeName: '活动派对' },
  ]
  const titles = [
    '周末羽毛球友谊赛',
    '城市徒步探索',
    '咖啡品鉴沙龙',
    '油画体验工作坊',
    '桌游之夜',
    '户外露营烧烤',
    '瑜伽晨练营',
    '读书分享会',
    '摄影外拍活动',
    '手工陶艺体验',
    '剧本杀推理局',
    '骑行环城游',
    '音乐会鉴赏',
    '美食探店小分队',
  ]
  const addresses = [
    { name: '市体育馆', addr: '解放路 88 号' },
    { name: '人民公园', addr: '公园路 1 号' },
    { name: '星巴克臻选', addr: '商业街 66 号' },
    { name: '艺术空间', addr: '创意园 A 栋' },
    { name: '桌游吧', addr: '青年路 22 号' },
    { name: '郊野营地', addr: '东郊森林公园' },
    { name: '瑜伽馆', addr: '健康路 15 号' },
    { name: '城市书房', addr: '文化街 33 号' },
    { name: '老城区', addr: '古街片区' },
    { name: '陶艺工坊', addr: '工艺巷 8 号' },
    { name: '推理馆', addr: '娱乐城 3 楼' },
    { name: '绿道起点', addr: '滨江大道' },
    { name: '音乐厅', addr: '艺术中心' },
    { name: '美食街', addr: '小吃城' },
  ]
  const statuses: Array<'pending' | 'active' | 'finished' | 'cancelled'> = [
    'active', 'active', 'pending', 'active', 'finished', 'active', 'active',
    'pending', 'active', 'active', 'active', 'finished', 'active',
  ]

  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(baseTime)
    d.setDate(d.getDate() + i)
    const timeStr = d.toISOString().slice(0, 19).replace('T', ' ')
    const t = types[i % types.length]
    const addr = addresses[i]
    return {
      _id: `test_act_${i}_${Date.now().toString(36)}`,
      userId: '6985c0957e6fae97e7a5b517',
      cover: COVER_URL,
      title: titles[i],
      type: t.type,
      typeName: t.typeName,
      time: timeStr,
      address_name: addr.name,
      event_address: addr.addr,
      latitude: 30.2 + i * 0.01,
      longitude: 120.1 + i * 0.02,
      wechat: `wx_test_${i}`,
      phone: `138${String(10000000 + i).slice(-8)}`,
      maxPeople: 10 + (i % 5) * 5,
      maleCount: i % 4,
      femaleCount: (i % 3) + 2,
      userFee: 50 + i * 10,
      commission: 5 + i,
      requirement: `活动需求说明 ${i + 1}：欢迎报名参加，请提前准备。`,
      images: [...IMAGES_URL],
      status: statuses[i],
      enrollCount: i % 8,
      revenue: (i % 8) * (50 + i * 10),
      signUpList: [],
      createAt: now,
      updateAt: now,
    } satisfies EventItem
  })
}

const submitting = ref(false)

/** 提交 14 组活动测试数据到 /test */
const handleSubmitActivityTest = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const array = buildActivityTestData()
    const res = await submitActivityTestData(array)
    uni.showToast({ icon: 'success', title: '提交成功' })
    console.log('submitActivityTestData res:', res)
  } catch (err) {
    console.error(err)
    uni.showToast({ icon: 'none', title: '提交失败' })
  } finally {
    submitting.value = false
  }
}

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
    <view class="submit-btn" :class="{ disabled: submitting }" @tap="handleSubmitActivityTest">
      {{ submitting ? '提交中...' : '提交14组活动测试数据' }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.test {
  padding: 24rpx;
}

.submit-btn {
  margin-top: 24rpx;
  padding: 24rpx;
  text-align: center;
  background: #07c160;
  color: #fff;
  border-radius: 12rpx;

  &.disabled {
    opacity: 0.6;
  }
}
</style>
