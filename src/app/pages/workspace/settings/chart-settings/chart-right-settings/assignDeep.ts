const isValidKey = (key) => {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype'
}

function isObject(val) {
  return typeof val === 'function' || Object.prototype.toString.call(val) === '[object Object]' || Array.isArray(val)
}

function isPrimitive(val) {
  return typeof val === 'object' ? val === null : typeof val !== 'function'
}

function isEmptyArrOrObject(val) {
  if (Array.isArray(val)) {
    return val.length === 0
  } else {
    return JSON.stringify(val) === '{}'
  }
}

const isEnumerable = Object.prototype.propertyIsEnumerable
const getSymbols = Object.getOwnPropertySymbols

const assignDeepFn = (target, ...args) => {
  let i = 0
  if (isPrimitive(target)) target = args[i++]
  if (!target) target = {}
  for (; i < args.length; i++) {
    if (isObject(args[i])) {
      for (const key of Object.keys(args[i])) {
        if (isValidKey(key)) {
          if (isObject(target[key]) && isObject(args[i][key])) {
            // 如果用户定义的是空值，不递归直接给空值
            if (isEmptyArrOrObject(args[i][key])) {
              target[key] = Array.isArray(args[i][key]) ? [] : {}
            } else if (Array.isArray(args[i][key])) {
              target[key] = args[i][key]
            } else {
              assignDeepFn(target[key], args[i][key])
            }
          } else {
            target[key] = args[i][key]
          }
        }
      }
      assignSymbols(target, args[i])
    }
  }
  return target
}

function assignSymbols(target, ...args) {
  if (!isObject(target)) {
    throw new TypeError('expected the first argument to be an object')
  }

  if (args.length === 0 || typeof Symbol !== 'function' || typeof getSymbols !== 'function') {
    return target
  }

  for (let arg of args) {
    let names = getSymbols(arg)

    for (let key of names) {
      if (isEnumerable.call(arg, key)) {
        target[key] = arg[key]
      }
    }
  }
  return target
}

export default assignDeepFn
