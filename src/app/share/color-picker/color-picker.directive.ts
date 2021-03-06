import {
  Directive,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ApplicationRef,
  ComponentRef,
  ElementRef,
  ViewContainerRef,
  Injector,
  ReflectiveInjector,
  ComponentFactoryResolver,
} from '@angular/core'

import { ColorPickerService } from './color-picker.service'
import { ColorPickerComponent } from './color-picker.component'

@Directive({
  selector: '[colorPicker]',
  exportAs: 'ngxColorPicker',
})
export class ColorPickerDirective implements OnChanges, OnDestroy {
  private dialog: any

  private dialogCreated: boolean = false
  private ignoreChanges: boolean = false

  private cmpRef: ComponentRef<ColorPickerComponent>

  @Input() disabled: boolean

  @Input() colorPicker: string

  @Input() cpWidth: string = '178px'
  @Input() cpHeight: string = 'auto'

  @Input() cpToggle: boolean = false

  @Input() cpIgnoredElements: any = []

  @Input() cpDisableInput: boolean = false

  @Input() cpAlphaChannel: string = 'enabled'
  @Input() cpOutputFormat: string = 'hex'

  @Input() cpFallbackColor: string = '#fff'

  @Input() cpDialogDisplay: string = 'popup'

  @Input() cpSaveClickOutside: boolean = true

  @Input() cpUseRootViewContainer: boolean = false

  @Input() cpPosition: string = 'right'
  @Input() cpPositionOffset: string = '0%'
  @Input() cpPositionRelativeToArrow: boolean = false

  @Input() cpOKButton: boolean = false
  @Input() cpOKButtonText: string = 'OK'
  @Input() cpOKButtonClass: string = 'cp-ok-button-class'

  @Input() cpCancelButton: boolean = false
  @Input() cpCancelButtonText: string = 'Cancel'
  @Input() cpCancelButtonClass: string = 'cp-cancel-button-class'

  @Input() cpPresetLabel: string = 'Preset colors'
  @Input() cpPresetColors: string[]
  @Input() cpMaxPresetColorsLength: number = 6

  @Input() cpPresetEmptyMessage: string = 'No colors added'
  @Input() cpPresetEmptyMessageClass: string = 'preset-empty-message'

  @Input() cpAddColorButton: boolean = false
  @Input() cpAddColorButtonText: string = 'Add color'
  @Input() cpAddColorButtonClass: string = 'cp-add-color-button-class'

  @Input() cpRemoveColorButtonClass: string = 'cp-remove-color-button-class'

  @Output() cpInputChange = new EventEmitter<any>(true)

  @Output() cpToggleChange = new EventEmitter<boolean>(true)

  @Output() cpSliderChange = new EventEmitter<any>(true)
  @Output() cpSliderDragEnd = new EventEmitter<string>(true)
  @Output() cpSliderDragStart = new EventEmitter<string>(true)

  @Output() colorPickerOpen = new EventEmitter<string>(true)
  @Output() colorPickerClose = new EventEmitter<string>(true)

  @Output() colorPickerCancel = new EventEmitter<string>(true)
  @Output() colorPickerSelect = new EventEmitter<string>(true)
  @Output() colorPickerChange = new EventEmitter<string>(false)

  @Output() cpPresetColorsChange = new EventEmitter<any>(true)
  @Output() cpTthemeLiskClickHandle = new EventEmitter<any>(true)

  @HostListener('click', ['$event']) handleClick(event: any): void {
    this.inputFocus()
  }

  @HostListener('focus', ['$event']) handleFocus(event: any): void {
    this.inputFocus()
  }

  @HostListener('input', ['$event']) handleInput(event: any): void {
    this.inputChange(event.target.value)
  }

  constructor(
    private injector: Injector,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private vcRef: ViewContainerRef,
    private elRef: ElementRef,
    private _service: ColorPickerService
  ) {}

  ngOnDestroy(): void {
    if (this.cmpRef !== undefined) {
      this.cmpRef.destroy()
    }
  }

  ngOnChanges(changes: any): void {
    if (changes.cpToggle) {
      if (!this.disabled && changes.cpToggle.currentValue) {
        this.openDialog()
      } else if (this.dialog && !changes.cpToggle.currentValue) {
        this.dialog.closeDialog()
      }
    }

    if (changes.colorPicker) {
      if (this.dialog && !this.ignoreChanges) {
        if (this.cpDialogDisplay === 'inline') {
          this.dialog.setInitialColor(changes.colorPicker.currentValue)
        }

        this.dialog.setColorFromString(changes.colorPicker.currentValue, false)
      }

      this.ignoreChanges = false
    }

    if (changes.cpPresetLabel || changes.cpPresetColors) {
      if (this.dialog) {
        this.dialog.setPresetConfig(this.cpPresetLabel, this.cpPresetColors)
      }
    }
  }

  public openDialog(): void {
    if (!this.dialogCreated) {
      let vcRef = this.vcRef

      this.dialogCreated = true

      if (this.cpUseRootViewContainer && this.cpDialogDisplay !== 'inline') {
        const classOfRootComponent = this.appRef.componentTypes[0]
        const appInstance = this.injector.get(classOfRootComponent)

        vcRef = appInstance.vcRef || appInstance.viewContainerRef || this.vcRef

        if (vcRef === this.vcRef) {
          console.warn(
            'You are using cpUseRootViewContainer, ' +
              'but the root component is not exposing viewContainerRef!' +
              "Please expose it by adding 'public vcRef: ViewContainerRef' to the constructor."
          )
        }
      }

      const compFactory = this.cfr.resolveComponentFactory(ColorPickerComponent)
      const injector = ReflectiveInjector.fromResolvedProviders([], vcRef.parentInjector)

      this.cmpRef = vcRef.createComponent(compFactory, 0, injector, [])

      this.cmpRef.instance.setupDialog(
        this,
        this.elRef,
        this.colorPicker,
        this.cpWidth,
        this.cpHeight,
        this.cpDialogDisplay,
        this.cpFallbackColor,
        this.cpAlphaChannel,
        this.cpOutputFormat,
        this.cpDisableInput,
        this.cpIgnoredElements,
        this.cpSaveClickOutside,
        this.cpUseRootViewContainer,
        this.cpPosition,
        this.cpPositionOffset,
        this.cpPositionRelativeToArrow,
        this.cpPresetLabel,
        this.cpPresetColors,
        this.cpMaxPresetColorsLength,
        this.cpPresetEmptyMessage,
        this.cpPresetEmptyMessageClass,
        this.cpOKButton,
        this.cpOKButtonClass,
        this.cpOKButtonText,
        this.cpCancelButton,
        this.cpCancelButtonClass,
        this.cpCancelButtonText,
        this.cpAddColorButton,
        this.cpAddColorButtonClass,
        this.cpAddColorButtonText,
        this.cpRemoveColorButtonClass
      )
      this.dialog = this.cmpRef.instance

      if (this.vcRef !== vcRef) {
        this.cmpRef.changeDetectorRef.detectChanges()
      }
    } else if (this.dialog) {
      this.dialog.openDialog(this.colorPicker)
    }
  }

  public closeDialog(): void {
    if (this.dialog) {
      this.dialog.closeDialog()
    }
  }

  public toggle(value: boolean): void {
    this.cpToggleChange.emit(value)

    if (value) {
      this.colorPickerOpen.emit(this.colorPicker)
    } else {
      this.colorPickerClose.emit(this.colorPicker)
    }
  }

  public colorChanged(value: string, ignore: boolean = true): void {
    this.ignoreChanges = ignore

    this.colorPickerChange.emit(value)
  }

  public colorCanceled(): void {
    this.colorPickerCancel.emit()
  }

  public colorSelected(value: string): void {
    this.colorPickerSelect.emit(value)
  }

  public inputFocus(): void {
    const element = this.elRef.nativeElement

    const ignored = this.cpIgnoredElements.filter((item: any) => item === element)

    if (!this.disabled && !ignored.length) {
      this.openDialog()
    }
  }

  public inputChange(value: string): void {
    if (this.dialog) {
      this.dialog.setColorFromString(value, true)
    } else {
      this.colorPicker = value

      this.colorPickerChange.emit(this.colorPicker)
    }
  }

  public inputChanged(event: any): void {
    this.cpInputChange.emit(event)
  }

  public sliderChanged(event: any): void {
    this.cpSliderChange.emit(event)
  }

  public sliderDragEnd(event: any): void {
    this.cpSliderDragEnd.emit(event)
  }

  public sliderDragStart(event: any): void {
    this.cpSliderDragStart.emit(event)
  }

  public presetColorsChanged(value: any[]): void {
    this.cpPresetColorsChange.emit(value)
  }

  public themeLiskClickHandle(value: any[]): void {
    this.cpTthemeLiskClickHandle.emit(value)
  }
}
