function throttle(fn, interval, leading = true, trailing = false) {
  let lastTime = 0
  let timer = null
  let isLeading = true

  return function (...args) {
    const nowTime = new Date().getTime()

    if (isLeading && !leading) {
      lastTime = nowTime
      isLeading = false
    }
    const remainTime = nowTime - lastTime
    if (remainTime >= interval) {
      fn.apply(this, args)
      lastTime = nowTime
    } else {
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
