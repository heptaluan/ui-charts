import { Directive, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { NotifyChartRenderService } from '../../share/services/notify-chart-render.service';
import { DataTransmissionService } from '../../share/services';

@Directive({
  selector: '[changeZoom]'
})

export class ChangeZoomDirective {

  constructor(
    private _el: ElementRef,
    private _router: Router,
    private _notifyChartRenderService: NotifyChartRenderService,
    private _dataTransmissionService: DataTransmissionService
  ) { }

  ngOnInit(): void {

    // 监听切换模版
    this._dataTransmissionService.getTemplateSwitchingData().subscribe(res => {
      if (res) {
        // console.log(res)
        let scale = Number.parseInt(document.querySelector('.page-size span').innerHTML)
        that.setAllBlocksStyle(scale)
        // that.setPageStyle($('.page'), scale)
      }
    })

    // 初始化输入框
    $('#tool .page-size span').html('100');
    const that = this;

    // 上拉框事件
    $('.tool-btn-box').on('click', 'li', function () {
      let scale = $(this).find('span').html();
      $('#tool .page-size span').html(scale);
      // 如果是下载页面
      if (that._router.url.includes('download')) {
        that.setPageStyle($('.download-page .page-container .page'), scale)
      } else {
        // that.setPageStyle($('.page'), scale)
      }
      // 设置全部的内部元素
      that.setAllBlocksStyle(scale);
      that._dataTransmissionService.sendPageScaleChange(scale)
    })

    // 增加按钮
    $('.add').on('click', function () {
      let scale = Number($('#tool .page-size span').html());
      scale = scale + 25
      if (scale > 200) {
        scale = 200
      }
      $('#tool .page-size span').html(scale)
      
      if (that._router.url.includes('download')) {
        that.setPageStyle($('.download-page .page-container .page'), scale)
      } else {
        // that.setPageStyle($('.page'), scale)
      }
      that.setAllBlocksStyle(scale);
      that._dataTransmissionService.sendPageScaleChange(scale)
    })

    // 减少按钮
    $('.dec').on('click', function () {
      let scale = Number($('#tool .page-size span').html());
      scale = scale - 25
      if (scale < 30) {
        scale = 30
      }
      $('#tool .page-size span').html(scale)

      if (that._router.url.includes('download')) {
        that.setPageStyle($('.download-page .page-container .page'), scale)
      } else {
        // that.setPageStyle($('.page'), scale)
      }
      that.setAllBlocksStyle(scale);
      that._dataTransmissionService.sendPageScaleChange(scale)
    })

    // 横向展开
    $('.transverse').on('click', function () {
      const tScale = Number($('#tool .page-size span').html()) / 100;
      // 分为两个页面，下载页和工作台
      if (that._router.url.includes('download')) {
        const rightContentLeft = $('.download-right')[0].getBoundingClientRect().left
        let centerContentWidth, scale;
        centerContentWidth = rightContentLeft - 218;
        const pageWidth = Number.parseInt($('.page').css('width'));
        scale = Number(((centerContentWidth - 100) / pageWidth).toFixed(2)) * 100

        $('#tool .page-size span').html(scale.toFixed())
        that.setPageStyle($('.download-page .page-container .page'), scale)
        that.setAllBlocksStyle(scale)

      } else {
        const rightContentLeft = $('.right-content')[0].getBoundingClientRect().left
        const chartTemplatesSidebar = $('.left-sidebar')[0]
        let centerContentWidth;
        if (chartTemplatesSidebar) {
          centerContentWidth = rightContentLeft - (280 + 50);
        } else {
          centerContentWidth = rightContentLeft - 50;
        }
        const pageWidth = Number.parseInt($('.workspace').attr('originWidth')) / tScale;
        let scale = Number(((centerContentWidth - 100) / pageWidth).toFixed(2)) * 100
        $('#tool .page-size span').html(scale.toFixed())
        // that.setPageStyle($('.page'), scale)
        that.setAllBlocksStyle(scale);
        that._dataTransmissionService.sendPageScaleChange(scale)
      }
    })

    // 纵向展开
    $('.longitudinal').on('click', function () {
      let pageContentHeight, pageHeight, el
      const tScale = Number($('#tool .page-size span').html()) / 100;
      
      if (that._router.url.includes('download')) {
        el = $('.download-page .page-container .page')
        pageContentHeight = document.body.clientHeight - 40 - 80; 
        pageHeight = Number.parseInt($('.page').css('height'));
        let downscale = Number((pageContentHeight / pageHeight).toFixed(2)) * 100;
        that.setPageStyle(el, downscale)
      } else {
        el = $('.page')
        pageContentHeight = document.body.clientHeight - 80 - 100;
        pageHeight = Number.parseInt($('.workspace').attr('originHeight')) / tScale;
      }
      
      let scale = Number((pageContentHeight / pageHeight).toFixed(2)) * 100
      $('#tool .page-size span').html(scale.toFixed())
      // that.setPageStyle(el, scale)
      that.setAllBlocksStyle(scale)
      that._dataTransmissionService.sendPageScaleChange(scale)
    })

    // 以后删除
    $('.inputWidth').on('change', function (e) {
      let { width } = $('.page').get(0).getBoundingClientRect()
      setTimeout(() => {
        $('.edit-area').css({
          'width': width + 100,
          'margin': '0 auto'
        })
      }, 0);
    })

    $('.inputHeight').on('change', function (e) {
      let { height } = $('.page').get(0).getBoundingClientRect()
      let documentHeight = $(document).height()
      if (height > documentHeight) {
        $('.edit-area').css({
          'height': height + 90
        })
      }
    })
  }

  setBlockOrigin() {
    if ($('.page .block-container').hasClass('show')) {
      const block = $('.page .block-container.show')[0]
      let top = parseInt(block.style.height) / 2, left = parseInt(block.style.width) / 2;
      var pageZoom = parseInt($('#tool .page-size span').html(), 10) / 100;
      top = top * pageZoom;
      left = left * pageZoom
    }
  }

  setPageStyle(el, scale) {
    const originW = Number.parseInt(el.attr('originWidth'))
    const originH = Number.parseInt(el.attr('originHeight'))
    el.css('width', `${originW * (scale / 100)}`)
    el.css('height', `${originH * (scale / 100)}`)
  }

  setAllBlocksStyle(scale) {
    const blocks = Array.from(this._el.nativeElement.querySelectorAll('.block-container')) as any;
    scale = scale ? scale : Number.parseInt(document.querySelector('.page-size span').innerHTML)
    blocks.map(item => {
      const w = Number.parseInt(item.getAttribute('originWidth'))
      const h = Number.parseInt(item.getAttribute('originHeight'))
      const t = Number.parseInt(item.getAttribute('originTop'))
      const l = Number.parseInt(item.getAttribute('originLeft'))
      const opts = {
        w: w * (scale / 100),
        h: h * (scale / 100),
        t: t * (scale / 100),
        l: l * (scale / 100),
      }

      this.setElementStyle(item, opts)

      // img
      if (item.querySelector('.image-box') ) {
        this.setElementStyle(item.querySelector('.image-box'), opts)
        this.setElementStyle(item.querySelector('.image-box img'), opts, 'img')
      }
      
      // text，shape
      if (item.querySelector('.block-inner-box')) {
        this.setElementScale(item.querySelector('.block-inner-box'), scale, w, h)
      }

      // 视频单独处理
      if (item.querySelector('.video-wrapper')) {
        this.setVideoScale(item.querySelector('.video-inner-wrapper'), scale, w, h)
      }

      // 图表
      if (item.querySelector('.echart-container')) {
        this._notifyChartRenderService.sendChartRender(true)
      }

    })

    if ($('.page .block-container.show')[0]) {
      $('.page .block-container.show')[0].click()
    }

    this.setMagicBoxStyle()
    
  }

  setElementStyle(el, opts, type?) {
    el.style.width = opts.w + 'px'
    el.style.height = opts.h + 'px'
    if (type !== 'img') {
      el.style.top = opts.t + 'px'
      el.style.left = opts.l + 'px'
    }
  }

  setElementScale(item, scale, w, h) {
    item.style.width = w + 'px'
    item.style.height = h + 'px'
    item.style.zoom = scale / 100
  }

  setVideoScale(item, scale, w, h) {
    item.style.width = w + 'px'
    item.style.height = h + 'px'
    item.style.transform = `scale(${scale / 100})`
    item.style.transformOrigin = `0 0`
  }

  setMagicBoxStyle() {
    const target = this._el.nativeElement.querySelector('.block-container.show')
    const magicBox = this._el.nativeElement.querySelector('.magic-box')
    if (target && magicBox) {
      const magicBoxStyle = magicBox.style
      magicBoxStyle.top = target.style.top
      magicBoxStyle.left = target.style.left
      magicBoxStyle.height = target.style.height
      magicBoxStyle.width = target.style.width
      magicBoxStyle.transform = target.style.transform
    }
  }

  

}
