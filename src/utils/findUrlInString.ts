export function findUrlInString(text: string) {
  // 正则表达式匹配完整URL，包括协议、主机名、端口、路径、搜索参数和哈希
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  // 使用match方法查找所有匹配的URL
  const res = text.match(urlRegex);
  return res ? res[0] : ''
}