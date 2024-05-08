// 手写发布订阅机制

// 消息发布中心
class PubSub {
  constructor() {
    this.messages = {}
    this.listeners = {}
  }
  // 发布消息
  // params: 消息代号，消息内容
  publish(type, content) {
    const existContent = this.messages[type]
    if (!existContent) {
      this.messages[type] = []
    }
    this.messages[type].push(content)
  }
  // 订阅消息
  // params: 消息代号，订阅后处理程序
  subscribe(type, cb) {
    const existListener = this.listeners[type]
    if (!existListener) {
      this.listeners[type] = []
    }
    this.listeners[type].push(cb)
  }
  // 通知消息
  // params: 消息代号
  notify(type) {
    const messages = this.messages[type]
    const subscribers = this.listeners[type] || []
    subscribers.forEach((cb) => cb(messages))
  }
}

// 发布者
class Publisher {
  //params: 发布者名字，消息发布中心
  constructor(name, context) {
    this.name = name
    this.context = context
  }
  // 发布消息：消息类型+消息内容
  publish(type, content) {
    this.context.publish(type, content)
  }
}

// 订阅者
class subscriber {
  constructor(name, context) {
    this.name = name
    this.context = context
  }
  // 订阅消息：消息类型+消息处理程序
  subscribe(type, cb) {
    this.context.subscribe(type, cb)
  }
}

// 测试过程
const TYPE_A = 'music'
const TYPE_B = 'movie'
const TYPE_C = 'novel'

const pubsub = new PubSub()

// 发布者发布消息
const publisherA = new Publisher('publisherA', pubsub)
publisherA.publish(TYPE_A, 'we are young')
publisherA.publish(TYPE_B, 'the silicon valley')

const publisherB = new Publisher('publisherB', pubsub)
publisherB.publish(TYPE_A, 'stronger')

const publisherC = new Publisher('publisherC', pubsub)
publisherC.publish(TYPE_B, 'imitation game')

// 订阅者订阅消息
const subscriberA = new Subscriber('subscriberA', pubsub)
subscriberA.subscribe(TYPE_A, (res) => {
  console.log('subscriberA received', res)
})
const subscriberB = new Subscriber('subscriberB', pubsub)
subscriberB.subscribe(TYPE_C, (res) => {
  console.log('subscriberB received', res)
})
const subscriberC = new Subscriber('subscriberC', pubsub)
subscriberC.subscribe(TYPE_B, (res) => {
  console.log('subscriberC received', res)
})

pubsub.notify(TYPE_A)
pubsub.notify(TYPE_B)
pubsub.notify(TYPE_C)
