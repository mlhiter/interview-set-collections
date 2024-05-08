// 节流是事件频繁被触发之后，仍然按照一定频率触发
// 参数：想要节流的函数，间隔，第一次是否立即执行，最后一次是否执行
function throttle(fn, interval, leading = true, trailing = false) {
  let lastTime = 0
  let isLeading = true
  let timer = null

  return function (...args) {
    const nowTime = new Date().getTime()

    // 如果第一次不需要立即执行
    if (!leading && isLeading) {
      lastTime = nowTime
      isLeading = false
    }

    const remainTime = nowTime - lastTime

    // 可以再次进行函数
    if (remainTime - interval >= 0) {
      fn.apply(this, args)
      lastTime = nowTime
    }

    // 防止下一轮第一次又开始执行
    if (remainTime < interval) {
      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        if (trailing) {
          fn.apply(this, args)
        }

        isLeading = true
      }, interval)
    }
  }
}
