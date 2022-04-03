/*
 * @Description: project case service
 */

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../states/reducers';
import * as ProjectActions from '../../states/actions/project.action';

import * as _ from 'lodash';
import * as $ from 'jquery';
import { equalArrayFunc } from '../../pages/workspace/settings/chart-settings/chart-right-settings/helper';
import { bloomAdd } from '@angular/core/src/render3/di';
type actionMode = 'moveUpOneLevel' | 'moveDownOneLevel' | 'moveUpTop' | 'moveDownBottom';

@Injectable()
export class SetBlockZIndexService {
  constructor(private _store: Store<fromRoot.State>) { }

  // 处理正常操作与 undo  // 传 article 表示正常操作 不传则只在 redo 里面进行 待删
  // handleIndexChange(changeIndex, action, article = null) {
  //   const blocks = document.querySelectorAll('.workspace-wrap lx-block');
  //   const len = blocks.length;
  //   let lists;
  //   if (article) {
  //     lists = _.cloneDeep(article.contents.pages[0].blocks);
  //   }

  //   switch (action) {
  //     case 'moveUpOneLevel':
  //       if (changeIndex !== len - 1) {
  //         this.insertAfter(blocks[changeIndex], blocks[changeIndex + 1]);
  //         if (lists) {
  //           // 交换 json
  //           [lists[changeIndex], lists[changeIndex + 1]] = [lists[changeIndex + 1], lists[changeIndex]];
  //         }
  //       } else {
  //         return;
  //       }
  //       break;
  //     case 'moveDownOneLevel':
  //       if (changeIndex !== 0) {
  //         blocks[changeIndex].parentNode.insertBefore(blocks[changeIndex], blocks[changeIndex - 1])
  //         if (lists) {
  //           // 交换 json
  //           [lists[changeIndex], lists[changeIndex - 1]] = [lists[changeIndex - 1], lists[changeIndex]];
  //         }
  //       } else {
  //         return;
  //       }
  //       break;
  //     case 'moveUpTop':
  //       if (changeIndex !== len - 1) {
  //         this.insertAfter(blocks[changeIndex], blocks[len - 1]);
  //         if (lists) {
  //           // 改变 json
  //           const changeValue = lists.splice(changeIndex, 1)[0];
  //           lists.push(changeValue);
  //         }
  //       } else {
  //         return;
  //       }
  //       break;
  //     case 'moveDownBottom':
  //       if (changeIndex !== 0) {
  //         blocks[0].parentNode.insertBefore(blocks[changeIndex], blocks[0]);
  //         if (lists) {
  //           // 改变 json
  //           const changeValue = lists.splice(changeIndex, 1)[0];
  //           lists.unshift(changeValue);
  //         }
  //       } else {
  //         return;
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   if (lists) {
  //     this.update(lists, article, changeIndex, action);
  //   }

  // }

  // // 移动两个 block dom 层面  redo 待删
  // moveBlock(changeIndex, action) {
  //   const blocks = $('.workspace-wrap lx-block');
  //   const len = blocks.length;
  //   switch (action) {
  //     case 'moveUpOneLevel':
  //       this.insertAfter(blocks[changeIndex], blocks[changeIndex + 1]);
  //       break;
  //     case 'moveDownOneLevel':
  //       blocks[changeIndex].parentNode.insertBefore(blocks[changeIndex], blocks[changeIndex - 1])
  //       break;
  //     case 'moveUpTop':
  //       blocks[len - 1].parentNode.insertBefore(blocks[len - 1], blocks[changeIndex]);
  //       break;
  //     case 'moveDownBottom':
  //       this.insertAfter(blocks[0], blocks[changeIndex]);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // // 待删
  // update(lists, article, blockIndex, action) {
  //   // 取旧数组与新数组 id 比较顺序是否相同
  //   const oldIds = article.contents.pages[0].blocks.map(item => item.blockId);
  //   const newIds = lists.map(item => item.blockId);

  //   // 如果旧数组与新数组相同就不用操作
  //   if (!equalArrayFunc(oldIds, newIds)) {
  //     this.updateBlockList(lists, article, blockIndex, action);
  //   }
  // }

  // // 更新数据 待删
  // updateBlockList(lists, article, blockIndex, action) {
  //   let newArticle = _.cloneDeep(article);
  //   newArticle.contents.pages[0].blocks = lists;
  //   this._store.dispatch(new ProjectActions.SetCurrentProjectBlockIndexAction({
  //     oldList: article.contents.pages[0].blocks,
  //     newList: lists,
  //     changeIndex: blockIndex,
  //     changeAction: action
  //   }));
  // }

  // ----------------------------------------------------------新版操作----------------------------------------------------------------------------

  /**
   * @param {number[]} moveIndexArr
   * @param {actionMode} action
   * @param {*} article
   * @description 处理多个 block 层级调整
   */
  handleMultiLevel(moveIndexArr: number[], action: actionMode, article) {
    const lists =_.cloneDeep(article.contents.pages[0].blocks);
    // 改变的 block 是全部 block 直接返回
    if (moveIndexArr.length === lists.length) {
      console.log('改变的是全部block');
      return
    };
    // 改变的是一个元素的极值情况
    if (moveIndexArr.length === 1) {
      console.log('改变的是一个元素');
      // 第一个元素不能向下移动
      if (moveIndexArr[0] === 0 && (action === 'moveDownBottom' || action === 'moveDownOneLevel')) {
        console.log('这个元素位于底层，执行了置底，下移操作');
        return
      };
      // 最后一个元素不能向上移动
      if (moveIndexArr[0] === lists.length - 1 && (action === 'moveUpOneLevel' || action === 'moveUpTop')) {
        console.log('这个元素位于顶层，执行了置顶，上移操作');
        return
      };
    }
    this.moveNode(moveIndexArr, action, false, lists);
  }

  // /**
  //  * @param {*} arr  要操作的数组
  //  * @param {*} moveIndsArr  要移动的元素下标数组
  //  * @param {*} moveToInd  目标下标值
  //  * @param {*} isBeforAfter  移动到目标值前/后（0/1）
  //  * @returns 改变后的数组
  //  */
  // moveArray(arr, moveIndsArr, moveToInd, isBeforAfter) {
  //   var temp = [];
  //   moveIndsArr.sort((a, b) => a - b);
  //   moveToInd += isBeforAfter;
  //   for (var i = 0; i < moveIndsArr.length; i++) {
  //     if (moveIndsArr[i] < moveToInd) {
  //       moveToInd -= 1;
  //     }
  //     temp[temp.length] = arr.splice(moveIndsArr[i] - i, 1)[0];
  //   }
  //   temp.unshift(moveToInd, 0);
  //   [].splice.apply(arr, temp);
  //   return arr;
  // }

  changeArray(lists) {
    const blockNodes = Array.from(document.querySelectorAll('.workspace-wrap lx-block'));
    const newIds = blockNodes.map(item => item['children'][0]['attributes']['chartid'].nodeValue);
    let arr = [];
    newIds.forEach(id => {
      lists.forEach(item => {
        if (item.blockId === id) {
          arr.push(item);
        }
      });
    })    
    return arr;
  }


  // 改变节点层级
  /**
   * @param {number[]} moveArr 调整层级的 block 的 index 集合
   * @param {string} action  
   * @param {boolean} isRedo 是否是执行 redo 重做
   * @param {*} lists article里面的blocks集合 用于修改 json
   */
  moveNode(moveArr: number[], action: actionMode, isRedo: boolean = false, lists?) {
    const blockNodes = Array.from(document.querySelectorAll('.workspace-wrap lx-block'));
    moveArr.sort((a, b) => a - b);
    const movLen = moveArr.length;
    const len = blockNodes.length;
    let moveIndex;
    let direction;
    switch (action) {
      case 'moveUpOneLevel':
        if (moveArr[movLen - 1] === len - 1) {
          moveIndex = len - 1;
          direction = 'before';
        } else {
          moveIndex = moveArr[movLen - 1] + 1;
          direction = 'after';
        }
        break;
      
      case 'moveDownOneLevel':
        if (moveArr[0] === 0) {
          moveIndex = 0;
          direction = 'after';
        } else {
          moveIndex = moveArr[0] - 1;
          direction = 'before';
        }
        break;

      case 'moveUpTop':
        moveIndex = len - 1;
        if (moveArr[movLen - 1] === len - 1) {
          direction = 'before';
        } else {
          direction = 'after';
        }
        break;

      case 'moveDownBottom':
        moveIndex = 0;
        if (moveArr[0] === 0) {
          direction = 'after';
        } else {
          direction = 'before';
        }
        break;
    
      default:
        break;
    }
    // dom 层
    this.changeNodeLevel(moveIndex, movLen, moveArr, blockNodes, direction);
    if (!isRedo) {
      const oldList = _.cloneDeep(lists);
      // json 层
      // const newList = this.moveArray(lists, moveArr, moveIndex, direction === 'before' ? 0 : 1);
      const newList = this.changeArray(lists);
      this._store.dispatch(new ProjectActions.SetCurrentProjectBlockIndexAction({
        oldList,
        newList,
        moveArr,
        changeAction: action
      }));
    }
  }

  // Undo 回退
  backNode(moveArr: number[], oldBlocks, lists, action) {
    for (let i = 0; i < moveArr.length; i++) {
      if (!this.compareNode(moveArr[i], oldBlocks, lists)) {
        // 获取当前节点集合
        const blockNodes = Array.from(document.querySelectorAll('.workspace-wrap lx-block'));
        // 获取当前节点所在新 blocks 里面的 index
        const newIndex = blockNodes.findIndex(item => item['children'][0]['attributes']['chartid'].nodeValue === oldBlocks[moveArr[i]].blockId);
        if (action !== 'moveDownBottom' && action !== 'moveDownOneLevel') {
          // 上移动一层 上移动顶层
          this.insertBefore(blockNodes[newIndex], blockNodes[moveArr[i]]);
        } else {
          // 下移动一层 下移动底层
          this.insertAfter(blockNodes[newIndex], blockNodes[moveArr[i] + moveArr.length - i - 1]);
        }
      }
    }
  }

  /**
   * @param {*} index 目标下标值
   * @param {*} loopLen 要移动的元素下标数组长度
   * @param {*} moveArr 要移动的元素下标数组
   * @param {*} nodes 节点集合
   * @param {*} direction 操作指令

   * @description 改变单个 / 多个节点层级
   */
  changeNodeLevel(index, loopLen, moveArr, nodes, direction) {
    const funcObj = {
      'before': this.insertBefore.bind(this),
      'after': this.insertAfter.bind(this)
    };
    for (let i = 0; i < loopLen; i++) {
      const startIndex = direction === 'before' ? i : loopLen - 1 - i;
      funcObj[direction](nodes[moveArr[startIndex]], nodes[index]);
    }
  }

  // ----------------------- 工具方法 ----------------------------------------

  // 将第一个节点插入后一个节点后面
  insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  // 奖第一个节点插入后一个节点前面
  insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
  }

   // 比较节点是否相同
   compareNode(index, oldList, newList) {
    return oldList[index].blockId === newList[index].blockId;
  }

}
