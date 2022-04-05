import { Injectable } from '@angular/core'

@Injectable()
export class AudioMapService {
  SongBlockTemplate = {
    blockId: '',
    templateId: '444444444444444444', //不能重复
    type: 'audio',
    title: '音频',
    position: {
      left: 60,
      top: 80,
    },
    props: {
      size: {
        height: '186',
        width: '583',
        rotate: '0',
        ratio: 186 / 583 + '',
      },
      data: {
        title: '海阔天空.mp3',
        thumb: '',
        src: 'http://placehold.it/aaa.mp3',
        time: '4:03',
        sourceType: 'system', // url / system
      },
      playControl: {
        autoplay: false,
        loopback: false,
      },
      skins: ['霜荼白', '深空灰', '玄潭黑', '青泽绿', '哈尼粉', '经典蓝'],
      skinSelected: '霜荼白',
      type: 'bgm', // bgm / insertSong,
      opacity: 100, // 0 - 100
    },
  }

  constructor() {}
}
