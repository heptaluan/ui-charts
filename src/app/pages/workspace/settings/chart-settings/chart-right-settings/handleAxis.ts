

// 判断 key 在不在 data 对象的 key 值里面, 存在则返回对应的数组
function isAxisContainKeyFn(data, key) {
  let res = [];
  Object.keys(data).forEach(item => {
    if (item.indexOf(key) > -1 && item !== 'axistype') {
      res.push(item)
    }
  })
  return res;
}



export { isAxisContainKeyFn };