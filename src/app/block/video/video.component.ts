import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'lx-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  _data;
  set data(val) {
    this._data = val;
    if (val.setting) {
      this.initVideoData();
    }
  }
  get data() { return this._data; }

  _isSelected;
  set isSelected(val) {
    this._isSelected = val;
  }
  get isSelected() {
    return this._isSelected;
  }

  videoOuterStyles;

  videoSrc = '';

  isIframe = false;

  showControls = true;

  @ViewChild('video') video;

  constructor(private _el: ElementRef) { }

  ngOnInit() {

    // 控制视频倍速播放
    // setTimeout(() => {
    //   this.video.nativeElement.playbackRate = 2.0
    // }, 1000);
    if (window.location.href.indexOf('download') > -1) {
      this.showControls = false;
    }

  }

  initVideoData() {
    let scale = 100;
    if (this.data.setting) {
      const dataProps = this.data.setting.props;
      // 歌曲地址
      const copyUrl = dataProps.data.src;
      let trueUrl = copyUrl;
      if (copyUrl.indexOf(`crossorigin="anonymous"`) === -1 && dataProps.data.sourceType === 'iframe') {
        let tmpStr = copyUrl.split("<iframe ")[1];
        trueUrl = `<iframe crossorigin="anonymous"` + tmpStr;
      }
      if (trueUrl.indexOf(`'allowfullscreen'`) > -1 && dataProps.data.sourceType === 'iframe') {
        trueUrl = trueUrl.replace("'allowfullscreen'", '');
      }
      this.videoSrc = trueUrl;

      // 是否是iframe
      this.isIframe = dataProps.data.sourceType === 'iframe';
      // 插入视频宽高
      this.videoOuterStyles = {
        'width': dataProps.size.width * (scale / 100) + 'px',
        'height': dataProps.size.height * (scale / 100) + 'px',
        'opacity': dataProps.opacity / 100
      }
    }
  }

}
