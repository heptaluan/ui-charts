import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[blockHover]'
})
export class BlockHoverDirective {

  @Input('blockHover') show: boolean;
  @Input() isSelected: boolean;
  @Input() projectType: string;
  @Input() isUseHover: boolean = true;

  color: string;

  constructor(private _el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    
    if (this.isUseHover) {
      let classList = this._el.nativeElement.classList
      if (classList.contains('isLocked')) {
        this.color = 'red'
      } else {
        this.color = '#84b5eb'
      }
      
      if (this.show && this.projectType !== 'chart') {
        if (classList.contains('show')) {
          classList.remove('block-hover')
          classList.remove('block-locked-hover')
        } else {
          if (classList.contains('isLocked')) {
            classList.add('block-locked-hover')
          } else {
            classList.add('block-hover')
          }
        }
      }
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.show && !this.isSelected) {
      this._el.nativeElement.classList.remove('block-hover')
      this._el.nativeElement.classList.remove('block-locked-hover')
    }
  }

  hover(style: string) {
    this._el.nativeElement.style.border = style;
  }

}
