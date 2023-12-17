// 利用堆的性质：子节点的键值或索引总是大于或小于它的父节点

var len

function buildMaxHeap(arr) {
  len = arr.length
  for (var i = Math.floor(len / 2); i >= 0; i--) {
    heapify(arr, i)
  }
}

function heapify(arr, i) {
  var left = 2 * i + 1,
    right = 2 * i + 2,
    largest = i
  if (left < len && arr[left] > arr[largest]) {
    largest = left
  }
  if (right < len && arr[right] > arr[largest]) {
    largest = right
  }
  if (largest != i) {
    swap(arr, i, largest)
    heapify(arr, largest)
  }
}

function swap(arr, i, j) {
  var temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

function heapSort(arr) {
  buildMaxHeap(arr)
  for (var i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i)
    len--
    heapify(arr, 0)
  }
  return arr
}

let array = [1, 3, 2, 5, 4]
const result = heapSort(array)
console.log(result)
