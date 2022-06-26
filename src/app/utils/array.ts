// 判断数组是几维数组
export function dimensionArray(arr) {
  if (arr instanceof Array) {
    return Math.max(
      ...arr.map((item) => {
        return 1 + parseInt(dimensionArray(item))
      })
    )
  } else {
    return 0
  }
}
