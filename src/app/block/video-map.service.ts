import { Injectable } from '@angular/core'

@Injectable()
export class VideoMapService {
  VideoBlockTemplate = {
    blockId: '',
    templateId: '555555555555555555', //不能重复
    type: 'video',
    title: '视频',
    position: {
      left: 60,
      top: 80,
    },
    props: {
      size: {
        height: '400',
        width: '600',
        rotate: '0',
        ratio: 400 / 600 + '',
      },
      data: {
        title: '插入视频 ',
        src: 'http://placehold.it/aaa.mp4',
        time: '4:03',
        sourceType: 'url',
      },
      opacity: 100,
    },
  }

  constructor() {}
}
