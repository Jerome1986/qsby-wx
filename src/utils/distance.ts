/**
 * Haversine 公式 - 计算地球上两点之间的距离
 * @param lat1 起点纬度
 * @param lng1 起点经度
 * @param lat2 终点纬度
 * @param lng2 终点经度
 * @returns 距离（单位：米）
 */
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000 // 地球半径（米）

  // 将角度转换为弧度
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // 返回米
}

/**
 * 格式化距离显示
 * @param meters 距离（米）
 * @returns 格式化后的字符串
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

// 计算距离
// const distance = getDistance(myLat, myLng, targetLat, targetLng)
// console.log(`直线距离：${formatDistance(distance)}`) // 输出：直线距离：7.9km
