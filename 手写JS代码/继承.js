// 1，原型链方式
// 存在问题：原型包含的引用类型数据会被所有实例共享；子类在实例化时不能给父类构造函数传参
function Animal() {
  this.colors = ['black', 'white']
}
Animal.prototype.getColor = function () {
  return this.colors
}

function Dog() {}
Dog.prototype = new Animal()

var dog1 = new Dog()
dog1.colors.push('brown')

var dog2 = new Dog()
console.log(dog2.colors) // ['black', 'white', 'brown']

// 2，构造函数方式
// 解决了1方法的问题
// 问题：方法必须定义在构造函数中，所以导致每次创建子类实例都会创建一遍方法
function Animal(name) {
  this.name = name
  this.getName = function () {
    return this.name
  }
}
function Dog(name) {
  Animal.call(this, name)
}
Dog.prototype = new Animal()

// 3，组合继承
// 问题：调用了两次父类构造函数，第一次在new Animal()，第二次在Animal.call()
function Animal(name) {
  this.name = name
  this.colors = ['black', 'white']
}
Animal.prototype.getName = function () {
  return this.name
}
function Dog(name, age) {
  Animal.call(this, name)
  this.age = age
}
Dog.prototype = new Animal()
Dog.prototype.constructor = Dog

var dog1 = new Dog('奶昔', 2)
dog1.colors.push('brown')
var dog2 = new Dog('哈赤', 1)
console.log(dog2)
// { name: "哈赤", colors: ["black", "white"], age: 1 }

// 4，寄生式组合继承
function Animal(name) {
  this.name = name
  this.colors = ['black', 'white']
}
Animal.prototype.getName = function () {
  return this.name
}
function Dog(name, age) {
  Animal.call(this, name)
  this.age = age
}

Dog.prototype = new Animal()
Dog.prototype.constructor = Dog

Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

// 5，class实现继承
class Animal {
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}

class Dog extends Animal {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
