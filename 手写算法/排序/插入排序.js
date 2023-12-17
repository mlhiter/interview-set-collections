// 插入排序
// 将当前值与已排好序的部分从后往前比较，并将比较过的部分后移

function insertionSort(arr) {
  let len = arr.length
  let preIndex, current
  for (let i = 0; i < len; i++) {
    preIndex = i - 1
    current = arr[i]
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex] //后移
      preIndex--
    }
    arr[preIndex + 1] = current
  }
  return arr
}

let array = [1, 3, 2, 5, 4]
const result = insertionSort(array)
console.log(result)
