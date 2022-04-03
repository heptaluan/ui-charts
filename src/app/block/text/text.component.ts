import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { UpdateCurrentProjectArticleAction } from '../../states/actions/project.action';
import { UpdateProjectContent } from '../../states/models/project.model';

import * as fromRoot from '../../states/reducers';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'lx-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit, AfterViewInit {
  _data;
  set data(val) {
    this._data = val;
    if (val.setting) {
      this.buildTextOptions();
    }
  }
  get data() { return this._data; }

  _isSelected;
  set isSelected(val) {
    this._isSelected = val;
    if (!val) {
      (<HTMLTextAreaElement>this.textarea.nativeElement).blur();
    }
  }
  get isSelected() {
    return this._isSelected;
  }
  blockId;
  pageId;

  selectSubscription = new Subscription();

  content;
  contentShow;
  blockStyles;
  textStyles;
  projectId;

  editing;

  placeholder = '请输入文字';
  @ViewChild('textarea') textarea: ElementRef;

  constructor(
    private router: Router,
    private _store: Store<fromRoot.State>,
    private _el: ElementRef,
    private _router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projectId = this._router.snapshot.queryParams.project;
    this.buildTextOptions();
  }

  ngAfterViewInit() {
    const url = this.router.url;
    const loc = this.getLocation(url);
    if (loc.pathname != '/workspace') {
      setTimeout(() => {
        this.placeholder = "";
      }, 0);
    }
  }

  getLocation(href) {
    var match = href.match(/^(https?\:)?\/?\/?(([^:\/?#]*)?(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    }
  }

  buildTextOptions() {
    const { props } = this.data.setting;
    this.content = props.content;
    this.textarea.nativeElement.value = this.content;
    this.contentShow = this.content.replace(/[\r\n]/g, '&#13;').replace(/\s/g, '&nbsp;');;

    this.textStyles = {
      'color': this.colorToRGBA(props.color),
      'font-family': props.fontFamily,
      'font-size': props.fontSize + 'px',
      'opacity': props.opacity / 100,
      'font-weight': '',
      'font-style': props.basic.italic ? 'italic' : '',
      'text-decoration': props.basic.underline ? 'underline' : (props.basic.deleteline ? 'line-through' : ''),
      'text-align': props.basic.align,
      'line-height': props.lineHeight,
      'letter-spacing': props.letterSpacing + 'px'
    }
  }
  // 更新 Text 的 Block 文字
  onBlurhandle(event) {
    this._el.nativeElement.parentElement.classList.remove('isLocked')
    $(this._el.nativeElement).parents('.block-container').draggable({ disabled: false });
    this.editing = false;
    const content = event.target.value;

    const block = _.cloneDeep(this.data.setting);
    block.props.content = content;
 
    let newData: UpdateProjectContent = {
      target: {
        blockId: block.blockId,
        pageId: this.pageId,
        type: block.type
      },
      method: 'put',
      block: block
    }
    this.textarea.nativeElement.style.whiteSpace = 'nowrap';
    setTimeout(() => {
      this.textarea.nativeElement.style.whiteSpace = 'normal';
    }, 1);
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData));
  }

  onCoverDblClicked() {
    if (this.data.setting.locked) return;
    if (this.projectId && this._router.snapshot.routeConfig.path !== 'download') {
      this._el.nativeElement.parentElement.classList.add('isLocked')
      this.editing = true;
      $(this._el.nativeElement).parents('.block-container').draggable({ disabled: true });
      (<HTMLTextAreaElement>this.textarea.nativeElement).focus();
    }
  }

  // 3 位 6 位 8 位 16 进制颜色转 RGBa
  colorToRGBA(color) {
    let color1, color2, color3, color4;
    color = '' + color;
    if (typeof color !== 'string') {
      return;
    }
    if (color.charAt(0) === '#') {
      color = color.substring(1);
    } else {
      return color;
    }
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    color4 = 1;
    if (color.length === 8) {
      color4 = Math.round(parseInt(color[6] + color[7], 16) / 255 * 100) / 100;
      color = color.substring(0, 6)
    }
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
      color1 = parseInt(color.substr(0, 2), 16);
      color2 = parseInt(color.substr(2, 2), 16);
      color3 = parseInt(color.substr(4, 2), 16);
    }
    return "rgba(" + color1 + "," + color2 + "," + color3 + "," + color4 + ")";
  }
}
