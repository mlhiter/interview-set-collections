//手写promise
//包含四个api：new Promise().catch() new Promise().finally() Promise.all() Promise.resolve()
class MyPromise {
  // 构造函数：传入resolve和reject函数
  constructor(executor) {
    executor(this.resolve, this.reject)
  }
  PromiseValue //promise内置value
  PromiseStatus = 'pending' //promise状态分别为pending、rejected、resolved，默认状态pending
  PromiseError //promise内置error
  resolveCallbackArray = [] //收集resolve的回调函数集合
  rejectCallbackArray = [] //收集reject的回调函数集合

  // 成功回调函数
  resolve = (value) => {
    if (this.PromiseStatus !== 'pending') return
    this.promiseValue = value
    this.PromiseStatus = 'resolved'
    while (this.resolveCallbackArray.length) this.resolveCallbackArray.shift()()
  }

  // 失败回调函数
  reject = (error) => {
    if (this.PromiseStatus !== 'pending') return
    this.PromiseError = error
    this.PromiseStatus = 'rejected'
    while (this.rejectCallbackArray.length) this.rejectCallbackArray.shift()()
  }
  // 链式调用方法
  then(successCallback, failCallback) {
    // 保证存在成功函数和失败函数
    successCallback = successCallback ? successCallback : (value) => value
    failCallback = failCallback
      ? failCallback
      : (err) => {
          throw err
        }
    // 定义处理
    let myPromise = new MyPromise((resolve, reject) => {
      switch (this.PromiseStatus) {
        case 'pending':
          this.resolveCallbackArray.push(
            // 为了在promise实例内部拿到该实例自身，需要使用setTimeout处理，因为promise在微任务执行完毕之后才会执行宏任务中的setTimeout
            setTimeout(() => {
              try {
                resolvePromise(
                  myPromise,
                  successCallback(this.promiseValue),
                  resolve,
                  reject
                )
              } catch (err) {
                reject(err)
              }
            }, 0)
          )
          this.rejectCallbackArray.push(() => {
            setTimeout(() => {
              try {
                resolvePromise(() => {
                  myPromise, failCallback(this.PromiseValue)
                  resolve, reject
                })
              } catch (err) {
                reject(err)
              }
            }, 0)
          })
          break
        case 'resolved':
          try {
            setTimeout(() => {
              resolvePromise(
                promise,
                successCallback(this.PromiseValue),
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
                promise,
                failCallback(this.PromiseError),
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
  //前置包装函数
  resolvePromise(promise, value, resolve, reject) {
    // 不允许返回promise自身
    if (promise === value) {
      //return作用是为了中断执行
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
   * @param {Array} array 传入Promise可迭代对象
   * @returns {Function} Promise
   */
  static all(array) {
    return new MyPromise((resolve, reject) => {
      let result = new Array(array.length)
      let count = 0
      let setResolve = (count, length, result) => {
        if (count === length) resolve(result)
      }
      for (let i = 0; i < array.length; i++) {
        //参数为函数
        if (array[i] instanceof Function) {
          result[i] = array[i]()
          count++
          setResolve(count, array.length, result)
          //参数为MyPromise的对象
        } else if (array[i] instanceof MyPromise) {
          array[i].then(
            (value) => {
              result[i] = value
              count++
              setResolve(count, array.length, result)
            },
            (err) => {
              reject(err)
            }
          )
          //其他类型参数
        } else {
          result[i] = array[i]
          count++
          setResolve(count, array.length, result)
        }
      }
    })
  }
  /**
   * Promise.allSettled实现
   * 无论成功和失败，所有promise都执行，并且返回一个状态表
   */
  static allSettled(array) {
    const results = []
    const len = array.length
    let resolvedCount = 0
    for (let i = 0; i < len; i++) {
      array[i]
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
    // value为Promise直接返回
    if (value instanceof MyPromise) return value
    // value为值则代表该值为promise兑现值
    return new MyPromise((resolve, reject) => {
      resolve(value)
    })
  }
  /**
   * Promise.race实现
   * 只要有一个promise rejected/fulfilled返回的promise就会rejected/fulfilled
   */
  static race(array) {
    let hasValue = false
    let hasError = false
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        array[i].then(
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

const fn = new MyPromise((resolve, reject) => {
  resolve(123)
})
fn.then((success, error) => {
  success()
  // console.log('success')
})
