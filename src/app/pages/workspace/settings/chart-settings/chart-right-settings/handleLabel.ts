import { isBarLineChartFunc, isContainsFunc, isPackChartFunc } from './helper'

// 标签 5
const labelFiveArr = [
  '8000000011111111001', // 动态条形图
  '8000000011111111002', // 动态折线变化图
  '8000000011111111003', // 动态折线排名图
]

// 标签 1
function isLabelOne(data): boolean {
  return data.props.label.display !== undefined
}

// 标签 2 (除了折柱混合 并且 没有 display 并且有 textLabel 或者 numberLabel)
function isLabelTwo(data): boolean {
  return data.props.label.display === undefined
}

// 标签 3（折柱混合）
function isLabelThree(data): boolean {
  return isBarLineChartFunc(data)
}

// 标签 4 圆堆积图(动态图表4)
function isLabelFour(data): boolean {
  return isPackChartFunc(data)
}

// 标签 5 其他动态图表
function isLabelFive(data): boolean {
  return isContainsFunc(labelFiveArr, data.templateId)
}

export { isLabelOne, isLabelTwo, isLabelThree, isLabelFour, isLabelFive }
