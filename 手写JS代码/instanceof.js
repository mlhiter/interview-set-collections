// instanceof操作符用来判断构造函数的prototype属性是否出现在对象的原型链中的任意位置

//left为要检测的对象，right为Object/Array/Function
function myInstanceof(left, right) {
  //获取对象的原型
  let proto = Object.getPrototypeOf(left)
  //获取构造函数的prototype对象
  let prototype = right.prototype
  //判断构造函数的prototype对象是否在对象的原型链上
  while (true) {
    if (!proto) return false
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}
