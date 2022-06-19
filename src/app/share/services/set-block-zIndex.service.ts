import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import * as ProjectActions from '../../states/actions/project.action'

import * as _ from 'lodash'
type actionMode = 'moveUpOneLevel' | 'moveDownOneLevel' | 'moveUpTop' | 'moveDownBottom'

@Injectable()
export class SetBlockZIndexService {
  constructor(private _store: Store<fromRoot.State>) {}

  /**
   * @param {number[]} moveIndexArr
   * @param {actionMode} action
   * @param {*} article
   * @description 处理多个 block 层级调整
   */
  handleMultiLevel(moveIndexArr: number[], action: actionMode, article) {
    this.moveNode(moveIndexArr, action, false)
  }

  changeArray(lists) {
    const blockNodes = Array.from(document.querySelectorAll('.workspace-wrap lx-block'))
    const newIds = blockNodes.map((item) => item['children'][0]['attributes']['chartid'].nodeValue)
    let arr = []
    newIds.forEach((id) => {
      lists.forEach((item) => {
        if (item.blockId === id) {
          arr.push(item)
        }
      })
    })
    return arr
  }

  moveNode(moveArr: number[], action: actionMode, isRedo: boolean = false, lists?) {
    const blockNodes = Array.from(document.querySelectorAll('.workspace-wrap lx-block'))
    moveArr.sort((a, b) => a - b)
    const movLen = moveArr.length
    const len = blockNodes.length
    let moveIndex
    let direction
    switch (action) {
      case 'moveUpOneLevel':
        if (moveArr[movLen - 1] === len - 1) {
          moveIndex = len - 1
          direction = 'before'
        } else {
          moveIndex = moveArr[movLen - 1] + 1
          direction = 'after'
        }
        break

      case 'moveDownOneLevel':
        if (moveArr[0] === 0) {
          moveIndex = 0
          direction = 'after'
        } else {
          moveIndex = moveArr[0] - 1
          direction = 'before'
        }
        break

      case 'moveUpTop':
        moveIndex = len - 1
        if (moveArr[movLen - 1] === len - 1) {
          direction = 'before'
        } else {
          direction = 'after'
        }
        break

      case 'moveDownBottom':
        moveIndex = 0
        if (moveArr[0] === 0) {
          direction = 'after'
        } else {
          direction = 'before'
        }
        break

      default:
        break
    }
    this.changeNodeLevel(moveIndex, movLen, moveArr, blockNodes, direction)
    if (!isRedo) {
      const oldList = _.cloneDeep(lists)
      const newList = this.changeArray(lists)
      this._store.dispatch(
        new ProjectActions.SetCurrentProjectBlockIndexAction({
          oldList,
          newList,
          moveArr,
          changeAction: action,
        })
      )
    }
  }

  // Undo 回退
  backNode(moveArr: number[], oldBlocks, lists, action) {
    for (let i = 0; i < moveArr.length; i++) {
      if (!this.compareNode(moveArr[i], oldBlocks, lists)) {
        const blockNodes = Array.from(document.querySelectorAll('.workspace-wrap lx-block'))
        const newIndex = blockNodes.findIndex(
          (item) => item['children'][0]['attributes']['chartid'].nodeValue === oldBlocks[moveArr[i]].blockId
        )
        if (action !== 'moveDownBottom' && action !== 'moveDownOneLevel') {
          this.insertBefore(blockNodes[newIndex], blockNodes[moveArr[i]])
        } else {
          this.insertAfter(blockNodes[newIndex], blockNodes[moveArr[i] + moveArr.length - i - 1])
        }
      }
    }
  }

  changeNodeLevel(index, loopLen, moveArr, nodes, direction) {
    const funcObj = {
      before: this.insertBefore.bind(this),
      after: this.insertAfter.bind(this),
    }
    for (let i = 0; i < loopLen; i++) {
      const startIndex = direction === 'before' ? i : loopLen - 1 - i
      funcObj[direction](nodes[moveArr[startIndex]], nodes[index])
    }
  }

  insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode)
  }

  compareNode(index, oldList, newList) {
    return oldList[index].blockId === newList[index].blockId
  }
}
