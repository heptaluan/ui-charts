import { Injectable } from '@angular/core'

@Injectable()
export class GroupMapService {
  GroupBlockTemplate = {
    blockId: '',
    templateId: '777777777777777777', //不能重复
    type: 'group',
    title: '成组',
    position: {
      left: 60,
      top: 80,
    },
    props: {
      size: {
        width: 500,
        height: 600,
        rotate: 0,
      },
      children: [
        {
          blockId: 'dsf564gs45d5fg',
          templateId: '222222222222222222',
          title: '图片',
          type: 'image',
          position: {
            left: 0,
            top: 0,
          },
          src: 'http://placehold.it/300x200',
          props: {
            size: {
              height: '200',
              width: '300',
              rotate: '0',
              // ratio: true
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
        },
        {
          blockId: 'as5df4a5s4f',
          templateId: '222222222222222222',
          title: '图片',
          type: 'image',
          position: {
            left: 0,
            top: 200,
          },
          src: 'http://placehold.it/400x500',
          props: {
            size: {
              height: '400',
              width: '500',
              rotate: '0',
              // ratio: true
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
        },
      ],
      initGroupData: {
        left: 0,
        top: 0,
        rotate: 0,
      },
    },
  }

  constructor() {}
}
