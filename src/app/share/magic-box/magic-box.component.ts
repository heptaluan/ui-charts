/*
 * @CreateTime: Jan 7, 2019 6:40 PM
 * @Author: zhengruying
 * @Contact: zhengruying@langnal.com
 * @Last Modified By: zhengruying
 * @Last Modified Time: Jan 7, 2019 6:40 PM
 * @Description: 具备 drag resize rotate 功能的组件
 */
import {
  Component,
  OnInit,
  AfterViewInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChanges
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../states/reducers";
import { UpdateProjectContent } from "../../states/models/project.model";
import { UpdateCurrentProjectArticleAction } from "../../states/actions/project.action";
import { DataTransmissionService } from '../../share/services/data-transmission.service';

import * as $ from "jquery";
import * as _ from "lodash";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import "jquery-ui/ui/widgets/selectable";
import "../../../dyassets/js/jquery.rotate";

@Component({
  selector: "lx-magic-box",
  templateUrl: "./magic-box.component.html",
  styleUrls: ["./magic-box.component.scss"]
})
export class MagicBoxComponent implements OnInit, AfterViewInit, OnChanges {
  @Output("interactionEvent") interactionEvent = new EventEmitter();
  @Input() isSelected;
  @Input() blockId;
  @Input() block;
  @Input() pageId;
  @Input() scale = 1; // TODO 请结合业务，将页面的scale值传递给本组件

  parentElement; // 获取父组件
  oldRatio = "initValue"; // 保留旧的 ratio
  isProject: boolean;
  projectType: string;
  projectId: string;
  hideRotateHandle: boolean = false;  // 是否显示拖拽把手

  constructor(
    private _store: Store<fromRoot.State>,
    private el: ElementRef,
    private _router: ActivatedRoute,
    private _dataTransmissionService: DataTransmissionService
  ) {
    $(this.el.nativeElement).hide();
  }

  ngOnInit() {
    this.parentElement = this.el.nativeElement.parentElement;
    this.oldRatio = this.block.props.size.ratio;
    this.isProject = this._router.snapshot.queryParams.project;
    this.projectType = this._router.snapshot.queryParams.type;
    this.projectId = this._router.snapshot.queryParams.project;

    const oldSetOption = $.ui.resizable.prototype._setOption;
    $.ui.resizable.prototype._setOption = function (key, value) {
      oldSetOption.apply(this, arguments);
      if (key === "aspectRatio") {
        this._aspectRatio = !!value;
      }
    };

    if (this.projectType === 'chart' || this.block.shapeType === 'line') {
      this.hideRotateHandle = true;
    }
  }

  ngAfterViewInit() {
    if ( this.isProject && this._router.snapshot.routeConfig.path !== "download" && this.projectType !== "chart") {
      this.draggable();
      this.transformable();
    }

    this._dataTransmissionService.getPageZoom().subscribe(value => {
      this.scale = value;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSelected && !changes.isSelected.isFirstChange()) {
      if (
        this.isProject &&
        this._router.snapshot.routeConfig.path !== "download"
      ) {
        // 判断 block 是否选中
        if (this.isSelected && !changes.isSelected.isFirstChange()) {
          if (this.projectType !== 'chart') {
            this.parentElement.style.border = "1px solid #3195cb";
          }
          $(this.el.nativeElement).show();
          $(this.parentElement)
            .find(".line-item")
            .show();
        } else {
          // this.parentElement.style.border = "1px solid transparent";
          $(this.el.nativeElement).hide();
          // 剔除直线 && 箭头的拖拽把手
          $(this.parentElement)
            .find(".line-item")
            .hide();
        }
      }
    }

    if (
      this.oldRatio !== "initValue" &&
      this.block.props.size.ratio !== this.oldRatio
    ) {
      this.oldRatio = this.block.props.size.ratio;

      $(this.parentElement).resizable(
        "option",
        "aspectRatio",
        this.block.props.size.ratio ? 1 / this.block.props.size.ratio : false
      );
    }
  }

  setHandle() {
    if (this.block.type === "chart") {
      $(this.parentElement)
        .parent(".block-container")
        .draggable("option", "handle", ".echart-container");
    } else if (this.block.type === "text") {
      $(this.parentElement)
        .parent(".block-container")
        .draggable("option", "handle", ".block-text");
    }
  }

  updateBlock(options) {
    let newBlock = _.cloneDeep(this.block);
    if (options.left) {
      newBlock.position.left = options.left;
    }
    if (options.top) {
      newBlock.position.top = options.top;
    }
    if (options.width) {
      newBlock.props.size.width = options.width;
    }
    if (options.height) {
      newBlock.props.size.height = options.height;
    }
    if (options.rotate) {
      newBlock.props.size.rotate = options.rotate.toFixed();
    }

    // 更新 shape
    if (newBlock.type === 'shape') {
      if (newBlock.shapeType === 'rectangle' || newBlock.shapeType === 'round-rectangle') {
        newBlock.props.fill.width = options.width - newBlock.props.strokeWidth;
        newBlock.props.fill.height = options.height - newBlock.props.strokeWidth;
      } else if (newBlock.shapeType === 'oval') {
        newBlock.props.specified.cx = options.width ? (options.width) / 2 : newBlock.props.size.width / 2
        newBlock.props.specified.cy = options.width ? (options.height) / 2 : newBlock.props.size.height / 2
        newBlock.props.specified.rx = options.width ? (options.width) / 2 : newBlock.props.size.width / 2
        newBlock.props.specified.ry = options.width ? (options.height) / 2 : newBlock.props.size.height / 2
      } else if (newBlock.shapeType === 'triangle') {
        if (options.width) {
          newBlock.path = `${options.width / 2} 0, 0 ${options.height}, ${options.width} ${options.height}`
        } else {
          newBlock.path = `${newBlock.props.size.width / 2} 0, 0 ${newBlock.props.size.height}, ${newBlock.props.size.width} ${newBlock.props.size.height}`
        }
      } else if (newBlock.shapeType === 'pentagon') {
        if (options.width) {
          newBlock.path = `${options.width / 2} 0, ${options.width} ${(options.height) * 0.4}, ${(options.width) * 0.85} ${options.height}, ${(options.width) * 0.15} ${options.height}, 0 ${(options.height) * 0.4}`
        } else {
          newBlock.path = `${newBlock.props.size.width / 2} 0, ${newBlock.props.size.width} ${(newBlock.props.size.height) * 0.4}, ${(newBlock.props.size.width) * 0.85} ${newBlock.props.size.height}, ${(newBlock.props.size.width) * 0.15} ${newBlock.props.size.height}, 0 ${(newBlock.props.size.height) * 0.4}`
        }
      }
    }
    let newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: newBlock.type
      },
      method: "put",
      block: newBlock
    };
    this._store.dispatch(
      new UpdateCurrentProjectArticleAction(this.projectId, newData)
    );
  }

  draggable() {
    $(this.parentElement)
      .parent(".block-container")
      .draggable({
        // scroll: false,
        create: (event, ui) => {
          this.setHandle();
        },
        drag: (event, ui) => {
          if (this.isSelected) {
            $(this.parentElement)
              .find($(".topline"))
              .css("display", "block");
            $(this.parentElement)
              .find($(".rightline"))
              .css("display", "block");
            $(this.parentElement)
              .find($(".botline"))
              .css("display", "block");
            $(this.parentElement)
              .find($(".leftline"))
              .css("display", "block");
          }
          this.scale = parseInt($('.page-size span').html(), 10) / 100;//lynnew
          // 缩放的时候 drag 防抖动
          ui.position.left = ui.position.left / this.scale;
          ui.position.top = ui.position.top / this.scale;
        },
        start: (event, ui) => {
          $(this.parentElement)
            .find($(".topline"))
            .css("display", "block");
          $(this.parentElement)
            .find($(".rightline"))
            .css("display", "block");
          $(this.parentElement)
            .find($(".botline"))
            .css("display", "block");
          $(this.parentElement)
            .find($(".leftline"))
            .css("display", "block");
        },
        stop: (event, ui) => {
          this.updateBlock({
            left: Math.round(ui.position.left),
            top: Math.round(ui.position.top)
          });
          $(this.parentElement)
            .find($(".topline"))
            .css("display", "none");
          $(this.parentElement)
            .find($(".rightline"))
            .css("display", "none");
          $(this.parentElement)
            .find($(".botline"))
            .css("display", "none");
          $(this.parentElement)
            .find($(".leftline"))
            .css("display", "none");
        },
        cancel: ".resizable-handler"
      });
  }

  transformable() {
    $(this.parentElement)
      .rotatable({
        degrees: this.block.props.size.rotate,
        handle: $(`.rotate_${this.blockId}`),
        drag: (event, ui) => {
          // drag 防抖动
          ui.position.left = ui.position.left / this.scale;
          ui.position.top = ui.position.top / this.scale;
        },
        stop: (event, ui) => {
          if (this.isSelected) {
            let deg = ui.angle.current >= 0 ? ui.angle.degrees : -ui.angle.degrees;
            if (deg > 360) {
              deg = deg - Math.floor(deg / 360) * 360
            }
            this.updateBlock({
              rotate: deg
            });
          }
        },
        wheelRotate: false // 禁止鼠标旋转
      })
      .resizable({
        handles: {
          nw: $("#nwhandle_" + this.blockId),
          sw: $("#swhandle_" + this.blockId),
          ne: $("#nehandle_" + this.blockId),
          se: $("#sehandle_" + this.blockId),
          n: $("#whandle_" + this.blockId),
          e: $("#ehandle_" + this.blockId),
          s: $("#shandle_" + this.blockId),
        },
        classes: {
          "ui-resizable-se": ""
        },
        aspectRatio: this.block.props.size.ratio
          ? 1 / this.block.props.size.ratio
          : false,
        resize: (event, ui) => {

          // 缩放的时候 drag 防抖动
          ui.position.left = ui.position.left / this.scale;
          ui.position.top = ui.position.top / this.scale;
          // console.log(ui)

          // 拖拽过程中处理 shape
          const imageElBox = $(this.el.nativeElement.parentElement).find('.image-box');
          const imgBox = $(this.el.nativeElement.parentElement).find('.image-box img');
          const svgElBox = $(this.el.nativeElement.parentElement).find('.block-shape');
          const svgEl = $(this.el.nativeElement.parentElement).find('.svg-element');
          const svgBox = $(this.el.nativeElement.parentElement).find('.block-shape');
          // const svg = $(this.el.nativeElement.parentElement).find('.svgIcon svg');

          svgElBox.css('width', ui.size.width + 2);
          svgElBox.css('height', ui.size.height + 2);
          imageElBox.css('width', ui.size.width + 2);
          imageElBox.css('height', ui.size.height + 2);


          switch (this.block.shapeType) {
            case 'icon':
              svgBox.attr('width', ui.size.width + 2 + 'px');
              svgBox.attr('height', ui.size.height + 2 + 'px');
              break;
            case 'oval':
              svgEl.attr('cx', (ui.size.width + 2) / 2);
              svgEl.attr('cy', (ui.size.height + 2) / 2);
              svgEl.attr('rx', (ui.size.width + 2) / 2);
              svgEl.attr('ry', (ui.size.height + 2) / 2);
              break;
            case 'triangle':
              svgEl.attr('points', `${(ui.size.width + 2) / 2} 0, 0 ${ui.size.height + 2}, ${(ui.size.width + 2)} ${ui.size.height + 2}`);
              break;
            case 'pentagon':
              svgEl.attr('points', `${(ui.size.width + 2) / 2} 0, ${(ui.size.width + 2)} ${(ui.size.height + 2) * 0.4}, ${((ui.size.width + 2)) * 0.85} ${ui.size.height + 2}, ${((ui.size.width + 2)) * 0.15} ${ui.size.height + 2}, 0 ${(ui.size.height + 2) * 0.4}`);
            default:
              svgEl.attr('width', (ui.size.width + 2) - this.block.props.strokeWidth);
              svgEl.attr('height', ui.size.height + 2 - this.block.props.strokeWidth);
              break;
          }

          if (this.block.type === "chart") {
            this.interactionEvent.emit();
          }
          // resize 窗口 image 跟随窗口大小改变
          if (this.block.type === 'image') {
            imgBox.css('width', ui.size.width + 2);
            imgBox.css('height', ui.size.height + 2);
          }
        },
        stop: (event, ui) => {
          const originPosition = {
            left: this.block.position.left,
            top: this.block.position.top
          };
          if (this.isSelected) {
            const currentLeft = originPosition.left + ui.position.left;
            const currentTop = originPosition.top + ui.position.top;
            $(this.el.nativeElement.parentElement)
              .parent(".block-container")
              .css("left", currentLeft);
            $(this.el.nativeElement.parentElement)
              .parent(".block-container")
              .css("top", currentTop);
            $(this.el.nativeElement.parentElement).css("top", 0);
            $(this.el.nativeElement.parentElement).css("left", 0);

            this.updateBlock({
              left: currentLeft,
              top: currentTop,
              width: Math.round(ui.size.width + 2),
              height: Math.round(ui.size.height + 2)
            });
          }
        }
      });
  }
}
