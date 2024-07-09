export function formatUnixTimestamp(unixTimestamp: number) {
  const dateObj = new Date(unixTimestamp) // 使用毫秒级 Unix 时间戳创建 Date 对象
  const hours = dateObj.getHours().toString().padStart(2, '0') // 获取小时并补零
  const minutes = dateObj.getMinutes().toString().padStart(2, '0') // 获取分钟并补零
  return `${hours}:${minutes}`
}
