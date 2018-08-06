import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";

@Directive({
  selector: "[appDndUploader]"
})
export class DndUploaderDirective {
  counter = 0;

  @Output() private filesChangeEmiter = new EventEmitter();
  @Output() draggedOver = new EventEmitter();
  @Input("appDndUploader") options;
  @HostBinding("style.background") private background = "#fff";
  @HostBinding("style.border-color") private borderColor = "#000";

  constructor() {
  }

  @HostListener("dragover", [ "$event" ])
  public onDragOver(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener("dragenter", [ "$event" ])
  public onDragEnter(): void {
    this.counter++;
    this.draggedOver.emit(true);
  }

  @HostListener("dragleave", [ "$event" ])
  public onDragLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.counter--;

    if (this.counter === 0) {
      this.draggedOver.emit(false);
    }
  }

  @HostListener("drop", [ "$event" ])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.options.type === "multiple" ? this.filesChangeEmiter.emit(files) :
        this.options.type === "single" ? this.filesChangeEmiter.emit(files[ 0 ]) :
          this.filesChangeEmiter.emit();
    }
  }

}
