// 计算所需行列
export function chartSize(count) {
  let width = 3
  let height = 3
  if (count > 200 || count < 0) {
    throw new TypeError('节点个数错误，最多支持200个节点')
  }
  while (width * height < count) {
    width += 1
    if (width * height < count) {
      height += 1
    } else {
      break
    }
  }
  return [width, height]
}
export function defineGroup(arr, size) {
  const result = []
  let group = []
  arr.forEach((item, index) => {
    if (index % size) {
      group.push(item)
    } else {
      group = [item]
      result.push(group)
    }
  })
  return result
}