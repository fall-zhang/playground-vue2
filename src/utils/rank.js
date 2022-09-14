const arr = [9, 55, 7, 22, 78, 56, 33, 52]
function defineSort(arr, arg = '') {
  if (arg) {
    arr.sort((left, right) => {
      if (left[arg] > right[arg]) {
        // 左侧大于右侧，right 在后
        return -1
      }
      return 1
    })
  } else {
    arr.sort((left, right) => right - left)
  }
  return arr
}
console.log(defineSort(arr))
function arrGroup(arr, size) {
  const result = []
  let group = []
  arr.forEach((item, index) => {
    if (index % size) {
      group.push(item)
    } else {
      if (index !== 0) {
        result.push(group)
      }
      group = [item]
    }
  })
  return result
}
console.log(arrGroup(arr, 3))
// 计算所需行列
function chartHeight(count) {
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
console.log(chartHeight(164))
