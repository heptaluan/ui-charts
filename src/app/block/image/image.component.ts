import { Component, OnInit, ElementRef, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../states/reducers'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import { UpdateCurrentProjectArticleAction } from '../../states/actions/project.action'
import { ImageMapService } from '../image-map.service'

@Component({
  selector: 'lx-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  _data
  projectId: any
  set data(val) {
    this._data = val
    if (val.setting) {
      this.initImageData()
    }
  }
  get data() {
    return this._data
  }

  _isSelected
  set isSelected(val) {
    this._isSelected = val
  }
  get isSelected() {
    return this._isSelected
  }

  @Input() groupData

  imageStyles
  imageOuterStyles
  imageSrc: string

  constructor(
    private router: Router,
    private _store: Store<fromRoot.State>,
    private _el: ElementRef,
    private _router: ActivatedRoute,
    private _imageMapService: ImageMapService
  ) {}

  ngOnInit() {
    this.projectId = this._router.snapshot.queryParams.project
    this.initImageData()
  }

  initImageData() {
    if (this.data && this.data.setting.props.shadow.display === undefined) {
      const newBlock = _.cloneDeep(this._imageMapService.ImageBlockTemplate)
      let block = _.cloneDeep(this.data.setting)
      block.props.shadow['display'] = newBlock.props.shadow.display
      this.updateCurBlock(block, 'redo')
    }
    let scale = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    if (this.groupData || this.data.setting) {
      const dataProps = this.groupData ? this.groupData.props : this.data.setting.props
      if (this.groupData) {
        this.imageSrc = this.groupData.src
      } else {
        this.imageSrc = this.data.setting.src
      }
      this.imageOuterStyles = {
        width: dataProps.size.width * (scale / 100) + 'px',
        height: dataProps.size.height * (scale / 100) + 'px',
      }
      this.imageStyles = {
        width: dataProps.size.width * (scale / 100) + 'px',
        height: dataProps.size.height * (scale / 100) + 'px',
        opacity: dataProps.opacity / 100,
        'border-radius': dataProps.borderRadius + 'px',
        'border-color': this.colorToRGBA(dataProps.border.strokeColor),
        'border-style': dataProps.border.strokeType,
        'border-width': dataProps.border.strokeWidth + 'px',
        'box-shadow':
          dataProps.shadow && dataProps.shadow.display
            ? `${Math.round(dataProps.shadow.shadowRadius * Math.cos((dataProps.shadow.shadowAngle * Math.PI) / 180))}px
                       ${Math.round(
                         dataProps.shadow.shadowRadius * Math.sin((dataProps.shadow.shadowAngle * Math.PI) / 180)
                       )}px
                       ${dataProps.shadow.shadowBlur}px
                       ${dataProps.shadow.shadowBlur}px
                       ${this.colorToRGBA(dataProps.shadow.shadowColor)}`
            : 'unset',
      }
    }
  }

  // 16 进制颜色转 RGB,返回值是三个数字  为了调阴影颜色的透明度
  colorToRGB(color) {
    let color1, color2, color3
    color = '' + color
    if (typeof color !== 'string') {
      return
    }
    if (color.charAt(0) === '#') {
      color = color.substring(1)
    }
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
    }
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
      color1 = parseInt(color.substr(0, 2), 16)
      color2 = parseInt(color.substr(2, 2), 16)
      color3 = parseInt(color.substr(4, 2), 16)
      return color1 + ',' + color2 + ',' + color3
    }
  }

  // 三位，六位，八位 16进制颜色转 RGBA
  colorToRGBA(color) {
    let color1, color2, color3, color4
    color = '' + color
    if (typeof color !== 'string') {
      return
    }
    if (color.charAt(0) === '#') {
      color = color.substring(1)
    } else {
      return color
    }
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
    }
    color4 = 1
    if (color.length === 8) {
      color4 = Math.round((parseInt(color[6] + color[7], 16) / 255) * 100) / 100
      color = color.substring(0, 6)
    }
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
      color1 = parseInt(color.substr(0, 2), 16)
      color2 = parseInt(color.substr(2, 2), 16)
      color3 = parseInt(color.substr(4, 2), 16)
    }
    return 'rgba(' + color1 + ',' + color2 + ',' + color3 + ',' + color4 + ')'
  }

  updateCurBlock(block, flag?) {
    let newBlock = _.cloneDeep(block)
    let newData: any = {
      target: {
        blockId: newBlock.blockId,
        pageId: newBlock.pageId,
        type: newBlock.type,
        target: flag ? 'redo' : null,
      },
      method: 'put',
      block: block as any,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }
}
