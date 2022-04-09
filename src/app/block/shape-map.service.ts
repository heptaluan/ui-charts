import { Injectable, ComponentFactoryResolver, ComponentFactory } from '@angular/core'

@Injectable()
export class ShapeMapService {
  RectShapeBlockTemplate = {
    blockId: '',
    templateId: '666666666666666666',
    title: '矩形',
    path: [],
    type: 'shape',
    openGradient: false,
    position: {
      left: 60,
      top: 80,
    },
    shapeType: 'rectangle',
    props: {
      size: {
        height: '200',
        width: '300',
        rotate: '0',
      },
      specified: {
        rx: 0,
        ry: 0,
        x: 0,
        y: 0,
      },
      fill: {
        fillColor: ['#08aded', '#08aded'],
        width: '300',
        height: '200',
      },
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      opacity: 100,
      strokeColor: 'transparent',
      strokeType: 'default',
      strokeWidth: 0,
      strokeDasharray: 0,
      tooltip: false,
      tooltipText: null,
      shadowColor: '#c6c6c6',
      shadowRadius: 3,
      shadowAngle: 30,
      shadowBlur: 5,
    },
  }

  // 圆角矩形
  RoundRectShapeBlockTemplate = {
    blockId: '',
    templateId: '666666666666666666',
    title: '圆角矩形',
    path: [],
    type: 'shape',
    openGradient: false,
    position: {
      left: 60,
      top: 80,
    },
    shapeType: 'round-rectangle',
    props: {
      size: {
        height: '200',
        width: '300',
        rotate: '0',
      },
      specified: {
        rx: 15,
        ry: 15,
        x: 0,
        y: 0,
      },
      fill: {
        fillColor: ['#08aded', '#08aded'],
        width: '300',
        height: '200',
      },
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      opacity: 100,
      strokeColor: 'transparent',
      strokeType: 'default',
      strokeWidth: 0,
      strokeDasharray: 0,
      tooltip: false,
      tooltipText: null,
      shadowColor: '#c6c6c6',
      shadowRadius: 3,
      shadowAngle: 30,
      shadowBlur: 5,
    },
  }

  // 圆形
  OvalShapeBlockTemplate = {
    blockId: '',
    templateId: '666666666666666666',
    title: '圆形',
    path: [],
    type: 'shape',
    openGradient: false,
    position: {
      left: 60,
      top: 80,
    },
    shapeType: 'oval',
    props: {
      size: {
        height: '200',
        width: '200',
        rotate: '0',
        ratio: true,
      },
      specified: {
        cx: 100,
        cy: 100,
        rx: 100,
        ry: 100,
      },
      fill: {
        fillColor: ['#08aded', '#08aded'],
        width: '200',
        height: '200',
      },
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      opacity: 100,
      strokeColor: 'transparent',
      strokeType: 'defaultd',
      strokeWidth: 0,
      strokeDasharray: 0,
      tooltip: false,
      tooltipText: null,
      shadowColor: '#c6c6c6',
      shadowRadius: 3,
      shadowAngle: 30,
      shadowBlur: 5,
    },
  }

  // 三角形
  TriangleShapeBlockTemplate = {
    blockId: '',
    templateId: '666666666666666666',
    title: '三角形',
    path: '100, 0 0, 200 200, 200',
    type: 'shape',
    openGradient: false,
    position: {
      left: 60,
      top: 80,
    },
    shapeType: 'triangle',
    props: {
      size: {
        height: '200',
        width: '200',
        rotate: '0',
      },
      fill: {
        fillColor: ['#08aded', '#08aded'],
      },
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      opacity: 100,
      strokeColor: 'transparent',
      strokeType: 'defaultd',
      strokeWidth: 0,
      strokeDasharray: 0,
      tooltip: false,
      tooltipText: null,
      shadowColor: '#c6c6c6',
      shadowRadius: 3,
      shadowAngle: 30,
      shadowBlur: 5,
    },
  }

  PentagonShapeBlockTemplate = {
    blockId: '',
    templateId: '666666666666666666',
    title: '五边形',
    path: '128,0, 256,97, 216,244, 38, 244, 0,97',
    type: 'shape',
    openGradient: false,
    position: {
      left: 60,
      top: 80,
    },
    shapeType: 'pentagon',
    props: {
      size: {
        height: '244',
        width: '256',
        rotate: '0',
      },
      fill: {
        fillColor: ['#08aded', '#08aded'],
      },
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      opacity: 100,
      strokeColor: 'transparent',
      strokeType: 'defaultd',
      strokeWidth: 0,
      strokeDasharray: 0,
      tooltip: false,
      tooltipText: null,
      shadowColor: '#c6c6c6',
      shadowRadius: 3,
      shadowAngle: 30,
      shadowBlur: 5,
    },
  }

  // 直线
  LineShapeBlockTemplate = {
    blockId: '',
    templateId: '666666666666666666',
    title: '直线',
    path: '75,0, 150,55, 120,150, 30,150, 0,55',
    arrowLeftPath: 'M10,2 L2,6 L10,10 L6,6 L10,2',
    arrowRightPath: 'M2,2 L10,6 L2,10 L6,6 L2,2',
    type: 'shape',
    dragPosition: {
      oneLeft: 0,
      oneTop: 0,
      twoLeft: 195,
      twoTop: 0,
    },
    shapeType: 'line',
    props: {
      size: {
        height: '12',
        width: '207',
        rotate: '0',
      },
      specified: {
        x1: '5',
        y1: '5',
        x2: '200',
        y2: '5',
      },
      fill: {
        fillColor: ['#08aded'],
      },
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      opacity: 100,
      strokeColor: '#08aded',
      strokeType: 'defaultd',
      strokeDasharray: 0,
      strokeWidth: 2,
      tooltip: false,
      tooltipText: null,
      shadowColor: '#c6c6c6',
      shadowRadius: 3,
      shadowAngle: 30,
      shadowBlur: 5,
    },
  }

  IconShapeBlockTemplate = {
    blockId: '',
    templateId: '666666666666666666',
    title: '图标',
    path: '',
    type: 'shape',
    src: '',
    position: {
      left: 60,
      top: 80,
    },
    shapeType: 'icon',
    props: {
      size: {
        height: '100',
        width: '100',
        rotate: '0',
      },
      fill: {
        fillColor: ['#08aded'],
      },
      shadow: {
        display: false,
        shadowColor: '#c6c6c6',
        shadowRadius: 3,
        shadowAngle: 45,
        shadowBlur: 5,
        shadowOpacity: 100,
      },
      opacity: 100,
      strokeColor: 'transparent',
      strokeType: 'defaultd',
      strokeWidth: 0,
      strokeDasharray: 0,
      tooltip: false,
      tooltipText: null,
      shadowColor: '#c6c6c6',
      shadowRadius: 3,
      shadowAngle: 30,
      shadowBlur: 5,
    },
  }

  constructor() {}
}
