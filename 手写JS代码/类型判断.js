function getType(data) {
  let type = typeof data
  if (type !== 'object') {
    return type
  }
  let originType = Object.prototype.toString.call(data)
  let index = originType.indexOf(' ')
  type = originType.slice(index + 1, -1)
  return type.toLowerCase()
}
