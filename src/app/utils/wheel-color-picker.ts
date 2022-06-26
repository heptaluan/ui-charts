//保留n位小数
export function RoundNum(value, n) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

/**
 *
 * @param {Number} H 色相 [0,360)
 * @param {Number} S 饱和度 [0,1]
 * @param {Number} L 亮度 [0,1]
 * @param {Boolean} stringMode 是否返回字符串模式
 */
export function HSL2RGB(H = 0, S = 0, L = 0, stringMode = false) {
  if (H < 0) {
    H = -H
  }
  if (H > 360) {
    H = H - 360
  }
  if (S > 1) {
    S = 1
  }
  const C = (1 - Math.abs(2 * L - 1)) * S
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1))
  const m = L - C / 2
  const vRGB = []
  if (H >= 0 && H < 60) {
    vRGB.push(C, X, 0)
  } else if (H >= 60 && H < 120) {
    vRGB.push(X, C, 0)
  } else if (H >= 120 && H < 180) {
    vRGB.push(0, C, X)
  } else if (H >= 180 && H < 240) {
    vRGB.push(0, X, C)
  } else if (H >= 240 && H < 300) {
    vRGB.push(X, 0, C)
  } else if (H >= 300 && H < 360) {
    vRGB.push(C, 0, X)
  }
  const [vR, vG, vB] = vRGB
  const R = 255 * (vR + m)
  const G = 255 * (vG + m)
  const B = 255 * (vB + m)

  if (stringMode) {
    return `rgb(${R},${G},${B})`
  }

  return { R, G, B }
}

/**
 * @description rgb转化为hsl
 * @param {Number} R [0,255]
 * @param {Number} G [0,255]
 * @param {Number} B [0,255]
 * @param {Boolean} stringMode 是否返回字符串模式
 */
export function RGB2HSL(R = 0, G = 0, B = 0, stringMode = false) {
  const _R = R / 255
  const _G = G / 255
  const _B = B / 255
  const Cmax = Math.max(_R, _G, _B)
  const Cmin = Math.min(_R, _G, _B)
  const V = Cmax - Cmin

  let H = 0
  if (V === 0) {
    H = 0
  } else if (Cmax === _R) {
    H = 60 * (((_G - _B) / V) % 6)
  } else if (Cmax === _G) {
    H = 60 * ((_B - _R) / V + 2)
  } else if (Cmax === _B) {
    H = 60 * ((_R - _G) / V + 4)
  }

  H = Math.floor(backCycle(H, 360))
  const L = numberFixed((Cmax + Cmin) / 2)
  const S = V === 0 ? 0 : numberFixed(V / (1 - Math.abs(2 * L - 1)))

  if (stringMode) {
    return `hsl(${H},${numberFixed(100 * S)}%,${numberFixed(100 * L)}%)`
  }

  return { H, S, L }
}

// 数字转百分比
export function toPercent(point) {
  if (point == 0) {
    return 0
  }
  var str = Number(Number(point) * 100).toFixed(2)
  str += '%'
  return str
}

// utils
function backCycle(num, cycle) {
  let index = num % cycle
  if (index < 0) {
    index += cycle
  }
  return index
}

function numberFixed(num = 0, count = 3) {
  const power = Math.pow(10, count)
  return Math.floor(num * power) / power
}
