// 观察者模式
// https://juejin.cn/post/6978728619782701087

// 被观察者
class Subject {
  constructor() {
    this.observerList = []
  }
  addObserver(observer) {
    this.observerList.push(observer)
  }
  removeObserver(observer) {
    const index = this.observerList.findIndex((o) => o.name === observer.name)
    this.observerList.splice(index, 1)
  }
  notifyObservers(message) {
    const observers = this.observerList
    observers.forEach((observer) => observer.notified(message))
  }
}

// 观察者
class Observer {
  constructor(name, subject) {
    this.name = name
    if (subject) {
      subject.addObserver(this)
    }
  }
  notified(message) {
    console.log(this.name, 'got message:', message)
  }
}

// 测试过程
const subject = new Subject()
const observerA = new Observer('observerA', subject)

const observerB = new Observer('observerB')
subject.addObserver(observerB)

subject.notifyObservers('hello from subject')

subject.removeObserver(observerA)
subject.notifyObservers('hello again')
