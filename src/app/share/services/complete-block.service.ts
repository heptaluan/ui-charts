import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class CompleteBlockService {

  constructor() { }

  // // 格式化 legendList chart-right-setting 里的 parseLegendList 暂时不抽出来
  // parseLegendList(newBlock, legendList = null, legendIndex = null) {
  //   // legend 数据初始化
  //   if (newBlock.props.colors.type === 'multiple') {
  //     const templateSwitch = newBlock.templateSwitch;

  //     if (templateSwitch === 'cross') {

  //       // 针对 D3 雷达图单独处理
  //       if (newBlock.templateId === '5544734748594536491') {
  //         let index = _.findIndex(newBlock.props.map[0], (o: any) => {
  //           return o.isLegend === true;
  //         })

  //         if (index === -1) {
  //           legendList = newBlock.dataSrc.data[0][0].slice(1);
  //         } else {
  //           legendIndex = newBlock.props.map[0][index].index;

  //           let list = [];
  //           _.forEach(newBlock.dataSrc.data[0], (o, i) => {
  //             if (Number(i) > 0) {
  //               list.push(o[legendIndex]);
  //             }
  //           });
  //           legendList = list;
  //         }
  //       }

  //       // 针对多轴气泡图 , 斜率图和 echarts 雷达图单独处理，取第一列数据作为 legend
  //       else if (newBlock.templateId === '3612096174443311123' || newBlock.templateId === '451905388296536065' || newBlock.templateId === '154778232785223023') {
  //         legendList = _.unzip(newBlock.dataSrc.data[0])[0].slice(1);
  //       }

  //       else {
  //         const dataMap = newBlock.props.map[0];
  //         const dataSrc = newBlock.dataSrc.data[0];
  //         let list = [];

  //         for (let i = 1; i < dataMap.length; i++) {
  //           if (dataMap[i].configurable === true) {
  //             list.push(dataSrc[0][i])
  //           }
  //         }
  //         legendList = list
  //       }

  //     } else if (_.includes(['key-value', 'obj-n-value'], templateSwitch)) {

  //       try {
  //         legendIndex = newBlock.props.map[0][_.findIndex(newBlock.props.map[0], (o: any) => {
  //           return o.isLegend === true;
  //         })].index;
  //       } catch (error) {
  //         console.log(error)
  //       }

  //       let list = [];

  //       // 矩形树图 - 单层
  //       if (newBlock.templateId === '5544734748594536503') {
  //         _.forEach(newBlock.dataSrc.data[0].sort((a, b) => { return b[1] - a[1] }), (o, i) => {
  //           if (Number(i) > 0) {
  //             list.push(o[legendIndex]);
  //           }
  //         });
  //         legendList = list;
  //       } else {
  //         _.forEach(newBlock.dataSrc.data[0], (o, i) => {
  //           if (Number(i) > 0) {
  //             list.push(o[legendIndex]);
  //           }
  //         });

  //         // 分组气泡图
  //         if (newBlock.templateId === '4612096174443311107') {
  //           legendList = _.uniq(list);
  //         } else {
  //           legendList = list;
  //         }

  //         // 变化瀑布图单独处理
  //         if (newBlock.templateId === '5544734748594536330') {
  //           legendList.length = 2;
  //           legendList[0] = '收入';
  //           legendList[1] = '支出';
  //         }

  //         // 圆环进度图 / 半圆环进度图 / 条形进度图 只取前两个颜色
  //         if (newBlock.templateId === '154778171740391769' || newBlock.templateId === '154777820323716078' || newBlock.templateId === '154778145806026722') {
  //           legendList.length = 2;
  //           legendList[1] = '#空白';
  //         }

  //         // 去重
  //         if (templateSwitch === 'key-value') {
  //           legendList = _.uniq(list);
  //         }

  //       }

  //     } else if (_.includes(['obj-type-value'], templateSwitch)) {

  //       legendIndex = newBlock.props.map[0][_.findIndex(newBlock.props.map[0], (o: any) => {
  //         return o.isLegend === true;
  //       })].index;

  //       let list = [];
  //       _.forEach(newBlock.dataSrc.data[0], (o, i) => {
  //         if (Number(i) > 0) {
  //           list.push(o[legendIndex]);
  //         }
  //       });

  //       legendList = _.uniq(list);

  //     } else if (_.includes(['tree-value'], templateSwitch)) {

  //       if (newBlock.templateId === '4612096174443311115') {
  //         let indexList = [];
  //         let list1 = [];
  //         let list2 = [];

  //         _.forEach(newBlock.props.map[0], (o, i) => {
  //           if (o.isLegend) {
  //             indexList.push(i);
  //           }
  //         })

  //         _.forEach(newBlock.dataSrc.data[0], (o, i) => {
  //           if (Number(i) > 0) {
  //             list1.push(o[indexList[0]]);
  //             list2.push(o[indexList[1]]);
  //           }
  //         })
  //         legendList = _.uniq(list1.concat(list2))
  //       } else {
  //         legendIndex = newBlock.props.map[0][_.findIndex(newBlock.props.map[0], (o: any) => {
  //           return o.isLegend === true;
  //         })].index;

  //         let list = [];

  //         _.forEach(newBlock.dataSrc.data[0], (o, i) => {
  //           if (Number(i) > 0) {
  //             list.push(o[legendIndex]);
  //           }
  //         });

  //         legendList = _.uniq(list);
  //       }

  //     } else if (templateSwitch === 'sankey') {

  //       let indexList = [];
  //       let list1 = [];
  //       let list2 = [];

  //       _.forEach(newBlock.props.map[0], (o, i) => {
  //         if (o.isLegend) {
  //           indexList.push(i);
  //         }
  //       })

  //       _.forEach(newBlock.dataSrc.data[0], (o, i) => {
  //         if (Number(i) > 0) {
  //           // 之所以两列，是需要先去重在拼接
  //           list1.push(o[indexList[0]]);
  //           list2.push(o[indexList[1]]);
  //         }
  //       })
  //       legendList = _.compact(_.uniq(_.flatten(_.zip(list1, list2))));

  //     } else if (_.includes(['sunburst', 'tree'], templateSwitch)) {
  //       // 旭日图
  //       if (newBlock.templateId === '5543734748594537504') {
  //         const sunData = newBlock.dataSrc.data[0];
  //         const sunMap = newBlock.props.map[0];
  //         const { root } = this.solveDataHierarchyWithoutValue(sunData, sunMap)
  //         const sunLegendList = []

  //         if (root.name !== '') {
  //           sunLegendList.push(root.name)
  //         }

  //         _.forEach(root.children, (v) => {
  //           sunLegendList.push(v.name)
  //         })

  //         legendList = sunLegendList;
  //       } else {
  //         legendList = [];
  //       }
  //     }
  //   }
  //   const legendData = {
  //     legendList: legendList,
  //     legendIndex: legendIndex
  //   }
  //   return legendData;
  // }

  // // 旭日图提取 legend
  // solveDataHierarchyWithoutValue(dataset, map) {
  //   let sourceCol = 0, // 父节点列
  //     targetCol = 0;   // 子节点列

  //   map.forEach(function (d) {
  //     if (d.function === "sourceCol") {
  //       sourceCol = d.index;
  //     } else if (d.function === "targetCol") {
  //       targetCol = d.index;
  //     };
  //   });

  //   const nodesArr = [];
  //   const nodesObj = {};
  //   let nodeIndex = 0;

  //   const dataLength = dataset.length;
  //   for (let i = 1; i < dataLength; i++) {
  //     const row = dataset[i];
  //     const source = row[sourceCol],
  //       target = row[targetCol];

  //     // 如果 source 与 target 为空，忽略，如果两者相同，忽略
  //     if (!source || !target || source === target) {
  //       continue;
  //     }

  //     // 有未声明的 source 节点，新增
  //     if (!nodesObj[source]) {
  //       const sourceNode = {
  //         name: source,
  //         index: nodeIndex
  //       };

  //       nodesObj[source] = sourceNode;
  //       nodesArr.push(sourceNode);
  //       nodeIndex++;
  //     };

  //     // 有未声明的 target 节点，新增
  //     if (!nodesObj[target]) {
  //       const targetNode = {
  //         name: target,
  //         index: nodeIndex
  //       };

  //       nodesObj[target] = targetNode;
  //       nodesArr.push(targetNode);
  //       nodeIndex++;
  //     };

  //     // 将 source 节点赋值给变量 s
  //     const s = nodesObj[source];

  //     // 将 target 节点赋值给变量 t
  //     const t = nodesObj[target];

  //     // 若 target 对象的 parent 已经存在，则不再进行操作
  //     if (!t.parent) {
  //       t.parent = s;
  //       // 若 source 对象 children 为 null，创建数组
  //       if (!s.children) {
  //         s.children = [t];
  //       } else {
  //         s.children.push(t);
  //       };
  //     };
  //   }

  //   // 根节点
  //   let root = null;

  //   // 没有父节点的节点数组
  //   const nodesWithoutParent = nodesArr.filter(d => !d.parent);

  //   if (nodesWithoutParent.length === 1) {
  //     // 只有一个节点没有父节点，那么这个节点就是根节点
  //     root = nodesWithoutParent[0];
  //   } else if (nodesWithoutParent.length > 1) {
  //     // 有多个节点没有父节点，那么新建一个对象作为根节点
  //     root = {
  //       name: "",
  //       children: nodesWithoutParent
  //     };
  //   } else {
  //     // 如果找不到没有父节点的节点，说明数据陷入循环，抛出错误
  //     // 勉强将相关值设为空
  //     root = {
  //       name: "",
  //       children: []
  //     };
  //     // throw new Error("数据有错误，节点关系陷入循环，找不到根节点！");
  //   }

  //   this.noteNodesDepth(root);

  //   return {
  //     nodesObj: nodesObj,
  //     nodesArr: nodesArr,
  //     root: root
  //   };
  // }

  // noteNodesDepth(node) {
  //   // 从上而下计算，下层直接从上层获取值，不需要返回值
  //   const depth = node.depth ? node.depth : (node.depth = 0);
  //   const that = this;
  //   if (node.children) {
  //     node.children.forEach(function (d) {
  //       d.depth = depth + 1;
  //       that.noteNodesDepth(d);
  //     });
  //   }

  // 处理图表数据，针对不同的图表进行对应的处理，返回处理后的数据
  handleAllChartsData(newBlock) {
    let dataSrc;
    // 根据图表类型确定颜色列表依据长度（横向或者竖向）
    switch (newBlock.templateSwitch) {
      case 'cross':
      case 'cross-time':
        dataSrc = newBlock.dataSrc.data[0][0];
        // 针对斜率图
        if (newBlock.templateId === '154778232785223023') {
          dataSrc = _.unzip(newBlock.dataSrc.data[0])[0];
        }
        break;
      case 'obj-n-value-time':
        dataSrc = (_.unzip(newBlock.dataSrc.data[0]))[1];
      break;
      case 'key-value':
        dataSrc = (_.unzip(newBlock.dataSrc.data[0]))[0];
        break;
      case 'tree':
      case 'sunburst':
      case 'tree-value':
      case 'obj-n-value':
      case 'obj-type-value':
        dataSrc = _.uniq((_.unzip(newBlock.dataSrc.data[0]))[0]);
        break;
      case 'sankey':
        dataSrc = _.compact(_.uniq([...(_.unzip(newBlock.dataSrc.data[0]))[0], ...(_.unzip(newBlock.dataSrc.data[0]))[1]]));
        break;
      default:
        break;
    }
    return dataSrc;
  }

}
