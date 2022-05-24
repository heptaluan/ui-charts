import { unzip, cloneDeep, uniq, compact, flatten, zip } from 'lodash'
import { down14Func } from './helper'

let isRow: null | boolean = null

// 处理图表数据，针对不同的图表进行对应的处理，返回处理后的数据
function handleAllChartsData(newBlock) {
  let legendList = []
  // 根据图表类型确定颜色列表依据长度（横向或者竖向）
  switch (newBlock.templateSwitch) {
    case 'cross':
      // 1.显示第一列 map 里面 第一个isLegend = true 处理逻辑与目前斜率图一致
      if (newBlock.props.map[0][0]['isLegend']) {
        legendList = unzip(newBlock.dataSrc.data[0])[0].slice(1)
        isRow = true
      } else {
        // 2.正常情况 显示第一行
        legendList = newBlock.dataSrc.data[0][0].slice(1)
        isRow = false
        // 根据 map 处理一遍数据
        let arr = cloneDeep(legendList)
        newBlock.props.map[0].forEach((item, index) => {
          if (index > 0 && !item['configurable']) {
            arr[index - 1] = undefined
          }
        })
        legendList = arr.filter((item) => item)
      }
      break
    case 'cross-time':
      legendList = newBlock.dataSrc.data[0][0].slice(1)
      isRow = false
      // 针对斜率图 显示第一列
      if (newBlock.templateId === '154778232785223023') {
        legendList = unzip(newBlock.dataSrc.data[0])[0].slice(1)
        isRow = true
      }
      break
    case 'obj-n-value-time':
      const trueIndex = getPacketCircleChartMap(newBlock)
      // 行
      legendList = uniq(unzip(newBlock.dataSrc.data[0])[trueIndex].slice(1))
      isRow = true
      break
    case 'key-value': {
      const trueIndex = getIndexByMapType(newBlock)
      // 1.变化瀑布图 2个 color
      if (newBlock.templateId === '5544734748594536330') {
        legendList.length = 2
        legendList[0] = '收入'
        legendList[1] = '支出'
        // 2.直方图
      } else if (newBlock.templateId === '7955555555502346003') {
        legendList = parseHistogramChartLegend(newBlock)
        // 3个进度图 圆环进度图 / 半圆环进度图 / 条形进度图 只取前两个颜色
      } else if (
        newBlock.templateId === '154778171740391769' ||
        newBlock.templateId === '154777820323716078' ||
        newBlock.templateId === '154778145806026722'
      ) {
        legendList.length = 1
        // 取第一行第一个值
        legendList[0] = unzip(newBlock.dataSrc.data[0])[trueIndex][1]
        // legendList[1] = '#空白';
      } else if (newBlock.templateId === '444746070325460995') {
        // 4.显示第一行 基础折线图
        legendList = newBlock.dataSrc.data[0][trueIndex].slice(1)
      } else {
        // 5.正常
        legendList = unzip(newBlock.dataSrc.data[0])[trueIndex].slice(1)
        isRow = true
      }
      break
    }
    case 'tree':
    case 'sunburst':
      // 计算一级节点
      const sunData = newBlock.dataSrc.data[0]
      const sunMap = newBlock.props.map[0]
      const { root } = solveDataHierarchyWithoutValue(sunData, sunMap)
      const sunLegendList = []

      if (root.name !== '') {
        sunLegendList.push(root.name)
      }

      root.children.forEach((v) => {
        sunLegendList.push(v.name)
      })

      legendList = sunLegendList
      break
    case 'tree-value': {
      const trueIndex = getIndexByMapType(newBlock)
      legendList = uniq(unzip(newBlock.dataSrc.data[0])[trueIndex]).slice(1)
      break
    }
    case 'link-obj-valued': {
      // 目前只有分组力导向图
      let trueIndex = 0
      newBlock.props.map[1].forEach((item) => {
        if (item['function'] === 'typeCol') {
          trueIndex = item.index
        }
      })
      legendList = uniq(unzip(newBlock.dataSrc.data[1])[trueIndex]).slice(1)
      break
    }
    case 'link-typed':
    case 'obj-type-value': {
      const typeIndex = getIndexByMapType(newBlock, 'typeCol')
      const objIndex = getIndexByMapType(newBlock)
      const trueIndex = typeof typeIndex === 'number' ? typeIndex : objIndex
      legendList = uniq(unzip(newBlock.dataSrc.data[0])[trueIndex]).slice(1)
      // 人口金字塔特殊处理
      if (newBlock.templateId === '5544734748594536487') {
        legendList.length = 2
      }
      break
    }
    case 'obj-n-value': {
      let trueIndex = 0
      // 散点图 分组气泡图 三元图
      if (
        newBlock.templateId === '7955555555502346002' ||
        newBlock.templateId === '4612096174443311107' ||
        newBlock.templateId === '7955555777700001209'
      ) {
        trueIndex = getIndexByMapType(newBlock, 'typeCol')
      } else {
        trueIndex = getIndexByMapType(newBlock)
      }
      // 1.obj-n-value：区间面积图7612096176663355103。纵向杠铃图7955555666601234508 他的legendlist的取的首行数据。
      if (newBlock.templateId === '7612096176663355103' || newBlock.templateId === '7955555666601234508') {
        // 显示第一行
        legendList = newBlock.dataSrc.data[0][0].slice(1)
        isRow = false
        // 2.还有子弹图，取得也是首行，但是少一个“最小值”
      } else if (newBlock.templateId === '6543210123456536001') {
        // 取第一列去掉第一行以及最小值
        legendList = newBlock.dataSrc.data[0][trueIndex].slice(1).filter((item) => item !== '最小值')
        isRow = false
        // 蝴蝶图 7955555777700001204
      } else if (newBlock.templateId === '7955555777700001204') {
        legendList = newBlock.dataSrc.data[0][0].slice(1)
        legendList.length = 2
        isRow = false
      } else {
        // 3.正常 取行
        if (unzip(newBlock.dataSrc.data[0])[trueIndex]) {
          legendList = uniq(unzip(newBlock.dataSrc.data[0])[trueIndex].slice(1))
        } else {
          legendList.length = 1
        }
        isRow = true
      }
      break
    }

    case 'sankey':
      // let indexList = [];
      // newBlock.props.map[0].forEach((o, i) => {
      //   if (o.isLegend) {
      //     indexList.push(i);
      //   }
      // })

      let list1 = []
      let list2 = []
      // 根据 map 定义取第几列的值
      const trueIndex1 = getIndexByMapType(newBlock)
      const trueIndex2 = getIndexByMapType(newBlock, 'targetCol')

      newBlock.dataSrc.data[0].forEach((o, i) => {
        if (Number(i) > 0) {
          // 之所以两列，是需要先去重在拼接
          // list1.push(o[indexList[0]]);
          // list2.push(o[indexList[1]]);
          list1.push(o[trueIndex1])
          list2.push(o[trueIndex2])
        }
      })

      legendList = compact(uniq(flatten(zip(list1, list2))))
      break
    default:
      break
  }
  return legendList
}

function handleColorList(newBlock, changeRowCol = { key: null, pos: { row: null, col: null } }) {
  // 表格图表无需处理颜色
  if (newBlock.templateId === '7955555555502346001') return
  //  cross 颜色是单色 直接返回
  if (newBlock.props.colors.type === 'single' && newBlock.templateSwitch === 'cross') {
    return cloneDeep(newBlock.props.colors.list)
  }
  // 编辑数据处改变后的新数组数据 使用补齐的 blockService
  let legendList = handleAllChartsData(newBlock)
  let oldColorList = cloneDeep(newBlock.props.colors.list) // 旧颜色列表
  // 新数据长度减去旧颜色差值，小于等于0，将颜色变成（旧颜色列表取新数据长度-1），
  // 数据多一个行首需要-1，否则按规则变颜色（旧颜色最后一个颜色数字，后面数据颜色递增，字符串，后面从0开始递增，最大为14）
  let diffNum = legendList.length - oldColorList.length
  if (diffNum <= 0) {
    // 针对清空操作
    if (legendList.length < 1) {
      oldColorList.length = 0
    } else {
      let twoNumColor = [
        '154778171740391769', // 圆环进度图
        '154777820323716078', // 半圆环进度图
        '154778145806026722', // 条形进度图
      ]
      // 针对 圆环进度图 / 半圆环进度图 / 条形进度图，始终只有有两个颜色
      if (twoNumColor.indexOf(newBlock.templateId) > -1) {
        oldColorList.length = 2
      }
      // 删除数据
      if (changeRowCol.key) {
        // 处理 obj-n-value 中删除行 与 cross 中删除行
        if ((newBlock.templateSwitch === 'obj-n-value' || newBlock.templateSwitch === 'cross') && isRow) {
          let start = changeRowCol.pos['row'] === 0 ? 0 : changeRowCol.pos['row'] - 1
          oldColorList.splice(start, 1)
        } else {
          oldColorList.length = legendList.length
        }
      } else {
        oldColorList.length = legendList.length
      }
    }
  } else {
    // 如果是在中间添加行 / 列, key 不为空，补 0 ，否则按照规则补色
    if (changeRowCol.key && isRow !== null) {
      let tmp = isRow ? 'row' : 'col'
      let start = changeRowCol.pos[tmp] === 0 ? 0 : changeRowCol.pos[tmp] - 1
      oldColorList.splice(start, 0, 0)
      // 处理有图片的情况
      if (newBlock.props.pictures && newBlock.props.pictures.urlList) {
        let oldUrlList = cloneDeep(newBlock.props.pictures.urlList)
        oldUrlList.splice(start, 0, null)
        newBlock.props.pictures.urlList = oldUrlList
      }
      // 处理有图标的情况
      if (newBlock.props.pictures && newBlock.props.pictures.svglist) {
        let oldSvgList = cloneDeep(newBlock.props.pictures.svglist)
        oldSvgList.splice(start, 0, newBlock.props.pictures.svglist[0])
        newBlock.props.pictures.svglist = oldSvgList
      }
    } else {
      let copyList = cloneDeep(oldColorList)
      let lastNum
      if (copyList.length > 0) {
        lastNum = copyList.pop()
      } else {
        lastNum = -1
      }
      // 判断颜色列表最后一个数字是否是数字，数字递增，字符串则从 0 开始， 0 - 14 为主题色
      if (typeof lastNum === 'number') {
        for (let i = 0; i < diffNum; i++) {
          let num = lastNum + i + 1
          if (num > 14) {
            num = down14Func(num)
          }
          oldColorList.push(num)
        }
      } else {
        for (let i = 0; i < diffNum; i++) {
          let num = i
          if (num > 14) {
            num = down14Func(num)
          }
          oldColorList.push(num)
        }
      }
    }
  }
  newBlock.props.colors.list = oldColorList
  return newBlock.props.colors.list
}

// 单独处理直方图的图例
function parseHistogramChartLegend(newBlock) {
  let options = ['groupNum', 'groupDistance']
  let key = newBlock.props.display.histogramSection.key
  let sectionValue = newBlock.props.display.histogramSection.sectionValue
  let dataList = unzip(newBlock.dataSrc.data[0])[1].slice(1)

  // x 轴值域
  let minNum = Math.floor(Reflect.apply(Math.min, undefined, dataList)) || 0
  let maxNum = Math.ceil(Reflect.apply(Math.max, undefined, dataList)) || 1
  let newDataList = []

  // 数据处理
  if (options.indexOf(key) == 0) {
    const diff = maxNum - minNum
    const dis = diff / sectionValue
    maxNum = maxNum + dis
    for (let i = minNum; i < maxNum; i = i + dis) {
      newDataList.push(parseFloat(i.toFixed(1)))
    }
  } else if (options.indexOf(key) == 1) {
    maxNum = maxNum + parseFloat(sectionValue)
    for (let i = minNum; i < maxNum; i = i + parseFloat(sectionValue)) {
      newDataList.push(parseFloat(i.toFixed(1)))
    }
  }
  let legendData = new Array()
  for (let j = 0; j < newDataList.length - 1; j++) {
    legendData.push(newDataList[j] + '~' + newDataList[j + 1])
  }
  return legendData
}

// 旭日图提取 legend
function solveDataHierarchyWithoutValue(dataset, map) {
  let sourceCol = 0, // 父节点列
    targetCol = 0 // 子节点列

  map.forEach(function (d) {
    if (d.function === 'sourceCol') {
      sourceCol = d.index
    } else if (d.function === 'targetCol') {
      targetCol = d.index
    }
  })

  const nodesArr = []
  const nodesObj = {}
  let nodeIndex = 0

  const dataLength = dataset.length
  for (let i = 1; i < dataLength; i++) {
    const row = dataset[i]
    const source = row[sourceCol],
      target = row[targetCol]

    // 如果 source 与 target 为空，忽略，如果两者相同，忽略
    if (!source || !target || source === target) {
      continue
    }

    // 有未声明的 source 节点，新增
    if (!nodesObj[source]) {
      const sourceNode = {
        name: source,
        index: nodeIndex,
      }

      nodesObj[source] = sourceNode
      nodesArr.push(sourceNode)
      nodeIndex++
    }

    // 有未声明的 target 节点，新增
    if (!nodesObj[target]) {
      const targetNode = {
        name: target,
        index: nodeIndex,
      }

      nodesObj[target] = targetNode
      nodesArr.push(targetNode)
      nodeIndex++
    }

    // 将 source 节点赋值给变量 s
    const s = nodesObj[source]

    // 将 target 节点赋值给变量 t
    const t = nodesObj[target]

    // 若 target 对象的 parent 已经存在，则不再进行操作
    if (!t.parent) {
      t.parent = s
      // 若 source 对象 children 为 null，创建数组
      if (!s.children) {
        s.children = [t]
      } else {
        s.children.push(t)
      }
    }
  }

  // 根节点
  let root = null

  // 没有父节点的节点数组
  const nodesWithoutParent = nodesArr.filter((d) => !d.parent)

  if (nodesWithoutParent.length === 1) {
    // 只有一个节点没有父节点，那么这个节点就是根节点
    root = nodesWithoutParent[0]
  } else if (nodesWithoutParent.length > 1) {
    // 有多个节点没有父节点，那么新建一个对象作为根节点
    root = {
      name: '',
      children: nodesWithoutParent,
    }
  } else {
    // 如果找不到没有父节点的节点，说明数据陷入循环，抛出错误
    // 勉强将相关值设为空
    root = {
      name: '',
      children: [],
    }
    // throw new Error(`数据有错误，节点关系陷入循环，找不到根节点！`);
  }

  noteNodesDepth(root)

  return {
    nodesObj: nodesObj,
    nodesArr: nodesArr,
    root: root,
  }
}

function noteNodesDepth(node) {
  // 从上而下计算，下层直接从上层获取值，不需要返回值
  const depth = node.depth ? node.depth : (node.depth = 0)
  if (node.children) {
    node.children.forEach(function (d) {
      d.depth = depth + 1
      noteNodesDepth(d)
    })
  }
}

// 根据映射获取 index
function getIndexByMapType(block, type = 'objCol') {
  let trueIndex = 0
  block.props.map[0].forEach((item) => {
    if (item['function'] === type) {
      trueIndex = item.index
    }
  })
  return trueIndex
}

// 获取圆堆积图映射显示
function getPacketCircleChartMap(block) {
  let trueIndex = 1
  block.props.map[0].some((item) => {
    if (item['function'] === 'typeCol' && item.index) {
      trueIndex = item.index
      return true
    }
  })
  return trueIndex
}

export { handleColorList, handleAllChartsData }
