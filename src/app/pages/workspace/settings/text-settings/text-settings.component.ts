import { Component, OnInit } from '@angular/core'
import * as fromRoot from '../../../../states/reducers'
import { Store } from '@ngrx/store'
import * as ProjectModels from '../../../../states/models/project.model'
import * as _ from 'lodash'
import { Observable, Subscription } from 'rxjs'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import { UpdateProjectContent } from '../../../../states/models/project.model'
import { ChartMapService } from '../../../../block/chart-map.service'
import { SettingsTemplate } from '../settings-template.component'

import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'lx-text-settings',
  templateUrl: './text-settings.component.html',
  styleUrls: ['./text-settings.component.scss'],
})
export class TextSettingsComponent implements OnInit, SettingsTemplate {
  mySubscription = new Subscription()
  themeColorList
  curBlock: ProjectModels.Block = this._chartMapService.TemplateTextBlock
  curProps: ProjectModels.TextBlockProps = this._chartMapService.TemplateTextBlockProps
  curPageId: string
  projectId: string

  // 对应文字
  fontFamilyText = [
    '方正黑体',
    '方正楷体',
    '方正书宋',
    '方正仿宋',
    '站酷高端黑',
    '阿里巴巴普惠体 细体',
    '阿里巴巴普惠体 常规',
    '阿里巴巴普惠体 中等',
    '阿里巴巴普惠体 粗体',
    '阿里巴巴普惠体 特粗',
    '思源宋体 加细',
    '思源宋体 细体',
    '思源宋体 常规',
    '思源宋体 半粗',
    '思源宋体 中粗',
    '思源宋体 加粗',
    '思源宋体 超粗',
    '思源黑体 极细',
    '思源黑体 纤细',
    '思源黑体 细体',
    '思源黑体 常规',
    '思源黑体 中黑',
    '思源黑体 黑体',
    '思源黑体 粗体',
    'Caveat-Bold',
    'Caveat-Regular',
    'DancingScript-Bold',
    'DancingScript-Regular',
    'Girassol-Regular',
    'IbarraRealNova-Italic',
    'IbarraRealNova-SemiBold',
    'NotoSerif-Italic',
    'NotoSerif-Regular',
    'Orbitron Black',
    'Orbitron Light',
    'PlayfairDisplay-Bold',
    'PlayfairDisplay-Italic',
    'PlayfairDisplay-Regular',
    'Solway-ExtraBold',
    'Solway-Light',
  ]

  // 显示列表
  fontFamily = [
    '<img src="/dyassets/fontSize/02.svg" />',
    '<img src="/dyassets/fontSize/03.svg" />',
    '<img src="/dyassets/fontSize/04.svg" />',
    '<img src="/dyassets/fontSize/05.svg" />',
    '<img src="/dyassets/fontSize/06.svg" />',
    '<img src="/dyassets/fontSize/08.svg" />',
    '<img src="/dyassets/fontSize/09.svg" />',
    '<img src="/dyassets/fontSize/10.svg" />',
    '<img src="/dyassets/fontSize/11.svg" />',
    '<img src="/dyassets/fontSize/12.svg" />',
    '<img src="/dyassets/fontSize/13.svg" />',
    '<img src="/dyassets/fontSize/14.svg" />',
    '<img src="/dyassets/fontSize/15.svg" />',
    '<img src="/dyassets/fontSize/16.svg" />',
    '<img src="/dyassets/fontSize/17.svg" />',
    '<img src="/dyassets/fontSize/18.svg" />',
    '<img src="/dyassets/fontSize/19.svg" />',
    '<img src="/dyassets/fontSize/20.svg" />',
    '<img src="/dyassets/fontSize/21.svg" />',
    '<img src="/dyassets/fontSize/22.svg" />',
    '<img src="/dyassets/fontSize/23.svg" />',
    '<img src="/dyassets/fontSize/24.svg" />',
    '<img src="/dyassets/fontSize/25.svg" />',
    '<img src="/dyassets/fontSize/26.svg" />',
    '<img src="/dyassets/fontSize/caveatbold.svg" />',
    '<img src="/dyassets/fontSize/caveatregular.svg" />',
    '<img src="/dyassets/fontSize/dancingscriptbold.svg" />',
    '<img src="/dyassets/fontSize/dancingscriptregular.svg" />',
    '<img src="/dyassets/fontSize/girassolregular.svg" />',
    '<img src="/dyassets/fontSize/ibarrarealnovaitalic.svg" />',
    '<img src="/dyassets/fontSize/ibarrarealnovasemibold.svg" />',
    '<img src="/dyassets/fontSize/notoserifitalic.svg" />',
    '<img src="/dyassets/fontSize/notoserifregular.svg" />',
    '<img src="/dyassets/fontSize/orbitronblack.svg" />',
    '<img src="/dyassets/fontSize/orbitronlight.svg" />',
    '<img src="/dyassets/fontSize/playfairdisplaybold.svg" />',
    '<img src="/dyassets/fontSize/playfairdisplayitalic.svg" />',
    '<img src="/dyassets/fontSize/playfairdisplayregular.svg" />',
    '<img src="/dyassets/fontSize/solwayextrabold.svg" />',
    '<img src="/dyassets/fontSize/solwaylight.svg" />',
  ]

  fontFamilyIndex = 0

  constructor(
    private _store: Store<fromRoot.State>,
    private _chartMapService: ChartMapService,
    private _router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = this._router.snapshot.queryParams.project
    // 启用透明度单独配置 加入颜色模块统一渲染
    if (this.curProps.opacity !== 100) {
      if (this.curProps.color.length === 4) {
        this.curProps.color =
          this.curProps.color[0] +
          this.curProps.color[1] +
          this.curProps.color[1] +
          this.curProps.color[2] +
          this.curProps.color[2] +
          this.curProps.color[3] +
          this.curProps.color[3]
      }
      this.curProps.color =
        this.curProps.color.substring(0, 7) +
        Math.round(this.curProps.opacity * 2.55)
          .toString(16)
          .padStart(2, '0')
      this.curProps.opacity = 100
    }
    this.mySubscription.add(
      this._store.select(fromRoot.getCurrentProjectFull).subscribe((project) => {
        this.themeColorList = project.article.contents.theme.colors
      })
    )
  }

  onDropDownChanged(event) {
    this.fontFamilyIndex = event
    const newBlock = _.cloneDeep(this.curBlock)

    ;(<ProjectModels.TextBlockProps>newBlock.props).fontFamily = this.fontFamilyText[event]
    this.updateProject(newBlock)
  }

  onInput(value, type) {
    const newBlock = _.cloneDeep(this.curBlock)
    if (type === 'opacity') {
      ;(<ProjectModels.TextBlockProps>newBlock.props).opacity = value
    } else if (type == 'fontSize') {
      ;(<ProjectModels.TextBlockProps>newBlock.props).fontSize = value
    } else if (type == 'lineHeight') {
      ;(<ProjectModels.TextBlockProps>newBlock.props).lineHeight = value
    } else if (type == 'letterSpacing') {
      ;(<ProjectModels.TextBlockProps>newBlock.props).letterSpacing = value
    }
    this.updateProject(newBlock)
  }

  onSizeChanged(event) {
    if (event) {
      const newBlock = _.cloneDeep(this.curBlock)

      newBlock.props.size.height = event.value0
      newBlock.props.size.width = event.value1
      newBlock.props.size.rotate = event.value2
      if (event.type == 'locked') {
        newBlock.props.size.ratio = event.locked ? newBlock.props.size.height / newBlock.props.size.width : null
      }
      this.updateProject(newBlock)
    }
  }

  onStyleClicked(index) {
    const newBlock = _.cloneDeep(this.curBlock)
    switch (index) {
      case 0:
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.bold = !(<ProjectModels.TextBlockProps>newBlock.props)
          .basic.bold
        break
      case 1:
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.italic = !(<ProjectModels.TextBlockProps>newBlock.props)
          .basic.italic
        break
      case 2:
        const underline = (<ProjectModels.TextBlockProps>newBlock.props).basic.underline
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.underline = !underline
        if (!underline) {
          ;(<ProjectModels.TextBlockProps>newBlock.props).basic.deleteline = false
        }
        break
      case 3:
        const deleteline = (<ProjectModels.TextBlockProps>newBlock.props).basic.deleteline
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.deleteline = !deleteline
        if (!underline) {
          ;(<ProjectModels.TextBlockProps>newBlock.props).basic.underline = false
        }
        break
      case 4:
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.align = 'left'
        break
      case 5:
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.align = 'center'
        break
      case 6:
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.align = 'right'
        break
      case 7:
        ;(<ProjectModels.TextBlockProps>newBlock.props).basic.align = 'justify'
        break
      default:
        break
    }
    this.updateProject(newBlock)
  }

  updateProject(block) {
    this.curBlock = block
    this.curProps = block.props
    let newData: UpdateProjectContent = {
      target: {
        blockId: block.blockId,
        pageId: this.curPageId,
        type: block.type,
      },
      method: 'put',
      block: block,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  /**color-picker */
  public onEventLog(data: any): void {
    const textBlock = _.cloneDeep(this.curBlock)
    ;(<ProjectModels.TextBlockProps>textBlock.props).color = data
    this.updateProject(textBlock)
  }

  updateBlock(block: ProjectModels.Block, pageId?: string) {
    const newBlock = _.cloneDeep(block)
    this.curBlock = newBlock
    newBlock.props.size.rotate = Math.ceil(Number(Number.parseInt(newBlock.props.size.rotate as any)))
    this.curProps = <ProjectModels.TextBlockProps>newBlock.props
    this.curPageId = pageId

    let index = _.indexOf(this.fontFamilyText, this.curProps.fontFamily)
    this.fontFamilyIndex = index === -1 ? 0 : index
  }
}
