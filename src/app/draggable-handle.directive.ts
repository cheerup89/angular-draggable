import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[sortableDraggableHandle]',
  host: {
    'class': 'drag-handle'
  }
})
export class SortableDraggableHandleDirective {

}