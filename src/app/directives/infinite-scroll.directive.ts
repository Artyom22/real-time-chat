import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({
  selector: "[appInfiniteScroll]"
})
export class InfiniteScrollDirective {
  @Output() scrollPosition = new EventEmitter();

  constructor() {
  }

  @HostListener("scroll", [ "$event" ])
  onScroll(event): void {
    const top = event.target.scrollTop;
    if (top === 0) {
      this.scrollPosition.emit("top");
    }
  }
}
