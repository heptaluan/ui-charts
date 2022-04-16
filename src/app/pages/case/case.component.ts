/*
 * @Description: 案例详情
 */
import { Component, OnInit, OnDestroy, ElementRef, Renderer2, AfterViewInit } from '@angular/core'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import * as CaseActions from '../../states/actions/project-case.action'
import * as CaseModels from '../../states/models/case.model'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { API } from '../../states/api.service'

@Component({
  selector: 'lx-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss'],
})
export class CaseComponent implements OnInit, OnDestroy, AfterViewInit {
  caseId: string
  case: CaseModels.CaseDetail
  mySubscription = new Subscription()
  isLike = false
  projectType: string
  getUserInfoSubscription = new Subscription()
  userName

  constructor(
    private _store: Store<fromRoot.State>,
    private _router: ActivatedRoute,
    private _el: ElementRef,
    private _render: Renderer2,
    private _api: API
  ) {
    this.caseId = this._router.snapshot.queryParams.case
    this.projectType = this._router.snapshot.queryParams.type
  }

  ngOnInit() {
    this.mySubscription.add(
      this._store
        .select(fromRoot.getProjectCaseDetail)
        .pipe(filter((data) => !!data))
        .subscribe((data) => {
          this.case = data
          const previewHeight =
            (700 / Number(this.case.article.contents.design.width)) * this.case.article.contents.design.height + 'px'
          this._render.setStyle(
            this._el.nativeElement.getElementsByClassName('preview-container')[0],
            'height',
            previewHeight
          )
          this.isLike = this.case.islike
        })
    )

    if (this.projectType === 'infographic') {
      this._store.dispatch(new CaseActions.GetProjectCaseDetailAction(this.caseId))
    } else {
      this._store.dispatch(new CaseActions.GetProjectChartCaseDetailAction(this.caseId))
    }

    // 获取用户登录信息
    this.getUserInfo()
  }

  ngAfterViewInit() {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  // 获取用户信息（判断是否登录）
  getUserInfo() {
    this.getUserInfoSubscription.add(
      this._store
        .select(fromRoot.getUserInfo)
        .filter((user) => !!user)
        .subscribe((user) => {
          this.userName = user.nickname || user.loginname
        })
    )
  }

  // 信息图模版喜欢
  toggleLike(e, item) {
    e.stopPropagation()
    if (this.userName) {
      this.isLike = !this.isLike
      this._store.dispatch(
        new CaseActions.ToggleLikeCaseAction({
          type: 'infographic',
          caseid: item.id,
          islike: this.isLike ? 1 : 0,
        })
      )
    } else {
      window.location.href =
        `${this._api.getOldUrl()}/vis/auth/signin.html?redirect=` +
        encodeURIComponent(`${window.location.href.split('#')[0]}#/pages/case=${item.id}&type=infographic`)
    }
  }

  ngOnDestroy(): void {
    this.mySubscription.unsubscribe()
    this.getUserInfoSubscription.unsubscribe()
  }
}
