import {
  Directive,
  ElementRef,
  Renderer2,
  Inject,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective implements OnChanges {
  private handleClick: () => void
  @Input() bindFlag = false
  @Output() onClickOutSide = new EventEmitter<void>()
  constructor(private el: ElementRef, private rd: Renderer2, @Inject(DOCUMENT) private doc: Document) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bindFlag'] && !changes['bindFlag'].firstChange) {
      if (this.bindFlag) {
        this.handleClick = this.rd.listen(this.doc, 'click', (evt) => {
          console.log('doc click')
          const isContain = this.el.nativeElement.contains(evt.target)
          if (!isContain) {
            this.onClickOutSide.emit()
          }
        })
      } else {
        this.handleClick()
      }
    }
  }
}
