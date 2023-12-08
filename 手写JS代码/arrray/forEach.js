Array.prototype.myForEach = function (callback, thisArg) {
  const arr = this
  if (!typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`)
  }

  for (let i = 0; i < arr.length; i++) {
    callback.call(thisArg, arr[i], i, arr)
  }
}
