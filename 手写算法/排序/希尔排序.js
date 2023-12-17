// 对插入排序的优化
// 通过间隔值进行不断地插入排序
function shellSort(arr) {
  let len = arr.length,
    temp,
    gap = 1
  // 找gap
  while (gap < len / 3) {
    gap = gap * 3 + 1
  }
  // 外层循环对gap进行缩小
  for (gap; gap > 0; gap = Math.floor(gap / 3)) {
    // 插入排序
    for (var i = gap; i < len; i++) {
      temp = arr[i]
      for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j]
      }
      arr[j + gap] = temp
    }
  }
  return arr
}

let array = [1, 3, 2, 5, 4]
const result = shellSort(array)
console.log(result)
