import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import { UpdateProjectContent } from '../../states/models/project.model'
import * as fromRoot from '../../states/reducers'
import { Store } from '@ngrx/store'
import * as _ from 'lodash'
import { UpdateCurrentProjectArticleAction } from '../../states/actions/project.action'

@Component({
  selector: 'lx-elements-locked',
  templateUrl: './elements-locked.component.html',
  styleUrls: ['./elements-locked.component.scss']
})

export class ElementsLockedComponent implements OnInit {

  @Input() block: any
  @Input() projectId: any
  @Input() pageId: any
  @Input() type: any
  isLocked: boolean = true

  constructor(
    private _store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.isLocked = this.block.locked
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.block && changes.block.currentValue !== undefined) {
      this.isLocked = changes.block.currentValue.locked
    }
  }

  handleButtonCliked() {
    this.isLocked = false 
    const newBlock = _.cloneDeep(this.block)
    newBlock.locked = !newBlock.locked
    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type
      },
      method: 'put',
      block: newBlock
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

}
