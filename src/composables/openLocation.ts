// 打开地图
export const openLocation = (
  latitude: number,
  longitude: number,
  name: string,
  address: string,
) => {
  uni.openLocation({
    latitude,
    longitude,
    name,
    address,
    success: () => {
      console.log('地图定位打开成功')
    },
    fail: (error) => {
      console.log('打开定位失败', error)
      uni.showToast({ icon: 'fail', title: '定位打开失败' })
    },
  })
}
