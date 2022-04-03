import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UtilsService } from '../../share/services/utils.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../states/reducers';
import * as ProjectActions from '../../states/actions/project.action';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'lx-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit {
  browserType: string = '';
  isChrome: boolean = true;
  isCloseTip: boolean = false;

  isShowBackTop: boolean = false;

  isShowFloatBar = true;

  @ViewChild('contentScroll') contentScroll: ElementRef;

  constructor(private _utilService: UtilsService, private _store: Store<fromRoot.State>) {}

  ngOnInit() {
    Observable.fromEvent(window, 'resize')
      .pipe(
        debounceTime(100) // 加点去抖，毕竟 `resize` 频率非常高
      )
      .subscribe((event) => {
        this.isShowFloatBar = document.documentElement.clientWidth > 1270;
      });

    this.isChrome = this._utilService.getBrowserInfo() === 'Chrome' || this._utilService.getBrowserInfo() === 'Safari';
    this.isCloseTip = this._utilService.isCloseTip;
    // 获取全部项目列表
    this._store.dispatch(new ProjectActions.GetAllProjectListAction());
  }

  ngAfterViewInit(): void {
    this.contentScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
  }

  closeTip() {
    this.isCloseTip = true;
    this._utilService.closeTip();
  }

  handleScroll() {
    var e = e || window.event;
    const top = Math.round(e.target.scrollTop);
    // 最大滚动距离
    var maxHeight = e.target.scrollHeight - e.target.clientHeight - 10;
    let flag = top >= maxHeight;
    if (top >= 500) {
      this.isShowBackTop = true;
    } else {
      this.isShowBackTop = false;
    }
  }
}
