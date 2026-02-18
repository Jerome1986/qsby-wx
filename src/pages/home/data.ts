export type NavType = 'play' | 'city' | 'interesting' | 'store'

// 首页导航数据类型
interface Data {
  /** 图标 */
  icon: string
  /** 备注 */
  dec: string
  /** 标题 */
  title: string
  type: NavType
}

// 首页导航数据
export const homeData: Data[] = [
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/zuju.png',
    dec: 'WHERE TO PLAY',
    title: '趣哪•游',
    type: 'play',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/jinpin.png',
    dec: 'ACTIVITY',
    title: '同城活动',
    type: 'city',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/balloon.png',
    dec: 'FUN PROJECT',
    title: '有趣的项目',
    type: 'interesting',
  },
  {
    icon: 'https://objectstorageapi.hzh.sealos.run/pyaqb5pe-qiansu/house.png',
    dec: 'PREMIUM B&B',
    title: '自营门店',
    type: 'store',
  },
]

export const HomeJump: Record<NavType, () => void> = {
  play: () => {
    uni.navigateTo({
      url: '/pages/play/play',
    })
  },
  city: () => {},
  interesting: () => {},
  store: () => {},
}
