export default function randomArr(arr) {
  let length = arr.length
  let newArr = arr.slice()
  arr.forEach((item, index) => {
    const change = Math.floor(Math.random() * length)
    let current = newArr[index]
    newArr[index] = newArr[change]
    newArr[change] = current
  })
  return newArr
}
