// 判断是否是 cross 图表
function isCrossChartFunc(data) {
  return data.templateSwitch === 'cross';
}

// 判断是否是折柱混合图表
function isBarLineChartFunc(data) {
  return data.templateId === '5544734748594536332';
}

// 判断是否是圆堆积图
function isPackChartFunc(data) {
  return data.templateId === '8000000011111111004';
}

// 处理大于 14 的数字转成 0 - 14
function down14Func(num) {
  if (num % 15 === 0) {
    num = 0;
  } else {
    num = Math.abs(num - Math.floor(num / 15) * 15);
  }
  return num;
}

// 判断数组中是否包含元素
function isContainsFunc(arr, target) {
  return arr.indexOf(target) > -1;
}

// 找出目标元素对应数组下标
function findTargetIndexFunc(arr, target) {
  return arr.indexOf(target);
}

// 判断两个数组内容是否相等
function equalArrayFunc(arrayA, arrayB) {
  if (!arrayB) {
    return false;
  }
  if (arrayA.length != arrayB.length) {
    return false;
  }
  for (var i = 0, l = arrayA.length; i < l; i++) {
    if (arrayA[i] instanceof Array && arrayB[i] instanceof Array) {
      if (!arrayA[i].equals(arrayB[i]))
        return false;
    } else if (arrayA[i] != arrayB[i]) {
      return false;
    }
  }
  return true;
}

export {
  isCrossChartFunc,
  isBarLineChartFunc,
  down14Func,
  isContainsFunc,
  findTargetIndexFunc,
  isPackChartFunc,
  equalArrayFunc
};
