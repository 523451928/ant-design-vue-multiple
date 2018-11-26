function judgeTypeFnCreator(type) {
  const toString = Object.prototype.toString
  return function isType(o) {
    return toString.call(o) === `[object ${type}]`
  }
}

const isUndef = judgeTypeFnCreator('Undefined')

const throttle = (fn, wait) => {
  let inThrottle, lastFn, lastTime
  return function () {
    const context = this,
      args = arguments
    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(function () {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args)
          lastTime = Date.now()
        }
      }, Math.max(wait - (Date.now() - lastTime), 0))
    }
  }
}

export {
  isUndef,
  throttle
}
