function bucketSort(arr, bucketSize) {
  if (arr.length === 0) {
    return arr
  }
  var i
  var minValue = arr[0]
  var maxValue = arr[0]
  for (i = 0; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i]
    } else if (arr[i] > maxValue) {
      maxValue = arr[i]
    }
  }

  var DEFAULT_BUCKET_SIZE = 5
  bucketSize = bucketSize || DEFAULT_BUCKET_SIZE
  var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1
  var buckets = new Array(bucketCount)
  for (i = 0; i < buckets.length; i++) {
    buckets[i] = []
  }

  for (i = 0; i < arr.length; i++) {
    buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i])
  }

  arr.length = 0
  for (i = 0; i < buckets.length; i++) {
    insertionSort(buckets[i])
    for (var j = 0; j < buckets[i].length; j++) {
      arr.push(buckets[i][j])
    }
  }
  return arr
}
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
const result = bucketSort(array, 10)
console.log(result)
