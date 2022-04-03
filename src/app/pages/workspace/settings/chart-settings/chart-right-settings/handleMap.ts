import { cloneDeep } from 'lodash';
import { isContainsFunc } from './helper';

// 判断有无映射
function hasMapFunc(data) {
  const noMapArr = [
    '8000000011111111001', // 动态 1
    '8000000011111111002', // 动态 2
    '8000000011111111003'  // 动态 3
  ];
  // 无 map 直接返回
  if (isContainsFunc(noMapArr, data.templateId) || !data.props.map) {
    return false;
  } else {
    return true;
  }
}

// 判断是否需要空值处理
function isNullItemMapFunc(data) {
  const nullItemMapArr = [
    '4612096174443311107',    // 分组气泡图
    '8000000011111111004',    // 圆堆积图
    '7955555555502346002',     // 散点图
    '7955555777700001201',     // 维诺图
  ];
  return isContainsFunc(nullItemMapArr, data.templateId);
}

// 需要空值处理的图表，处理对应的数据下拉列表
function handleNullItemMapDataFunc(data) {
  if (isNullItemMapFunc(data)) {
    return [...cloneDeep(data.dataSrc.data[0][0]), '(空)'];
  } else {
    return data.dataSrc.data[0][0];
  }
}

export { hasMapFunc, handleNullItemMapDataFunc, isNullItemMapFunc };