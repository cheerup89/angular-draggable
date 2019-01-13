import { Directive, ElementRef, Input, Output, EventEmitter, Optional, SkipSelf, Host } from '@angular/core';
import { SortableDropzoneDirective } from './dropzone.directive';

@Directive({
  selector: '[sortableDraggable]',
  exportAs: 'draggable',
  host: {
    'class': 'draggable',
    // '[class.draggable--dragging]': '_dragRef.isDragging()',
  }
})
export class SortableDraggableDirective {
  @Input('dragData') data: any;

  private _dragging = false;

  constructor(private elementRef: ElementRef) { }

  isProperElement(ele): boolean {
    return this.elementRef.nativeElement === ele;
  }

  drag() {
    this._dragging = true;
  }

  drop() {
    this._dragging = false;
  }

  isDragging() {
    return this._dragging;
  }
}