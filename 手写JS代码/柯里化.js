// 实现一个函数让下面三行代码执行结果相同
// currySum(1)(2, 3)
// currySum(1)(2)(3)
// currySum(1, 2, 3)

// 加法函数
function getSum(a, b, c) {
  let sum = a + b + c
  return sum
}

/**
 *
 * @param {Function} fn
 * @returns {Function}
 */
const curry = (fn) => {
  return function circle(...args) {
    //fn.length是形参的数量，剩余参数不计算在内
    //如果参数数量不足，继续调用circle读入参数
    if (args.length < fn.length) {
      return (...secondArgs) => {
        return circle(...args, ...secondArgs)
      }
    }
    return fn(...args)
  }
}
const currySum = curry(getSum)

console.log(currySum(1)(2, 3))
console.log(currySum(1)(2)(3))
console.log(currySum(1, 2, 3))
