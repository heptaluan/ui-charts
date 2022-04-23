/*
 * @Description: 个人设置-基本设置
 */
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core'
import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Store } from '@ngrx/store'
import * as fromRoot from '../../../states/reducers'
import * as UserActions from '../../../states/actions/user.action'
import * as UserModels from '../../../states/models/user.model'
import { Subscription, Observable } from 'rxjs'

@Component({
  selector: 'lx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  userinfo$: Observable<UserModels.UserInfo>
  userinfoSubscribe = new Subscription()
  avatarUrl: any
  avatarData: any
  avatarImage: any
  loginName: any
  nickName: any
  site: any
  intro: any
  nickNameFlag: boolean = false
  introFlag: boolean = false

  cropperSettings: CropperSettings
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent
  @ViewChild('staticModal', undefined)
  staticModal: ModalDirective

  constructor(private _store: Store<fromRoot.State>) {
    this.cropperSettings = new CropperSettings()
    this.cropperSettings.width = 100
    this.cropperSettings.height = 100
    this.cropperSettings.croppedWidth = 400
    this.cropperSettings.croppedHeight = 400
    this.cropperSettings.canvasWidth = 400
    this.cropperSettings.canvasHeight = 400
    this.cropperSettings.noFileInput = true
    this.avatarData = {}
    this.userinfo$ = this._store.select(fromRoot.getUserInfo)
  }

  ngOnInit() {
    this.userinfoSubscribe = this.userinfo$.subscribe((info) => {
      if (info) {
        this.avatarUrl = info.avatar
        this.loginName = info.loginname ? info.loginname : ''
        this.nickName = info.nickname ? info.nickname : ''
        this.site = info.site ? info.site : ''
        this.intro = info.intro ? info.intro : ''
      }
    })
  }

  onUploadImg(e) {
    const that = this
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      const image: any = new Image()
      reader.onload = (e2: any) => {
        image.src = e2.target.result
        that.cropper.setImage(image)
        that.staticModal.show()
      }

      reader.readAsDataURL(e.target.files[0])
    }
  }

  onInputClicked(e) {
    e.target.value = ''
  }

  onNicknameUp(e) {
    this.nickNameFlag = e.target.value.length > 20
    this.nickName = e.target.value ? e.target.value : ''
  }

  onSiteUp(e) {
    this.site = e.target.value ? e.target.value : ''
  }

  onIntroUp(e) {
    this.introFlag = e.target.value.length > 140
    this.intro = e.target.value ? e.target.value : ''
  }

  onImageSave() {
    if (this.avatarData.image) {
      this.avatarImage = this.avatarData.image
    }
    this.staticModal.hide()
  }

  onSave() {
    // 价格 百度统计
    window['_hmt'].push(['_trackEvent', 'me', 'me', 'me-change-settings'])

    if (!this.nickNameFlag && !this.introFlag) {
      const data: FormData = new FormData()
      if (this.avatarImage) {
        data.append('avatar', this.avatarImage)
      }
      data.append('nickname', this.nickName.replace(/\s+/g, ''))
      data.append('intro', this.intro)
      data.append('site', this.site)
      this._store.dispatch(new UserActions.SetUserInfoAction(data))
    } else {
      return
    }
  }

  ngOnDestroy() {
    this.userinfoSubscribe.unsubscribe()
  }
}
