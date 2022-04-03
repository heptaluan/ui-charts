import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../../../../states/reducers';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action';
import { ActivatedRoute } from '@angular/router';
import { DataTransmissionService } from '../../../../share/services';

@Component({
  selector: 'lx-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrls: ['./group-settings.component.scss']
})
export class GroupSettingsComponent implements OnInit {
  curBlock;
  curPageId: string;
  projectId: string;
  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService
  ) { }

  ngOnInit() {
    this.projectId = this._router.snapshot.queryParams.project;
  }

  updateBlock(block, id) {
    // console.log('更新了 group', block, id);
    this.curBlock = _.cloneDeep(block);
    this.curPageId = _.cloneDeep(id);
  }

  // 更新数据
  updateCurBlock() {
    let block = _.cloneDeep(this.curBlock);
    let newData: any = {
      target: {
        blockId: block.blockId,
        pageId: this.curPageId,
        type: block.type
      },
      method: 'put',
      block: block as any
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }

  // 打散
  handleGroupClick() {
    this._dataTransmissionService.sendGroupData(true);
  }

}
