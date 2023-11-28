const curry = (fn) => {
  return function circle(...args) {
    if (args.length < fn.length) {
      return (...secondArgs) => {
        return circle(...args, ...secondArgs)
      }
    }
    return fn(...args)
  }
}
