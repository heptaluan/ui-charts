import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  SimpleChanges,
  Renderer2
} from "@angular/core";
declare var $: any;
import * as _ from 'lodash';
import { Subscription } from "rxjs";
import { RoundNum, HSL2RGB, RGB2HSL, toPercent } from '../../utils/wheel-color-picker'

@Component({
  selector: "lx-wheel-color-picker",
  templateUrl: "./wheel-color-picker.component.html",
  styleUrls: ["./wheel-color-picker.component.scss"]
})

export class WheelColorPickerComponent implements OnInit, OnChanges {

  isShowWheelColorPicker: boolean = false
  colorSelecedText: string;
  @Output() onChanged = new EventEmitter();
  @Output() onClosed = new EventEmitter();
  @ViewChild("slider") slider: ElementRef;
  @ViewChild("gradient") gradient: ElementRef;
  @ViewChild("scursor") scursor: ElementRef;
  scursorLeft: number = 180;
  isActive: boolean = false;
  isChangeWCP: boolean = true;

  colorOpacitySeleced: string = "100";
  opacitySeleced: number = 1;
  colorShowSeleced: string = "#ffffff";
  opacityBackground: string = "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))";

  isSingle: boolean = true;

  gradientColor = [];
  isGradientSliderMove = false;
  angle = "0";
  rotate = 0;

  gradientBackground: string = "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))";

  gradientColorShow = "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))";


  presetColorList = [
    "#dd2559",
    "#eb9436",
    "#f5cc44",
    "#30cb13",
    "#2d8Bfe",
    "#152ad1",
    "#cc45f4",
    "#8b572a",
    "#50e3c2",
    "#9013fe",
    "#ffffff",
    "#999999",
    "#666666",
    "#333333"
  ];

  usedColorList = [];
  isChangeByOwn = false;

  // 新增
  isShowColorPicker: boolean = false;
  themColorList = [];
  isOpacityShow: boolean = true;
  colorSeleced: string = "#ffffff";
  isOverflow: boolean = false;
  isGradientShow: boolean = false;
  left
  top
  clientRect

  getColorListSubscription = new Subscription();
  sendHandleColorChangeSubscription = new Subscription()

  constructor(
    private _el: ElementRef,
    private _render: Renderer2
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.colorSeleced && changes.colorSeleced.currentValue !== undefined) {

      this.colorSeleced = this.colorToHex(this.colorSeleced);

      if (this.colorSeleced.indexOf('angle') > 0) {
        if (this.isChangeByOwn) {
          this.isChangeByOwn = false;
          return;
        }

        if (this.gradientColor !== JSON.parse(this.colorSeleced.replace(RegExp("\'", "g"), "\""))) {
          this.isSingle = false;
          this.gradientColor = JSON.parse(this.colorSeleced.replace(RegExp("\'", "g"), "\""));
          this.colorSeleced = this.gradientColor[0].split(":")[0];
          this.angle = this.gradientColor[this.gradientColor.length - 1].split(":")[1];
          this.rotate = Number(this.angle);
          this.setGradient();
          this.setGradientSlider(0);
          this.setColorHexSeleced(this.gradientColor[0]);
        }

        return;
      } else {
        this.isSingle = true;
        this.setColorHexSeleced(this.colorSeleced);
      }

      if (this.isGradientShow && this.colorSeleced.indexOf('angle') < 0 && !this.isChangeByOwn) {
        this.gradientColor = [];
      }

      if (this.colorSeleced.length === 4) {
        this.colorShowSeleced =
          this.colorSeleced[0] +
          this.colorSeleced[1] +
          this.colorSeleced[1] +
          this.colorSeleced[2] +
          this.colorSeleced[2] +
          this.colorSeleced[3] +
          this.colorSeleced[3];
      }
      this.opacitySeleced = 1;
      this.colorOpacitySeleced = "100";

      if (this.colorSeleced.length === 7) {
        this.colorShowSeleced = this.colorSeleced;
        this.scursorLeft = 180;
      }
      if (this.colorSeleced.length === 9) {
        this.opacitySeleced =
          Math.round((parseInt(this.colorSeleced[7] + this.colorSeleced[8], 16) / 255) * 100 ) / 100;
        this.colorOpacitySeleced = this.opacitySeleced * 100 + "";
        this.colorShowSeleced = this.colorSeleced.substring(0, 7);
        this.scursorLeft = this.opacitySeleced / 1 * 180;
      }

      if (!this.isChangeByOwn) {
        this.colorSelecedText = this.colorShowSeleced.substring(1);
      }

      this.isChangeByOwn = false;
    }
  }

  initRefData(res) {
    if (res) {
      this.clientRect = res.clientRect
      this.left = res.left
      this.top = res.top
      this.isShowColorPicker = res.isShowColorPicker
      this.themColorList = res.themColorList
      this.isOpacityShow = res.isOpacityShow
      this.colorSeleced = res.colorSeleced
      this.isOverflow = res.isOverflow
      this.isGradientShow = res.isGradientShow
      this.usedColorList = JSON.parse(localStorage.getItem("usedColorList"));
    }
  }

  ngOnInit() {
    if (!this.colorSeleced) return;
    this.colorSeleced = this.colorToHex(this.colorSeleced);

    if (this.colorSeleced.indexOf('angle') > 0) {
      this.isSingle = false;
      this.gradientColor = JSON.parse(this.colorSeleced.replace(RegExp("\'", "g"), "\""));
      this.colorSeleced = this.gradientColor[0].split(":")[0];
      this.angle = this.gradientColor[this.gradientColor.length - 1].split(":")[1];
      this.rotate = Number(this.angle);
      this.setGradient();
      this.setGradientSlider(0);
    }

    if (this.colorSeleced.length === 4) {
      this.colorShowSeleced =
        this.colorSeleced[0] +
        this.colorSeleced[1] +
        this.colorSeleced[1] +
        this.colorSeleced[2] +
        this.colorSeleced[2] +
        this.colorSeleced[3] +
        this.colorSeleced[3];
    }
    this.opacitySeleced = 1;
    this.colorOpacitySeleced = "100";
    if (this.colorSeleced.length === 7) {
      this.colorShowSeleced = this.colorSeleced;
      this.scursorLeft = 180;
    }
    if (this.colorSeleced.length === 9) {
      this.opacitySeleced = Math.round((parseInt(this.colorSeleced[7] + this.colorSeleced[8], 16) / 255) * 100) / 100;
      this.colorOpacitySeleced = this.opacitySeleced * 100 + "";
      this.colorShowSeleced = this.colorSeleced.substring(0, 7);

      this.scursorLeft = this.opacitySeleced / 1 * 180;
    }
    this.colorSelecedText = this.colorShowSeleced.substring(1);

    if (this.colorShowSeleced && this.colorShowSeleced.length > 0) {
      this.colorSelecedText = this.colorShowSeleced.substring(1);
    }
    window.addEventListener("mousedown", this.allClick.bind(this));
    if (!JSON.parse(localStorage.getItem("usedColorList"))) {
      localStorage.setItem("usedColorList", JSON.stringify([]));
    }
  }

  ngOnDestroy() {
    window.removeEventListener("mousedown", this.allClick.bind(this));
    document.onmouseup = null;
    this.getColorListSubscription.unsubscribe()
    this.sendHandleColorChangeSubscription.unsubscribe()
  }

  allClick() {
    if (this.isShowColorPicker) {
      var e = e || window.event;
      let flag1 = false;
      let flag2 = false;
      this._el.nativeElement.querySelectorAll(".color-picker-wrapper").forEach(element => {
        if (!element.contains(e.target)) {
          flag1 = true;
        }
      });
      this._el.nativeElement.querySelectorAll(".wheel-color-picker").forEach(element => {
        if (!element.contains(e.target)) {
          flag2 = true;
        }
      });
      if (this._el.nativeElement.querySelector(".color-picker-wrapper") && flag1 && flag2) {
        this.closeDialog();
      }
    }
  }

  // 开关选色版
  showColorPicker() {
    this.isShowColorPicker = !this.isShowColorPicker;
    if (!this.isShowColorPicker) {
      this.closeDialog();
      $(document).unbind('keydown');
    } else {
      if (this.isGradientShow) {
        $(document).keydown(e => {
          if (e.keyCode === 46 || e.keyCode === 8) this.removeSlider()
        });
      }

      this.usedColorList = JSON.parse(localStorage.getItem("usedColorList"));
      if (this.usedColorList.length === 0) {
        this.usedColorList.push(this.colorShowSeleced);
      }
      this.changeBackegroudColor();
    }
  }

  // 开关细节选项
  showWheelColorPicker() {
    this.isShowWheelColorPicker = !this.isShowWheelColorPicker;
    setTimeout(() => {
      $("#color-block").wheelColorPicker();
      $("#color-block").click();
      $("#color-block").wheelColorPicker("setValue", this.colorShowSeleced);
      this.changeBackegroudColor();
      $(".color-block").on("colorchange", () => {
        if (this.isChangeWCP) {
          this.colorShowSeleced = $(".color-block").wheelColorPicker("value");
          this.colorSelecedText = this.colorShowSeleced.substring(1);
          this.changeBackegroudColor();
        }
      });
      this.setColorOpacitySeleced();
      this.setColorBoxTop()
    }, 1);
  }

  setColorBoxTop() {
    if (this.isShowWheelColorPicker) {
      if (document.body.clientHeight - this.top < 481) {
        this.top = document.body.clientHeight - 481
      }
    } else {
      if (document.body.clientHeight - this.clientRect.y < 320) {
        this.top = document.body.clientHeight - 320
      }
    }
  }

  // 关闭选色版
  closeDialog() {
    this.isShowColorPicker = false;
    this.isShowWheelColorPicker = false;
    this.onClosed.emit(true)
  }

  // 固定单色设置选择颜色
  setColorSeleced(color?) {
    if (color) {
      this.colorShowSeleced = color;
      this.colorSelecedText = this.colorShowSeleced.substring(1);
      this.opacitySeleced = 1;
      this.colorOpacitySeleced = "100";
      if (this.slider) {
        this.scursorLeft = this.slider.nativeElement.offsetWidth;
      }
      this.changeBackegroudColor();
      this.emitColor();
      if ($("#color-block")) {
        $("#color-block").wheelColorPicker("setValue", this.colorShowSeleced);
      }
      this.addLocalStorage();
    } else {
      if (
        ("#" + this.colorSelecedText).match(/#([\da-f]{3}){1,2}/gi) != null &&
        (this.colorSelecedText.length === 3 ||
          this.colorSelecedText.length === 6)
      ) {
        this.colorShowSeleced = "#" + this.colorSelecedText;

        this.isChangeWCP = false;
        $("#color-block").wheelColorPicker(
          "setValue",
          "#" + this.colorSelecedText
        );
        this.isChangeWCP = true;

        // this.isChangeByOwn = true;
        this.changeBackegroudColor();

        this.emitColor();
      }
    }
  }

  // 最近使用颜色 设置选择颜色
  setColorRgbaSeleced(color: string) {
    color = color.substring(5, color.length - 1);
    let rgba = color.split(",");

    this.colorShowSeleced =
      "#" +
      parseInt(rgba[0])
        .toString(16)
        .padStart(2, "0") +
      parseInt(rgba[1])
        .toString(16)
        .padStart(2, "0") +
      parseInt(rgba[2])
        .toString(16)
        .padStart(2, "0");
    this.colorSelecedText = this.colorShowSeleced.substring(1);

    this.opacitySeleced = parseFloat(rgba[3]);
    this.colorOpacitySeleced = parseFloat(rgba[3]) * 100 + "";
    if (this.slider) {
      this.scursorLeft =
        (this.slider.nativeElement.offsetWidth / 100) *
        parseInt(this.colorOpacitySeleced);
    }
    if ($("#color-block")) {
      $("#color-block").wheelColorPicker("setValue", this.colorShowSeleced);
    }
    this.changeBackegroudColor();
    this.emitColor();
    this.addLocalStorage();
  }

  // 3位6位8位16进制颜色转RGBa
  colorToRGB(color, flag = false) {
    let color1, color2, color3, color4;
    color = "" + color;
    if (typeof color !== "string") {
      return;
    }
    if (color.charAt(0) === "#") {
      color = color.substring(1);
    } else {
      return color;
    }
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    color4 = this.opacitySeleced;
    if (color.length === 8) {
      color4 =
        Math.round((parseInt(color[6] + color[7], 16) / 255) * 100) / 100;
      color = color.substring(0, 6);
    }

    if (/^[0-9a-fA-F]{6}$/.test(color)) {
      color1 = parseInt(color.substr(0, 2), 16);
      color2 = parseInt(color.substr(2, 2), 16);
      color3 = parseInt(color.substr(4, 2), 16);
    }
    if (flag) {
      return [color1, color2, color3, color4]
    } else {
      return "rgba(" + color1 + "," + color2 + "," + color3 + "," + color4 + ")";
    }
  }

  // 透明度输入框改变
  setColorOpacitySeleced() {
    if (this.slider) {
      if (parseInt(this.colorOpacitySeleced) > 100) {
        this.scursorLeft = this.slider.nativeElement.offsetWidth;
      } else {
        this.scursorLeft =
          (this.slider.nativeElement.offsetWidth / 100) *
          parseInt(this.colorOpacitySeleced);
      }
    }
    this.setOpacitySeleced();
  }

  // 透明度滑条改变
  setOpacitySeleced() {
    if (this.colorOpacitySeleced.match(/^([1]?\d{1,2})$/)) {
      this.opacitySeleced = RoundNum(parseInt(this.colorOpacitySeleced) / 100, 2);
    }
  }

  // 提交数据
  emitColor() {
    let emitColor;

    emitColor = this.setRetrunColor()

    if (this.isSingle) {
      this.isChangeByOwn = true;
      this.onChanged.emit(emitColor);

    } else {
      let index = $(this.gradient.nativeElement).find("slider.active").data("index");
      let colorPos = this.gradientColor[index]
      this.gradientColor[index] = emitColor + ":" + colorPos.split(":")[1];

      this.setGradient();
      this.emitGradientColor()
    }
  }

  // 提交渐变色数据
  emitGradientColor() {
    this.isChangeByOwn = true;
    let list = this.sortGradient();
    let gradient = "[";
    list.map(item => {
      gradient += `'${item}',`;
    })
    gradient = gradient.substring(0, gradient.length - 1) + "]";

    this.onChanged.emit(gradient);
  }

  // 补齐颜色
  setRetrunColor() {
    if (this.colorShowSeleced.length === 4) {
      this.colorShowSeleced =
        this.colorShowSeleced[0] +
        this.colorShowSeleced[1] +
        this.colorShowSeleced[1] +
        this.colorShowSeleced[2] +
        this.colorShowSeleced[2] +
        this.colorShowSeleced[3] +
        this.colorShowSeleced[3];
    }

    if (this.isOpacityShow) {
      return this.colorShowSeleced + Math.round(this.opacitySeleced * 255).toString(16).padStart(2, "0");
    } else {
      return this.colorShowSeleced + "ff";
    }
  }
  // 添加最近使用颜色
  addLocalStorage() {
    // 如果所选颜色包含则提升至第一位
    let colorRgba = this.colorToRGB(this.colorShowSeleced, false);

    if (this.usedColorList.indexOf(colorRgba) > -1) {
      let num = this.usedColorList.indexOf(colorRgba);
      this.usedColorList.splice(num, 1);
    }
    this.usedColorList.unshift(colorRgba);

    localStorage.setItem("usedColorList", JSON.stringify(this.usedColorList));
  }

  // 添加滑块的移动事件
  addMoveEvent() {
    this.isActive = true;
    document.onmousemove = ev => {
      if (this.isActive) {
        if (Math.round(ev.clientX - this.slider.nativeElement.getBoundingClientRect().x) > 180) {
          this.scursorLeft = 180;
        } else if (Math.round(ev.clientX - this.slider.nativeElement.getBoundingClientRect().x) < 0
        ) {
          this.scursorLeft = 0;
        } else {
          this.scursorLeft = Math.round(ev.clientX - this.slider.nativeElement.getBoundingClientRect().x);
        }
        this.colorOpacitySeleced = Math.round((this.scursorLeft / this.slider.nativeElement.offsetWidth) * 100) + "";
        this.setOpacitySeleced();
      }
    };
    document.onmouseup = () => {
      if (this.isActive) {
        this.emitColor();
        this.addLocalStorage();
      }
      document.onmousedown = null;
      document.onmousemove = null;
      this.isActive = false;
    };
  }

  // 透明度滑块 设置透明度
  setOpacity(e) {
    if (Math.round(e.clientX - this.slider.nativeElement.getBoundingClientRect().x) > 180) {
      this.scursorLeft = 180;
    } else if (Math.round(e.clientX - this.slider.nativeElement.getBoundingClientRect().x) < 0) {
      this.scursorLeft = 0;
    } else {
      this.scursorLeft = Math.round(e.clientX - this.slider.nativeElement.getBoundingClientRect().x);
    }
    this.colorOpacitySeleced = Math.round((this.scursorLeft / this.slider.nativeElement.offsetWidth) * 100) + "";
    this.setOpacitySeleced();
    this.addLocalStorage();
  }

  // 颜色转为16进制
  colorToHex(color) {
    // 如果是数字直接转换成主题色
    if (typeof color === 'number') return this.themColorList[color];
    if (!color) return "#ffffffff"
    if (color.substring(0, 4) === "rgba") {
      color = color.substring(5, color.length - 1);
      let rgba = color.split(",");
      let newColor =
        "#" +
        parseInt(rgba[0])
          .toString(16)
          .padStart(2, "0") +
        parseInt(rgba[1])
          .toString(16)
          .padStart(2, "0") +
        parseInt(rgba[2])
          .toString(16)
          .padStart(2, "0") +
        Math.round(parseFloat(rgba[3]) * 255)
          .toString(16)
          .padStart(2, "0");
      return newColor;
    } else {
      return color;
    }
  }

  validite() {
    if (parseInt(this.colorOpacitySeleced) < 0) {
      this.colorOpacitySeleced = "0";
    } else if (parseInt(this.colorOpacitySeleced) >= 100) {
      this.colorOpacitySeleced = "100";
    }
    this.setOpacitySeleced();
    this.emitColor();
    this.addLocalStorage();
  }


  changeBackegroudColor() {
    let rgba = this.colorToRGB(this.colorShowSeleced, true);

    this.opacityBackground =
      "linear-gradient(to right, rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + ",0)," +
      "rgba(" + rgba[0] + "," + rgba[1] + "," + rgba[2] + ",1))";
  }

  selectType(flag) {
    this.isSingle = flag;

    if (flag) {
      this.emitColor();
    } else {
      this.initGradient();
    }

  }

  initGradient() {
    if (this.gradientColor.length === 0) {
      let $gradient = $(this.gradient.nativeElement);
      $gradient.empty();
      let first = this._render.createElement("slider");
      let last = this._render.createElement("slider");

      this._render.appendChild(this.gradient.nativeElement, first);
      this._render.appendChild(this.gradient.nativeElement, last);

      $(last).css("left", "100%");
      $(last).data("index", 1);
      $(first).addClass("active");
      $(first).css("left", "0%");
      $(first).data("index", 0);

      let rgbaArr = this.colorToRGB(this.colorShowSeleced, true);
      let hsl = Object(RGB2HSL(rgbaArr[0], rgbaArr[1], rgbaArr[2]));
      let lastRgb = Object(HSL2RGB(hsl.H + 60, hsl.S + 0.2, hsl.L + 0));

      let lastRgba = `rgba(${lastRgb.R},${lastRgb.G},${lastRgb.B},${rgbaArr[3]})`

      let lastHex = this.colorToHex(lastRgba);

      this.gradientColor.push(`${this.setRetrunColor()}:0`);
      this.gradientColor.push(`${lastHex}:1`);
      this.gradientColor.push(`angle:0`);
      this.angle = '0';
      this.rotate = Number(this.angle);

      this.setGradient();
      this.sliderAddMousedown();
      this.emitGradientColor();
    } else {
      let index = $(this.gradient.nativeElement).find("slider.active").data("index");
      let colorPos = this.gradientColor[index]
      this.gradientColor[index] = this.setRetrunColor() + ":" + colorPos.split(":")[1];

      this.setGradient();
      this.emitGradientColor();
    }
  }

  // 设置背景颜色
  setGradient() {
    let length = this.gradientColor.length;

    let colorPos = "";

    this.sortGradient().map(item => {
      if (item.indexOf("angle") < 0) {
        colorPos += `${this.colorToRGB(item.split(":")[0], false)} ${toPercent(item.split(":")[1])},`;
      }
    })

    colorPos = colorPos.substring(0, colorPos.length - 1);
    this.gradientColorShow = `linear-gradient(${Number(this.gradientColor[length - 1].split(":")[1]) + 90}deg, ${colorPos})`;
    this.gradientBackground = `linear-gradient(90deg, ${colorPos})`;
  }

  // 设置渐变色滑块
  setGradientSlider(i) {
    $(this.gradient.nativeElement).empty();
    if (i >= this.gradientColor.length - 2) {
      i = this.gradientColor.length - 2;
    }
    this.gradientColor.map((item, index) => {
      if (item.indexOf("angle") < 0) {
        let slider = this._render.createElement("slider");
        let pos = toPercent(Number(item.split(":")[1]));
        this._render.appendChild(this.gradient.nativeElement, slider);
        $(slider).css("left", pos);
        $(slider).data("index", index);
        if (index === i) {
          $(slider).addClass("active")
        }
      }
    })
    this.sliderAddMousedown()
  }

  // 滑块绑定按下事件
  sliderAddMousedown() {
    $(this.gradient.nativeElement).children().unbind("mousedown");

    $(this.gradient.nativeElement).children().mousedown(e => {
      this.isGradientSliderMove = true;
      $(this.gradient.nativeElement).children().removeClass("active");
      $(e.target).addClass("active");
      let index = $(e.target).data("index");

      this.setColorHexSeleced(this.gradientColor[index].split(":")[0])

      this.moveSlider()
      return;
    })

  }

  // 添加渐变色滑块
  addSlider(e) {
    if (this.isGradientSliderMove) return;
    let slider = this._render.createElement("slider");
    let width = this.gradient.nativeElement.getBoundingClientRect().width
    let leftPos = e.offsetX - 4.5;
    if (leftPos > width) {
      leftPos = width
    }
    if (leftPos < 0) {
      leftPos = 0;
    }
    let left = RoundNum((leftPos / width), 4);
    this._render.appendChild(this.gradient.nativeElement, slider);

    $(this.gradient.nativeElement).children().removeClass("active");
    $(slider).addClass("active");

    $(slider).css("left", leftPos);
    this.sliderAddMousedown();

    let lessDif = null;
    let moreDif = null;
    let lessIndex = null;
    let moreIndex = null;

    this.gradientColor.map((item, index) => {
      if (item.indexOf("angle") < 0) {
        let pos = Number(item.split(":")[1]);

        if (pos > left) {
          if (moreDif === null) {
            moreDif = pos - left;
            moreIndex = index;
          } else {
            if ((pos - left) <= moreDif) {
              moreIndex = index;
              moreDif = pos - left;
            }
          }
        } else {
          if (lessDif === null) {
            lessDif = left - pos;
            lessIndex = index;
          } else {
            if ((left - pos) <= lessDif) {
              lessIndex = index;
              lessDif = left - pos;
            }
          }
        }
      }
    })

    if (lessIndex === null) {
      this.gradientColor.splice(this.gradientColor.length - 1, 0, this.gradientColor[moreIndex].split(":")[0] + ":" + left);

    } else if (moreIndex === null) {
      this.gradientColor.splice(this.gradientColor.length - 1, 0, this.gradientColor[lessIndex].split(":")[0] + ":" + left)

    } else {
      this.getBetweenGradientColor(moreIndex, lessIndex, left);

    }
    $(slider).data("index", this.gradientColor.length - 2)

    this.setColorHexSeleced(this.gradientColor[this.gradientColor.length - 2].split(":")[0])
    this.setGradient()
    this.isGradientSliderMove = true;
    this.moveSlider();
  }

  moveSlider() {
    let that = this;
    document.onmousemove = e => {
      if (that.isGradientSliderMove) {
        let left = e.clientX - this.gradient.nativeElement.getBoundingClientRect().x - 4.5;
        let width = this.gradient.nativeElement.getBoundingClientRect().width;
        if (left < 0) {
          left = 0;
        }
        if (left > (width)) {
          left = width;
        }
        $(this.gradient.nativeElement).find("slider.active").css("left", left + "px");
        let index = $(this.gradient.nativeElement).find("slider.active").data("index");
        let colorPos = this.gradientColor[index]

        this.gradientColor[index] = colorPos.split(":")[0] + ":" + RoundNum((left / width), 4);

        this.setGradient();
      }

    }
    document.onmouseup = function () {
      if (that.isGradientSliderMove) that.emitGradientColor()
      that.isGradientSliderMove = false;
      document.onmousemove = null;
    }
  }

  // 获取两个颜色渐变之间的颜色
  getBetweenGradientColor(lessIndex, moreIndex, pos) {
    let lessColor = this.gradientColor[lessIndex]
    let moreColor = this.gradientColor[moreIndex]
    let lessColorHex = lessColor.split(":")[0];
    let moreColorHex = moreColor.split(":")[0];
    let lessColorRGbArr = this.colorToRGB(lessColorHex, true);
    let moreColorRGbArr = this.colorToRGB(moreColorHex, true);
    let newColor = "rgba("
    let lessPos = Number(lessColor.split(":")[1]);
    let morePos = Number(moreColor.split(":")[1]);

    let left = (pos - lessPos) / (morePos - lessPos);

    newColor += RoundNum((lessColorRGbArr[0] + (moreColorRGbArr[0] - lessColorRGbArr[0]) * left), 0) + ',' +
      RoundNum((lessColorRGbArr[1] + (moreColorRGbArr[1] - lessColorRGbArr[1]) * left), 0) + ',' +
      RoundNum((lessColorRGbArr[2] + (moreColorRGbArr[2] - lessColorRGbArr[2]) * left), 0) + ",1)"

    this.gradientColor.splice(this.gradientColor.length - 1, 0, this.colorToHex(newColor) + ":" + pos);
  }


  // 根据位置排序
  sortGradient() {
    let arr = _.cloneDeep(this.gradientColor);
    for (let i = 0; i < arr.length - 2; i++) {
      for (let j = 0; j < arr.length - 2 - i; j++) {
        if (Number(arr[j].split(":")[1]) > Number(arr[j + 1].split(":")[1])) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }

  // 最终角度传值
  setAngle() {
    if (parseInt(this.angle) < 0) {
      this.angle = "0";
    } else if (parseInt(this.angle) >= 360) {
      this.angle = String(Number(this.angle) % 360);
    }
    this.rotate = Number(this.angle);
    let angle = this.gradientColor[this.gradientColor.length - 1]
    this.gradientColor[this.gradientColor.length - 1] = angle.split(":")[0] + ":" + this.angle;
    this.setGradient();
    this.emitGradientColor();
  }

  inputBlur(e) {
    if (e.key === "Enter") {
      $(e.target).blur();
    }
  }

  // 使用8位hex颜色重新渲染颜色面板
  setColorHexSeleced(color) {

    this.colorShowSeleced = color.substring(0, 7);

    if (!this.isChangeByOwn) {
      this.colorSelecedText = this.colorShowSeleced.substring(1);
    }

    this.opacitySeleced = Math.round((parseInt(color.substring(7, 9), 16) / 255) * 100) / 100;
    this.changeBackegroudColor();
    this.colorOpacitySeleced = this.opacitySeleced * 100 + "";
    if (this.slider) {
      this.scursorLeft = this.opacitySeleced / 1 * 180;
    }
    if ($("#color-block")) {
      $("#color-block").wheelColorPicker("setValue", this.colorShowSeleced);
    }
  }

  removeSlider() {
    if (!this.isSingle && this.gradientColor.length > 3) {
      let index = $(this.gradient.nativeElement).find("slider.active").data("index");
      let colorPos = this.gradientColor[index];
      let nextIndex;
      let arr = this.sortGradient();
      arr.map((item, i) => {
        if (item === colorPos) {
          arr.splice(i, 1);
          nextIndex = i;
        }
      })

      this.gradientColor = arr;

      this.setGradientSlider(nextIndex);
      this.setGradient();

      $(this.gradient.nativeElement).find("slider.active").mousedown();

      if (this.isGradientSliderMove) {
        this.emitGradientColor()
      }
      this.isGradientSliderMove = false;
      document.onmousemove = null;
    }
  }


  // 添加角度的鼠标事件
  addRotateChangeEvent(e) {
    let that = this;
    let target = e.target.className === "angle-wrapper" ? $(e.target).find(".circle") : $(e.target).parents(".angle-wrapper").find(".circle");
    let y = target[0].getBoundingClientRect().y;
    let x = target[0].getBoundingClientRect().x;
    let num = Math.floor(Math.atan2(e.pageY - y, e.pageX - x) * 180 / Math.PI)
    this.angle = num <= 0 ? String(-num) : String(360 - num);
    this.rotate = 360 - num;
    document.onmousemove = (even) => {
      let num = Math.floor(Math.atan2(even.pageY - y, even.pageX - x) * 180 / Math.PI)
      this.angle = num <= 0 ? String(-num) : String(360 - num);
      this.rotate = 360 - num;
    }
    document.onmouseup = function () {
      that.setAngle();
      document.onmousemove = null;
      document.onmouseup = null;
    }

  }

}
