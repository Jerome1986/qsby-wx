export type NavbarType = 'bloggers' | 'planners' | 'travel'

interface NavbarItem {
  img: string
  text: string
  type: NavbarType
}

// 页面导航配置
export const navBarOptions: NavbarItem[] = [
  {
    img: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/01.png',
    text: '/static/images/bloggers.png',
    type: 'bloggers',
  },
  {
    img: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/02.png',
    text: '/static/images/planners.png',
    type: 'planners',
  },
  {
    img: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/03.png',
    text: '/static/images/travel.png',
    type: 'travel',
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
