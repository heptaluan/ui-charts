import { Directive, ElementRef, HostListener, Input } from '@angular/core'

@Directive({
  selector: '[blockHover]',
})
export class BlockHoverDirective {
  @Input('blockHover') show: boolean
  @Input() isSelected: boolean
  @Input() projectType: string
  @Input() isUseHover: boolean = true

  color: string

  constructor(private _el: ElementRef) {}

  hover(style: string) {
    this._el.nativeElement.style.border = style
  }
}
