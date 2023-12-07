//https://segmentfault.com/a/1190000020255831
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  // 此时只能是基本类型以及函数
  if (typeof obj !== 'object') return obj

  //解决循环引用：额外开辟一个空间，存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间找，有没有拷贝过这个对象，如果有直接返回，如果没有继续拷贝。
  if (hash.get(obj)) return hash.get(obj)
  let cloneObj = new obj.constructor()
  hash.set(obj, cloneObj)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj
}
