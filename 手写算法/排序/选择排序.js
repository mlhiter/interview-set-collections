// 选择排序
// 寻找未排序的部分的最小值和未排序的第一个值交换
function selectionSort(arr) {
  let len = arr.length
  let minIndex, temp
  for (let i = 0; i < len - 1; i++) {
    minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j
      }
    }
    temp = arr[minIndex]
    arr[minIndex] = arr[i]
    arr[i] = temp
  }
  return arr
}

let array = [1, 3, 2, 5, 4]
const result = selectionSort(array)
console.log(result)
