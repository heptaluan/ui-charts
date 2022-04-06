import { Injectable } from '@angular/core'

@Injectable()
export class ImageMapService {
  ImageBlockTemplate = {
    blockId: '',
    templateId: '222222222222222222',
    title: '图片',
    type: 'image',
    position: {
      left: 60,
      top: 80,
    },
    src: 'http://placehold.it/300x200',
    props: {
      size: {
        height: '200',
        width: '300',
        rotate: '0',
      },
      opacity: 100,
      borderRadius: 0,
      tooltip: false,
      tooltipText: null,
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      mask: {
        retangle: {},
        shape: {},
      },
      border: {
        strokeColor: '#ffffff',
        strokeType: 'solid',
        strokeWidth: 0,
      },
    },
  }

  constructor() {}
}
