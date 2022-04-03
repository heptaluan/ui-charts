import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { SliderComponent } from '../../share/settings/slider/slider.component';

@Component({
  selector: 'lx-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})

export class AudioComponent implements OnInit {
  _data;
  set data(val) {
    this._data = val;
    if (val.setting) {
      this.initAudioData();
      // this.changeSize();
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

  audioOuterStyles;
  audioSrc;

  musicTitle = '';

  startTime = '00:00';
  endTime = '04:25';
  curTime = 0; // 0 - 100

  // 播放状态
  playing = false;

  skinMap = {
    '霜荼白': 'white',
    '深空灰': 'gray',
    '玄潭黑': 'black',
    '青泽绿': 'green',
    '哈尼粉': 'pink',
    '经典蓝': 'blue'
  };

  curSkin = 'white';

  initHeight = 186;

  isWorkSpace = true;

  @ViewChild('audio') audio;
  @ViewChild('audioBgm') audioBgm;
  @ViewChild('slider') slider: SliderComponent;
  constructor(private _el: ElementRef) { }

  ngOnInit() {
    this.initAudioData();
    if (window.location.href.indexOf('download') > -1) {
      this.isWorkSpace = false;
    }
  }

  initAudioData() {
    // let scale = Number.parseInt(document.querySelector('.page-size span').innerHTML);
    if (this.data.setting) {
      let dataProps = this.data.setting.props;
      if (this.audioSrc !== dataProps.data.src && (this.audio || this.audioBgm)) {
        this.playing = false;
        this.onPercentChange(0)
      }
      // 歌曲地址
      this.audioSrc = dataProps.data.src;
      // 插入音乐宽高
      this.audioOuterStyles = {
        'width': Number(dataProps.size.width) + 'px',
        'height': Number(dataProps.size.height) + 'px',
        // "zoom" : Number.parseInt(document.querySelector('.page-size span').innerHTML) / 100
      }
      // 音乐标题
      this.musicTitle = dataProps.data.title;
      // 音乐皮肤
      this.curSkin = this.skinMap[dataProps.skinSelected];
      // 音乐时长
      this.endTime = dataProps.data.time;
      // 是否自动播放
      // if (dataProps.playControl.autoplay) {
      //   this.play();
      // }
    }
  }

  // changeSize() {
  //   if (this.slider) {
  //     let sliderEl = this.slider.slider.nativeElement;
  //     let after = window.getComputedStyle(sliderEl, "-webkit-slider-thumb");
  //     $(after).attr('-webkit-slider-thumb', 'background: red')
  //     console.log(after);
  //   }
  // }

  // 播放
  play() {
    if (window.location.href.indexOf('workspace') > -1) {
      const audioEl = this.data.setting.props.type === 'insertSong' ? this.audio : this.audioBgm;
      if (audioEl) {
        if (this.playing) {
          this.playing = false;
          audioEl.nativeElement.pause();
        } else {
          this.playing = true;
          audioEl.nativeElement.play();
        }
      }
    }
  }

  // 解决进度条无法拖动
  handleProcessFocus() {
    if (window.location.href.indexOf('workspace') > -1) {
      $(this._el.nativeElement).parents('.block-container').draggable({ disabled: true });
    }
  }

  handleProcessBlur() {
    if (window.location.href.indexOf('workspace') > -1) {
      $(this._el.nativeElement).parents('.block-container').draggable({ disabled: false });
    }
  }

  // 更新进度条与开始时间
  onTimeUpdate(e: Event) {
    this.startTime = this.formatSecond((<HTMLAudioElement>e.target).currentTime);
    this.curTime = this.getPercent();
    if (this.curTime >= 100) {
      if (this.data.setting.props.playControl.loopback) {
        this.playing = true;
        this.onPercentChange(0);
      } else {
        this.playing = false;
      }
    }
  }

  formatSecond(second) {
    let result = parseInt(second);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return `${m}:${s}`;
  }

  // 改变进度条
  onPercentChange(e) {
    const audioEl = this.data.setting.props.type === 'insertSong' ? this.audio : this.audioBgm;
    audioEl.nativeElement.currentTime = this.getSeconds(this.endTime) * (e / 100);
    this.startTime = this.formatSecond(audioEl.nativeElement.currentTime);
  }

  // 00:00 -> 0
  getSeconds(timeText) {
    let tmp = timeText.split(':');
    let m = parseInt(tmp[0]);
    let s = parseInt(tmp[1]);
    return m * 60 + s;
  }


  getPercent() {
    return Math.floor(this.getSeconds(this.startTime) / this.getSeconds(this.endTime) * 100);
  }


  // 获取改变后的大小
  getChangedSize(initSize) {
    return Number(this.data.setting.props.size.height) / this.initHeight  * initSize + 'px';
  }

}
