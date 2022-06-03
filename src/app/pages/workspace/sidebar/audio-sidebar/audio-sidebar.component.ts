import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer2, ViewChildren } from '@angular/core'
import { UtilsService } from '../../../../share/services'
import * as $ from 'jquery'
import { UpdateProjectContent } from '../../../../states/models/project.model'
import { UpdateCurrentProjectArticleAction } from '../../../../states/actions/project.action'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../../states/reducers'
import { ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import { AudioMapService } from '../../../../block/audio-map.service'
import { API } from '../../../../states/api.service'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs'
import { DeleteUploadComponent, InputModalComponent } from '../../../../components/modals'
import { BsModalService, BsModalRef } from 'ngx-bootstrap'
import { take } from 'rxjs/operators'

@Component({
  selector: 'lx-audio-sidebar',
  templateUrl: './audio-sidebar.component.html',
  styleUrls: ['./audio-sidebar.component.scss'],
})
export class AudioSidebarComponent implements OnInit {
  @Input() pageId: string
  @Input() isToggle: boolean = false
  @Input() songData
  @Output() closeSidebarEvent = new EventEmitter()
  @Output() backPageOne = new EventEmitter()
  @Output() changeSong = new EventEmitter()

  @ViewChild('audioScroll') audioScroll
  @ViewChildren('audioList') audioList

  sysTimer

  styles
  innerStyles
  pageType = 'insertSong'
  activeIndex = -1
  projectId: string

  activePlaying = -1

  // insertText = '插入';

  partCategories = []

  categories = []
  title = '插入音乐'
  pageNum = 1

  songList = []
  nextPageUrl = ''
  count

  moreBtnText = '加载更多...'
  categoriesSelected = '全部'
  bgmBlock

  // listPlaying = true;

  bsModalRef: BsModalRef

  private options = { withCredentials: true }

  mysubscription = new Subscription()

  constructor(
    private _utilsService: UtilsService,
    private _store: Store<fromRoot.State>,
    private _activateRouter: ActivatedRoute,
    private _audioService: AudioMapService,
    private _api: API,
    private _http: HttpClient,
    private _modalService: BsModalService,
    private _render: Renderer2
  ) {
    this.projectId = this._activateRouter.snapshot.queryParams.project
  }

  ngOnInit() {
    // 组件高度
    this.styles = {
      height: innerHeight - 50 + 'px',
      width: '280px',
    }
    // 内部高度
    this.innerStyles = {
      height: innerHeight - 50 - 97 - 40 - 80 + 'px',
    }
    // 获取全部歌曲
    this.getSongs('first')
    // this.getSongs();
    // 获取全部歌曲分类
    this.getSongCategory()
    // 是否是切换音乐
    if (this.isToggle) {
      this.pageNum = 2
      setTimeout(() => {
        this.audioScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
      }, 100)
      $('.right-content').css('width', '280px')
      // $('.header-container').css('padding-right', '280px')
      $('.change-page').css('right', '295px')
    }
  }

  // 处理鼠标划入
  handleMouseEnter(i) {
    this.activeIndex = i
    // if (this.pageType === 'bgm' && this.bgmBlock) {
    //   this.insertText = "切换";
    // } else {
    //   this.insertText = "插入";
    // }
  }

  // 处理歌曲滚动加载
  handleScroll() {
    var e = e || window.event
    if (this.sysTimer) {
      clearTimeout(this.sysTimer)
    }

    this.sysTimer = setTimeout(() => {
      const top = Math.round(e.target.scrollTop)
      // 最大滚动距离
      var maxHeight = e.target.scrollHeight - e.target.clientHeight - 10
      if (top >= maxHeight) {
        this.getSongs()
      }
    }, 50)
  }

  // 获取全部歌曲
  getSongs(time = '') {
    if (this.moreBtnText === '加载更多...') {
      const url = this.nextPageUrl ? this.nextPageUrl : `${this._api.getOldUrl()}/vis/dychart/musiclib`
      this._http.get(url, this.options).subscribe((res) => {
        if (this.nextPageUrl) {
          this.handleData(res, false)
        } else {
          this.handleData(res, true)
        }
        if (time === 'first') {
          this.getSongs()
        }
      })
    }
  }

  // 获取全部歌曲分类
  getSongCategory() {
    const url = `${this._api.getOldUrl()}/vis/dychart/musiclib/categories`
    this._http.get(url, this.options).subscribe((res) => {
      res['data'].forEach((data) => {
        this.categories.push({
          category: data,
          category_cn: data,
        })
      })
      this.categories.unshift({
        category: '全部',
        category_cn: '全部',
      })
      this.partCategories = _.cloneDeep(this.categories).slice(0, 5)
    })
  }

  // 分类
  classify(word) {
    if (word !== this.categoriesSelected) {
      this.categoriesSelected = word
      const key = word === '全部' ? '' : word
      const url = `${this._api.getOldUrl()}/vis/dychart/v2/musiclib/?category=${key}`
      this._http.get(url, this.options).subscribe((res) => {
        this.moreBtnText = '加载更多...'
        this.handleData(res)
      })
    }
  }

  // 处理数据
  handleData(data, isClear = true) {
    if (isClear) {
      this.songList = []
    }
    this.count = data['data']['count']
    this.nextPageUrl = data['data']['next']
    this.songList = this.songList.concat(data['data']['results'])
    this.moreBtnText = this.count > this.songList.length ? '加载更多...' : '- 没有更多了 -'
  }

  // 获取更多数据
  getMore() {
    if (this.count > this.songList.length) {
      this.getSongs()
    } else {
      this.moreBtnText = '- 没有更多了 -'
    }
  }

  // 关闭
  clickCloseBtn() {
    this.closeSidebarEvent.emit()
  }

  // 点击播放按钮
  handlePlayBtn(i) {
    if (this.activePlaying === i) {
      this.activePlaying = -1
      this.audioList._results[i].nativeElement.pause()
      this.audioList._results[i].nativeElement.currentTime = 0
    } else {
      if (this.activePlaying !== -1) {
        this.audioList._results[this.activePlaying].nativeElement.pause()
        this.audioList._results[this.activePlaying].nativeElement.currentTime = 0
      }
      this.activePlaying = i
      this.audioList._results[i].nativeElement.play()
    }
  }

  goSecondPage(type: string) {
    if (type === 'bgm') {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-bgmMusic'])
    } else {
      // 百度统计
      window['_hmt'].push(['_trackEvent', 'editpage', 'edit-desktop', 'edit-insert-musicPlayer'])
    }
    this.pageNum = 2
    this.title = type === 'bgm' ? '背景音乐' : '音乐模块'
    this.pageType = type
    this._store.select(fromRoot.getCurrentProjectArticle).subscribe((res) => {
      this.bgmBlock = res['contents']['pages'][0]['blocks'].filter((item) => item['props']['type'] === 'bgm')[0]
    })
    setTimeout(() => {
      this.audioScroll.nativeElement.addEventListener('scroll', this.handleScroll.bind(this))
    }, 100)
  }

  // 全部搜索
  search(title) {
    const url = `${this._api.getOldUrl()}/vis/dychart/v2/musiclib?tag=${title}`
    this._http.get(url, this.options).subscribe((res) => {
      this.handleData(res)
    })
  }

  // 打开输入框
  handleOpenModal() {
    let url = ''
    if (this.songData) {
      url = this.songData.sourceType === 'url' ? this.songData.src : ''
    }
    this.bsModalRef = this._modalService.show(InputModalComponent, {
      ignoreBackdropClick: true,
      initialState: {
        confirmText: this.isToggle ? '切换' : '插入',
        url: url,
      },
    })
    this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
      if (this.bsModalRef.content.confirmFlag) {
        let userUrl = this.bsModalRef.content.url
        if (!!userUrl) {
          let audio = this._render.createElement('audio')
          audio.src = userUrl
          audio.onloadedmetadata = () => {
            let song = {
              name: '自定义',
              url: userUrl,
              duration: this.formatSecond(audio.duration),
              sourceType: 'url',
            }
            this._render.removeChild(audio, audio)
            this.handleInsertSong(song, 'url')
          }
        }
      }
    })
  }

  // 处理歌曲选中逻辑
  handleInsertSong(item, type = 'system') {
    if (this.isToggle) {
      this.changeSong.emit({ item, type })
    } else {
      if (this.pageType === 'bgm') {
        if (this.bgmBlock) {
          this.bsModalRef = this._modalService.show(DeleteUploadComponent, {
            initialState: {
              content: '数据图文中插入新背景音乐将会替换原背景音乐，若需保留背景音乐相关参数，请使用右侧「切换音乐」',
              deleteTitle: {
                position: 'left',
                content: '提示',
              },
              deleteActions: {
                buttons: [
                  {
                    title: '取消',
                    action: 'cancel',
                  },
                  {
                    title: '确认替换',
                    action: 'confirm',
                  },
                ],
              },
              isInsertSong: true,
            },
          })
          this._modalService.onHidden.pipe(take(1)).subscribe((r: string) => {
            if (this.bsModalRef.content.confirmFlag) {
              this.delBlock(this.bgmBlock)
              let newBlock = _.cloneDeep(this._audioService.SongBlockTemplate)
              newBlock = this.initBgmBlock(newBlock, item)
              this.addAudio(newBlock, item, 'bgm')
              this.curSelected(newBlock)
              this.backToTop()
            }
          })
        } else {
          let newBlock = _.cloneDeep(this._audioService.SongBlockTemplate)
          newBlock = this.initBgmBlock(newBlock, item)
          this.addAudio(newBlock, item, 'bgm')
          this.backToTop()
        }
      } else {
        const newBlock = _.cloneDeep(this._audioService.SongBlockTemplate)
        newBlock.props.type = 'insertSong'
        this.addAudio(newBlock, item)
      }
    }
  }

  // 初始化 bgm block数据
  initBgmBlock(block, song) {
    block.props.type = 'bgm'
    block.props.size.width = '82'
    block.props.size.height = '82'
    block.props.size.ratio = '1'
    block.props.playControl = {
      autoplay: true,
      loopback: true,
    }
    block.props.data.src = song.url
    block.props.data.sourceType = song.sourceType === 'url' ? 'url' : 'system'
    block.props.skins = ['default']
    block.props.skinSelected = 'default'
    return block
  }

  addAudio(newBlock, song, type = 'insertSong') {
    newBlock.blockId = this._utilsService.generate_uuid()
    newBlock.props.size.rotate = 0
    newBlock.props.data.src = song.url
    newBlock.props.data.title = song.name
    newBlock.props.data.time = song.duration
    newBlock.props.data.sourceType = song.sourceType
    let left,
      top,
      scale: number = Number.parseInt(document.querySelector('.page-size span').innerHTML)
    if (type == 'insertSong') {
      // 位置视野居中
      left = Math.round($('.center-content').scrollLeft() / (scale / 100)) + 200
      top = Math.round($('.center-content')[0].scrollTop / (scale / 100)) + 200

      if (scale < 100) {
        left = left + 100 * (scale / 100)
        top = top + 100 * (scale / 100)
      } else {
        left = left - 100 * (scale / 100)
        top = top - 100 * (scale / 100)
      }
    }

    newBlock.position = {
      top: type == 'insertSong' ? top : 0,
      left: type == 'insertSong' ? left : $('#focal').width() / (scale / 100) - 82,
    }

    const newData: UpdateProjectContent = {
      target: {
        blockId: newBlock.blockId,
        pageId: this.pageId,
        type: 'audio',
      },
      method: 'add',
      block: newBlock as any,
    }
    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, newData))
  }

  delBlock(block) {
    // 删除之前的video
    let delBlock = _.cloneDeep(block)
    let delData: any = {
      target: {
        blockId: delBlock.blockId,
        pageId: this.pageId,
        type: delBlock.type,
      },
      method: 'delete',
      block: delBlock,
    }

    this._store.dispatch(new UpdateCurrentProjectArticleAction(this.projectId, delData))
  }

  // 选中当前对象
  curSelected(newBlock) {
    const blockList = []
    const blockBoxList = $('.page').find('.block-container')
    setTimeout(() => {
      blockBoxList.each((k, v) => {
        blockList.push($(v).attr('chartid'))
      })
      const index = blockList.findIndex((x) => x === newBlock.blockId)
      if (index !== -1) {
        $(blockBoxList[index]).click()
      }
    }, 300)
  }

  goBack() {
    if (!this.isToggle) {
      this.pageNum = 1
      this.title = '插入音乐'
    } else {
      this.backPageOne.emit()
    }
  }

  backToTop() {
    $('.center-content').animate({ scrollTop: 0 }, 300)
  }

  formatSecond(second) {
    let result = parseInt(second)
    let m = Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
    let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)
    return `${m}:${s}`
  }
}
