// 模拟new过程
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.sayAge = function () {
  console.log(this.age)
}
// 模拟函数，传入构造函数和构造函数的参数
function newFun() {
  // 1,新建一个对象
  var obj = {}
  // 2,设置原型链
  var Constructor = Array.shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  // 3,将构造函数的this指向新对象obj并执行构造函数代码
  var ret = Constructor.apply(obj, arguments)
  // 4,如果构造函数没有人为返回一个对象类型的值，则返回这个新对象的obj，否则直接返回这个对象类型值
  return typeof ret === 'object' ? ret : obj
}

// 测试
var a = newFun(Person, 'lcy', '22')
console.log(a.name) // lcy
a.sayAge() // 22
