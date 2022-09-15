// const arr = [9, 55, 7, 22, 78, 56, 33, 52]
export function defineSort(arr, arg = '', arg2 = '') {
  if (arg && arg2) {
    arr.sort((left, right) => {
      if (left[arg][arg2] > right[arg][arg2]) {
        // 左侧大于右侧，right 在后
        return -1
      }
      return 1
    })
  } else if (arg) {
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
// console.log(defineSort(arr))
export function defineGroup(arr, size) {
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
// console.log(arrGroup(arr, 3))

// console.log(chartHeight(164))
