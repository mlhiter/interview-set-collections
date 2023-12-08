function throttle(fn, interval, leading = true, trailing = false) {
  let timer = null
  let lastTime = 0
  let isLeading = true

  return (...args) => {
    const nowTime = new Date().getTime()

    const remainTime = nowTime - lastTime

    if (!leading && isLeading) {
      lastTime = nowTime
      isLeading = false
    }

    if (remainTime - interval >= 0) {
      fn.apply(this, args)
      lastTime = nowTime
    }

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
