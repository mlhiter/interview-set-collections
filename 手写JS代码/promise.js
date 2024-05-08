// 实例方法API: then,catch,finally
// 静态方法API: all,,race,resolve,reject,allSettled

class MyPromise {
  // 构造函数：接收一个executor函数（即new Promise传入的函数），executor函数接收两个参数，分别是resolve和reject函数
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new Error('MyPromise must accept a function as a parameter')
    }

    // promise传入函数直接失败则直接进入reject
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // promise状态
  PromiseStatus = 'pending'
  PromiseValue
  PromiseError

  // 回调函数集合
  // 为什么需要它们：因为promise的状态是不可逆的（直接.then时promise状态可能还没发生改变，那么执行then是不合理的），所以需要收集resolve和reject的回调函数，以便在状态改变时执行
  onResolvedCallbacks = [] //收集resolve的回调函数集合
  onRejectedCallbacks = [] //收集reject的回调函数集合

  // 成功回调方法
  resolve = (value) => {
    if (this.PromiseStatus !== 'pending') return

    this.PromiseStatus = 'fulfilled'
    this.promiseValue = value

    while (this.onResolvedCallbacks.length) this.onResolvedCallbacks.shift()()
  }

  // 失败回调方法
  reject = (error) => {
    if (this.PromiseStatus !== 'pending') return

    this.PromiseStatus = 'rejected'
    this.PromiseError = error

    while (this.onRejectedCallbacks.length) this.onRejectedCallbacks.shift()()
  }

  // 链式调用方法
  then(onFulfilled, onRejected) {
    // 默认处理方式
    onFulfilled = onFulfilled ? onFulfilled : (value) => value
    onRejected = onRejected
      ? onRejected
      : (err) => {
          throw err
        }

    // 为了在promise实例内部拿到该实例自身，需要使用setTimeout处理，因为promise在微任务执行完毕之后才会执行宏任务中的setTimeout，这样setTimeout中的代码就能拿到promise实例自身
    let myPromise = new MyPromise((resolve, reject) => {
      switch (this.PromiseStatus) {
        // 状态没改变时，将回调函数收集起来
        case 'pending':
          this.onResolvedCallbacks.push(() => {
            setTimeout(() => {
              try {
                resolvePromise(
                  myPromise,
                  onFulfilled(this.promiseValue),
                  resolve,
                  reject
                )
              } catch (err) {
                reject(err)
              }
            }, 0)
          })
          this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              try {
                resolvePromise(() => {
                  myPromise, onRejected(this.PromiseError)
                  resolve, reject
                })
              } catch (err) {
                reject(err)
              }
            }, 0)
          })
          break
        case 'fulfilled':
          try {
            setTimeout(() => {
              resolvePromise(
                myPromise,
                onFulfilled(this.PromiseValue),
                resolve,
                reject
              )
            }, 0)
          } catch (err) {
            reject(err)
          }
          break
        case 'rejected':
          try {
            setTimeout(() => {
              resolvePromise(
                myPromise,
                onRejected(this.PromiseError),
                resolve,
                reject
              )
            }, 0)
          } catch (err) {
            reject(err)
          }

          break
      }
    })
    return myPromise
  }

  // 失败调用方法
  // catch相比then的failCallback更强，failCallback只能捕获promise的失败，而catch可以捕获promise.then内部执行代码的错误
  catch(failCallback) {
    this.then(undefined, failCallback)
  }

  //finally方法，无论成功还是失败，都会执行该方法
  finally(finalCallback) {
    return this.then(
      (value) => {
        //再增加一个then是为了考虑回调函数是一个异步调用的promise的情况
        return MyPromise.resolve(finalCallback()).then(() => value)
      },
      (err) => {
        return MyPromise.resolve(finalCallback()).then(() => {
          throw err
        })
      }
    )
  }

  // then的前置处理方法
  resolvePromise(promise, value, resolve, reject) {
    // 不允许返回promise自身，会导致循环调用
    if (value === promise) {
      return TypeError('Chaining cycle detected for promise #<Promise>')
    } else if (value instanceof MyPromise) {
      value.then(resolve, reject)
    } else {
      resolve(value)
    }
  }

  /**
   * Promise.all实现
   * 等待数组中的所有Promise全部执行完毕且都成功才返回结果
   * @param {Array} promises 传入Promise可迭代对象
   * @returns {Function} Promise
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let result = new Array(promises.length)
      let count = 0

      let setResolve = (count, result) => {
        count++
        if (count === promises.length) resolve(result)
      }

      for (let i = 0; i < promises.length; i++) {
        if (promises[i] instanceof Function) {
          result[i] = promises[i]()
          setResolve(count, result)
        } else if (promises[i] instanceof MyPromise) {
          promises[i].then(
            (value) => {
              result[i] = value
              setResolve(count, result)
            },
            (err) => {
              reject(err)
            }
          )
        } else {
          result[i] = promises[i]
          setResolve(count, result)
        }
      }
    })
  }
  /**
   * Promise.allSettled实现
   * 无论成功和失败，所有promise都执行，并且返回一个状态表
   */
  static allSettled(promises) {
    const results = []
    const len = promises.length
    let resolvedCount = 0
    for (let i = 0; i < len; i++) {
      promises[i]
        .then((value) => {
          results[i] = { status: 'fulfilled', value }
        })
        .catch((reason) => {
          results[i] = { status: 'rejected', reason }
        })
        .finally(() => {
          resolvedCount++
          if (resolvedCount === len) {
            this.resolve(results)
          }
        })
    }
  }
  /**
   * Promise.resolve实现
   */
  static resolve(value) {
    if (value instanceof MyPromise) return value

    return new MyPromise((resolve, reject) => {
      resolve(value)
    })
  }
  /**
   * Promise.reject实现
   */
  static resolve(value) {
    if (value instanceof MyPromise) return value

    return new MyPromise((resolve, reject) => {
      reject(value)
    })
  }
  /**
   * Promise.race实现
   * 只要有一个promise rejected/fulfilled返回的promise就会rejected/fulfilled
   */
  static race(promises) {
    let hasValue = false
    let hasError = false
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (data) => {
            !hasValue && !hasError && resolve(data)
            hasValue = true
          },
          (error) => {
            !hasValue && !hasError && reject(error)
            hasError = true
          }
        )
      }
    })
  }
}

// Test process

// promise三个状态：pending、fulfilled、rejected
// resolve是成功调用的函数(并将状态pending->fulfilled)，reject是失败调用的函数(并将状态pending->rejected)
// promise内部一般会封装一个异步函数，异步函数执行完毕后调用resolve或reject
// resolve和reject函数只能调用一次，且调用后promise的状态不可逆
const fn = new MyPromise((resolve, reject) => {
  // 这里的代码是立刻执行的
  setTimeout(() => {
    resolve(123)
  }, 2000)
})

fn.then((res) => {
  console.log(res) // 123
})
