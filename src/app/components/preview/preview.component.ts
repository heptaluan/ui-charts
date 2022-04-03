/*
 * @Description: 项目预览
 */
import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  Renderer2,
  ComponentFactory,
  ComponentFactoryResolver
} from '@angular/core';
import * as ProjectModels from '../../states/models/project.model';
import { ChartDirective } from '../../block/chart.directive';
import { BlockComponent } from '../../block/block.component';
import * as _ from 'lodash';
import { DataTransmissionService } from '../../share/services/data-transmission.service';
import { ActivatedRoute } from '@angular/router';
// import { skip } from 'rxjs/operators';

@Component({
  selector: 'lx-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnChanges {

  @ViewChild(ChartDirective) chartHost: ChartDirective;
  @Input('contents') contents: ProjectModels.InfographicProjectContents;
  @Input('isThumb') isThumb = false;  // 是否为缩略图
  @Input('isScale') isScale = false;  // 是否为详情预览图
  @Input('scale') scale = 1;          // 放大倍数
  @Input('watermark') watermark = false;
  @Input('bgTransparent') transparent = false;
  @Input('isPhone') isPhone = false;

  scaleContents: ProjectModels.InfographicProjectContents;

  originWidth;
  originHeight;

  viewContainerRef;

  blockProps;
  publishDisplayImage;
  publishDisplayText;
  logoDisplay;
  projectType;

  constructor(private _el: ElementRef,
    private _render: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _dataTransmissionService: DataTransmissionService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projectType = this._activatedRoute.snapshot.queryParams.type;
    // 预览图不录制
    // if (!this.isThumb) {
    //   // 获取是否点击录制 gif
    //   this._dataTransmissionService.getGIFData()
    //     .subscribe(res => {
    //       if (res === 'saveGIF') {
    //         this.scaleContents = _.cloneDeep(this.contents);
    //         this.setPageStyle();
            
    //         this.viewContainerRef.clear();
    //         this.loadBlock(this.scaleContents.pages[0].blocks[0]);
    //       }
    //     })
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes.contents && !changes.contents.isFirstChange() && changes.contents.currentValue) {
      this.scaleContents = _.cloneDeep(this.contents);
      this.setPageStyle();
      _.each(this.scaleContents.pages[0].blocks, block => this.loadBlock(block));
    }

    if (changes.scale && !changes.scale.firstChange && changes.scale.currentValue) {
      this.changeScale(changes.scale.currentValue);
      this.scalePage();
      _.each(this.scaleContents.pages[0].blocks, (block, index) => {
        this.setBlockStyle(index);
      });
    }

    
    if (this.projectType === 'chart') {

      if (this.scaleContents && this.scaleContents.pages[0].blocks[0]) {
        
        this.blockProps = this.scaleContents.pages[0].blocks[0].props;
        if (this.blockProps.publishDisplay && this.blockProps.logoDisplay) {
          this.publishDisplayText = {
            color: this.blockProps.publishDisplay.color,
            fontSize: this.blockProps.publishDisplay.fontSize + 'px',
            fontFamily: this.blockProps.publishDisplay.fontFamily,
            lineHeight: (~~this.blockProps.logoDisplay.imgHeight + ~~this.blockProps.logoDisplay.topLineHeight + ~~this.blockProps.logoDisplay.bottomLineHeight) - 5 + 'px',
          }
          this.publishDisplayImage = {
            maxHeight: this.blockProps.logoDisplay.imgHeight + 'px',
            marginTop: this.blockProps.logoDisplay.topLineHeight + 'px',
            marginBottom: this.blockProps.logoDisplay.bottomLineHeight + 'px',
          }
  
          const logoLineDiffWidth = this.blockProps.logoDisplay.imgHeight === '32' ? 24 : 16;
          const logoHeight = ~~this.blockProps.logoDisplay.imgHeight + ~~this.blockProps.logoDisplay.topLineHeight + ~~this.blockProps.logoDisplay.bottomLineHeight + 'px';
  
          this.logoDisplay = {
            padding: `0 ${logoLineDiffWidth}px`,
            height: logoHeight,
            backgroundColor: this.colorToRGBA(`${this.scaleContents.design.backgroundColor}`)
          }
        }
  
        if (changes.transparent && changes.transparent.currentValue) {
          this.logoDisplay.backgroundColor = 'transparent';
        }
      }
    }
  }

  changeScale(scale) {
    this.scaleContents.design.height = this.contents.design.height * scale;
    this.scaleContents.design.width = this.contents.design.width * scale;

    _.each(this.contents.pages[0].blocks, (block, index) => {
      this.scaleContents.pages[0].blocks[index].position.left = block.position.left * scale;
      this.scaleContents.pages[0].blocks[index].position.top = block.position.top * scale;
      if (this.scaleContents.pages[0].blocks[index].type === 'text') {

      } else {
        this.scaleContents.pages[0].blocks[index].props.size.height = block.props.size.height * scale;
        this.scaleContents.pages[0].blocks[index].props.size.width = block.props.size.width * scale;
      }
    });
  }

  setBlockStyle(indexEl) {
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('block-container')[indexEl], 'transform-origin', '0 0');
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('block-container')[indexEl], 'transform', `scale(${this.scale})`);
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('block-container')[indexEl], 'top', this.scaleContents.pages[0].blocks[indexEl].position.top + 'px');
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('block-container')[indexEl], 'left', this.scaleContents.pages[0].blocks[indexEl].position.left + 'px');
  }

  scalePage() {
    this._render.setStyle(this._el.nativeElement.parentElement, 'transform', `scale(${this.scale})`);
  }

  setPageStyle() {
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'height', Number(this.scaleContents.design.height) + 'px');
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'width', this.scaleContents.design.width + 'px');
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'backgroundColor', this.colorToRGBA(this.scaleContents.design.backgroundColor));
    this.originWidth = this.scaleContents.design.width
    this.originHeight = this.scaleContents.design.height

    if (this.isThumb) {
      const previewWidth = '127px';
      const previewHeight = '102px';
      const scale = 127 / this.scaleContents.design.width;
      this._render.setStyle(this._el.nativeElement, 'width', previewWidth);
      this._render.setStyle(this._el.nativeElement, 'height', previewHeight);
      this._render.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'transform', `scale(${scale})`);
    }

    if (this.isPhone) {
      this._render.setStyle(this._el.nativeElement, 'position', 'absolute');
      let originHeight = 350 * Number(this.scaleContents.design.height) / Number(this.scaleContents.design.width);
      let originWidth = 350;
      const dyScrollEl = document.querySelector('.dy-scroll');
      
      if (originHeight <= 516) {
        this._render.setStyle(dyScrollEl, 'display', 'flex');
        this._render.setStyle(dyScrollEl, 'align-items', 'center');
      }
      const previewWidth = originWidth + 'px';
      const scale = originWidth / this.scaleContents.design.width;
      this._render.setStyle(this._el.nativeElement, 'width', previewWidth);
      this._render.setStyle(this._el.nativeElement, 'height', originHeight);
      this._render.setStyle(this._el.nativeElement.getElementsByClassName('page-container')[0], 'height', originHeight + 'px');
      this._render.setStyle(this._el.nativeElement.getElementsByClassName('page-box')[0], 'width', previewWidth);
      this._render.setStyle(this._el.nativeElement.getElementsByClassName('page-box')[0], 'height', originHeight + 'px');
      this._render.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'transform', `scale(${scale})`);
    }

    if (this.isScale) {
      const scaleWidth = '700px';
      const scaleHeight = Number(this.scaleContents.design.height) / Number(this.scaleContents.design.width) * 700 + 'px';
      const scale = 700 / this.scaleContents.design.width;
      this._render.setStyle(this._el.nativeElement, 'height', scaleHeight);
      this._render.setStyle(this._el.nativeElement, 'width', scaleWidth);
      this._render.setStyle(this._el.nativeElement.getElementsByClassName('page')[0], 'transform', `scale(${scale})`);
    }
  }

  loadBlock(block) {
    try {
      const componentFactory: ComponentFactory<BlockComponent> = this.componentFactoryResolver.resolveComponentFactory(BlockComponent);
      this.viewContainerRef = this.chartHost.viewContainerRef;
      const componentRef = this.viewContainerRef.createComponent(componentFactory);
      componentRef.instance.data = {
        setting: block,
      };
      
      if (this.projectType === 'chart') {
        // 设置水印
        const pageList = document.querySelectorAll('.page');
        const watermark = this.scaleContents.pages[0].blocks[0].props['watermarkDisplay'];
        if (watermark && watermark.show) {
          Array.from(pageList).forEach(item => {
            this.urlToBase64(watermark.imgUrl, (res) => {
              this._render.setStyle(item, 'backgroundColor', this.colorToRGBA(`${this.scaleContents.design.backgroundColor}`)); 
              this._render.setStyle(item, 'backgroundImage', `url(${res})`);
            })
          })
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // url 转 base64
  urlToBase64(url, callback, type = 'image/svg') {
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
    　　canvas.height = img.height;
    　　canvas.width = img.width;
    　　ctx.drawImage(img,0,0);
    　　var dataURL = canvas.toDataURL(type || 'image/png');
    　　callback.call(this, dataURL);
    　　canvas = null;
    };  
    img.src = url;
  }

  // 3位6位8位16进制颜色转RGBA
  colorToRGBA(color) {
    let color1, color2, color3,color4;
    color = '' + color;
    if (typeof color !== 'string') {
      return;
    }
    if (color.charAt(0) === '#') {
      color = color.substring(1);
    }else {
      return color;
    }
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    color4 = 1;
    if (color.length === 8) {
      color4 = Math.round(parseInt(color[6] + color[7],16) / 255 * 100)/100; 
      color = color.substring(0,6)
    }
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
      color1 = parseInt(color.substr(0, 2), 16);
      color2 = parseInt(color.substr(2, 2), 16);
      color3 = parseInt(color.substr(4, 2), 16);    
    } 
    return "rgba("+color1+","+ color2+","+ color3+","+color4+")";
  }
}
