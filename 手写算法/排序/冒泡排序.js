// 冒泡排序
// 不断地两两比较交换，直到左小右大
function bubbleSort(arr) {
  let len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

let array = [1, 3, 2, 5, 4]
const result = bubbleSort(array)
console.log(result)
