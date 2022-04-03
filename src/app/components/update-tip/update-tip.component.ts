import { Component, OnInit, ElementRef, Renderer2, } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations'
declare var jQuery: any;

@Component({
  selector: 'lx-update-tip',
  templateUrl: './update-tip.component.html',
  styleUrls: ['./update-tip.component.scss'],
})
export class UpdateTipComponent implements OnInit {


  timer;
  timerClose;
  isShow = true;
  height: number;
  flag = false;

  constructor(
    private _el: ElementRef,
    private _render: Renderer2,
    private _router: Router,
  ) { }

  ngOnInit() { 
    
  }

  ngAfterViewInit() {
    this.height = this._el.nativeElement.getElementsByClassName('update-tip-wrapper')[0].getBoundingClientRect().height
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('update-tip-wrapper')[0],"height",`${this.height}px`)
    this.timer = setTimeout(() => {
      this.flag = true;
      if(this._el.nativeElement.getElementsByClassName('update-tip-wrapper')[0]) {
        this._render.setStyle(this._el.nativeElement.getElementsByClassName('update-tip-wrapper')[0],"height","0");  
      }
    },4000)
    this.timerClose = setTimeout(() => {
      if (this._el.nativeElement.getElementsByClassName('update-tip-wrapper')[0].style.height === "0px"  )
      this.isShow = false;
    },7000)
  }

  closeHandle(e) {
    let that = this;
    let target = document.getElementById("flyer-target")
    if (!target) {
      that.isShow = false;
      localStorage.setItem("float-menu-show","true");
      return;
    }

    jQuery(function ($) {
      const img = new Image();
      img.src = '/dyassets/images/update-tip.png';
      img.className = "fly-item";
      img.onload = (event) => {
        that.isShow = false;
        var flyer = $(img)

        flyer.fly({
          start: {
            left: e.pageX - 330,
            top: e.pageY
          },
          end: {
            left: target.getBoundingClientRect().right - 10,
            top: target.getBoundingClientRect().top + 10,
            width: 0,
            height: 0
          },
          speed: 1.2,
          onEnd: function () {
            console.log("success");
            $("#flyer-target").addClass("active");
            localStorage.setItem("float-menu-show","true");
            flyer.remove()
          }
        });
      }

    })

  }

  clearTimeout() {
    this.flag = true;
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('update-tip-wrapper')[0],"height",`${this.height}px`)
    clearTimeout(this.timer);
    clearTimeout(this.timerClose);
  }

  createTimeout() {
    if (!this.flag) return;
    this._render.setStyle(this._el.nativeElement.getElementsByClassName('update-tip-wrapper')[0],"height","0")
    this.timerClose = setTimeout(() => {
      this.isShow = false;
    },3000)
  }

  goHelp() {
    let tempPage = window.open('', '_blank');
        tempPage.location.href = window.location.href.split('#')[0] + `#/pages/help/list?id=title-3-3`;
  }

}
