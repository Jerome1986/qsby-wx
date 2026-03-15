export type NavbarType = 'bloggers' | 'planners' | 'travel'

interface NavbarItem {
  img: string
  text: string
  type: NavbarType
}

// 页面导航配置
export const navBarOptions: NavbarItem[] = [
  {
    img: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/managerRights/01.png',
    text: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/managerRights/bloggers.png',
    type: 'bloggers',
  },
  {
    img: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/managerRights/02.png',
    text: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/managerRights/planners.png',
    type: 'planners',
  },
  {
    img: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/managerRights/03.png',
    text: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/managerRights/travel.png',
    type: 'travel',
  },
]

export const navBar = [
  {
    name: '民宿博主',
    url: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/minsu.png',
  },
  {
    name: '活动策划人',
    url: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/cehua.png',
  },
  {
    name: '旅行博主',
    url: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qsby/static/images/lvxing.png',
  },
]

// 权益说明跳转
export const rightsJump: Record<NavbarType, (type: NavbarType) => void> = {
  // 民宿博主权益
  bloggers: (type) => {
    uni.navigateTo({
      url: `/pages/shop/rightsIntroduction?type=${type}&title=民宿博主权益`,
    })
  },
  // 活动策划人权益
  planners: (type) => {
    uni.navigateTo({
      url: `/pages/shop/rightsIntroduction?type=${type}&title=活动策划权益`,
    })
  },
  // 旅游博主权益
  travel: (type) => {
    uni.navigateTo({
      url: `/pages/shop/rightsIntroduction?type=${type}&title=旅游博主权益`,
    })
  },
}
