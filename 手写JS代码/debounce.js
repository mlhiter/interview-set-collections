// 防抖是一定时间内重复触发某事件，只让最后一次生效。
// 参数：进行防抖处理的函数，延迟时间，是否立即执行一次，获取fn函数的返回值的回调函数

function debounce(fn, delay = 1000, immediate = false, resultCb) {
  let timer = null
  let isImmediateInvoke = false

  return function (...args) {
    // 有定时器存在则将定时器清除
    if (timer !== null) {
      clearTimeout(timer)
    }

    // 当是第一次触发，并且需要触发第一次事件
    if (!isImmediateInvoke && immediate) {
      const result = fn.apply(this, args)
      if (typeof resultCb === 'function') {
        resultCb(result)
      }
      //设置为true之后之后就永远不会触发该块逻辑
      isImmediateInvoke = true
    }

    timer = setTimeout(() => {
      // 改变this指向
      fn.apply(this, args)
      // 当前是一系列频繁触发的最后一次事件，这样做之后才可以有下一次触发的立即执行
      isImmediateInvoke = false
    }, delay)
  }
}
