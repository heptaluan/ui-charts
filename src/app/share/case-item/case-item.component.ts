/*
 * @Description: 单个案例组件
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FavoriteService } from '../../pages/favorite/favorite.service'

export interface CaseItem {
  caseid: number
  title: string
  author: string
  watch: number
  like: number
  thumb: string
}

@Component({
  selector: 'lx-case-item',
  templateUrl: './case-item.component.html',
  styleUrls: ['./case-item.component.scss'],
  providers: [FavoriteService],
})
export class CaseItemComponent implements OnInit {
  @Input() caseitem: CaseItem
  @Output() caseClick = new EventEmitter()
  type: string

  constructor(private favoriteService: FavoriteService) {
    this.type = favoriteService.getType()
  }

  ngOnInit() {}

  onCaseClick() {
    this.caseClick.emit(this.caseitem.caseid)
  }
}
