import { Component, OnInit } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { API } from '../../../states/api.service'
import { HttpClient } from '@angular/common/http'
import { ContactUsModalComponent } from '../contact-us-modal/contact-us-modal.component'

@Component({
  selector: 'lx-data-demand-feedback',
  templateUrl: './data-demand-feedback.component.html',
  styleUrls: ['./data-demand-feedback.component.scss'],
})
export class DataDemandFeedbackComponent implements OnInit {
  feedback: boolean = true
  textPrompt: string = '请输入140字以内'
  textExceed: boolean = false

  name: string = ''
  contact: string = ''
  content: string = ''
  dataItemId: string = ''

  selectValue: boolean = true
  selectType: string = '1'

  title: string = ''
  yourRequest: string = ''
  type: string = '' // 数据需求(data) 模板需求(template) 意见反馈(request)

  constructor(
    public bsModalRef: BsModalRef,
    private _http: HttpClient,
    private _api: API,
    private _modalService: BsModalService
  ) {}

  ngOnInit() {}

  close() {
    this.bsModalRef.hide()
  }

  selectOption(flag) {
    this.selectValue = flag
    // this.selectType = this.selectValue ? '1' : '2';
  }

  onTextareaChange(event) {
    if (this.content === '') {
      this.textPrompt = '此项为必填'
      this.textExceed = true
    } else {
      this.textPrompt = '请输入140字以内'
      this.textExceed = false
      if (event.target.value.length > 140) {
        this.textExceed = true
      } else {
        this.textExceed = false
      }
    }
  }

  feedbackSubmit() {
    if (this.content === '') {
      this.textPrompt = '此项为必填'
      this.textExceed = true
      return
    } else if (this.content.length > 140) {
      this.textExceed = true
      return
    } else {
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('contact', this.contact)
      formData.append('content', this.content)
      formData.append('type', this.selectType)
      let url = ''

      // 数据反馈
      if (this.type === 'data') {
        url = this._api.postDataRequirements()

        // 意见反馈
      } else if (this.type === 'request') {
        url = this._api.postRequestRequirements()

        // 模板反馈
      } else if (this.type === 'template') {
        url = this._api.postTemplateRequirements()

        // 数据纠错
      } else if (this.type === 'fixData') {
        url = this._api.postFixRequirements()
      }

      if (this.type === 'fixData') {
        this._http
          .post(url, { data_id: this.dataItemId, content: this.content, contact: this.contact, name: this.name })
          .subscribe((res) => {
            this.bsModalRef.hide()
            this._modalService.show(ContactUsModalComponent, {
              initialState: {
                content: '谢谢你的反馈，镝数会尽快联系你，听取你的宝贵意见~',
                title: {
                  position: 'left',
                  content: '提交成功',
                  button: '完成',
                },
              },
            })
          })
      } else {
        this._http.post(url, formData).subscribe((res) => {
          this.feedback = false
          // this.dataDemandFeedback.height = '173px !important';
          this.bsModalRef.hide()
          this._modalService.show(ContactUsModalComponent, {
            initialState: {
              content: '谢谢你的反馈，镝数会尽快联系你，听取你的宝贵意见~',
              title: {
                position: 'left',
                content: '提交成功',
                button: '完成',
              },
            },
          })
        })
      }
    }
  }
}
