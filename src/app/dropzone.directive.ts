import { Directive, ElementRef, Input, Output, EventEmitter, ContentChildren, QueryList, Optional, SkipSelf } from '@angular/core';
import { SortableDraggableDirective } from './draggable.directive';

@Directive({
  selector: '[sortableDropzone]',
  exportAs: 'dropzone',
  host: {
    'class': 'dropzone'
  }
})
export class SortableDropzoneDirective {
  @Input('dropzoneData') data: any;
  @Output() dropped = new EventEmitter<{ oldIndex: number, newIndex: number, oldContainer: any, newContainer: any, item: SortableDraggableDirective }>();
  @Output() sort = new EventEmitter<{ canSort: boolean, container, dragItem: SortableDraggableDirective }>();

  @ContentChildren(SortableDraggableDirective) set _siblings(siblings: QueryList<SortableDraggableDirective>) {
    this.siblings = siblings;
    this.updateDraggableTree();
  }

  @ContentChildren(SortableDraggableDirective, { descendants: true }) set _descendants(descendants: QueryList<SortableDraggableDirective>) {
    this.descendants = descendants;
    this.updateDraggableTree();
  }

  private siblings: QueryList<SortableDraggableDirective>;
  private descendants: QueryList<SortableDraggableDirective>;
  private draggableTree: Array<{ value, children, startIndex, endIndex }>;

  constructor(
    public elementRef: ElementRef,
    @Optional() @SkipSelf()
    public parentDropzone: SortableDropzoneDirective
  ) { }

  private updateDraggableTree() {
    if (this.siblings == null || this.descendants == null) return;

    this.draggableTree = [];

    this.siblings.forEach(dr => this.draggableTree.push({ value: dr, children: [], startIndex: 0, endIndex: 0 }));

    let currentSibling = null;
    this.descendants.forEach((dr, index) => {
      let sibling = this.draggableTree.find(d => d.value === dr);

      if (sibling != null) {
        sibling.startIndex = index;
        sibling.endIndex = index;

        if (currentSibling != null) {
          currentSibling.endIndex = index - 1;
        }

        currentSibling = sibling;
      }

      if (currentSibling != null && currentSibling.value != dr) {
        currentSibling.children.push(dr);
      }

      if (currentSibling != null && index === this.descendants.length - 1) {
        currentSibling.endIndex = index;
      }
    });
  }

  isProperElement(ele): boolean {
    return this.elementRef.nativeElement === ele;
  }

  evaluateRelativeIndex(absoluteIndex: number): number {
    let sibling = this.draggableTree.find(d => d.startIndex <= absoluteIndex && d.endIndex >= absoluteIndex);

    if (sibling == null) {
      return this.draggableTree.length;
    }

    if (absoluteIndex === sibling.startIndex) {
      return this.draggableTree.indexOf(sibling);
    } else {
      return this.draggableTree.indexOf(sibling) + 1;
    }
  }

  getDraggableAt(index: number) {
    return this.siblings.find((item: any, itemIdx: number) => itemIdx === index);
  }

  getDraggableByElement(ele) {
    return this.siblings.find(item => item.isProperElement(ele));
  }

  canSort(overContainer: SortableDropzoneDirective, dragItem: SortableDraggableDirective) {
    let eventData = {
      canSort: true,
      dragItem: dragItem,
      container: overContainer
    };
    this.sort.emit(eventData);

    return eventData.canSort;
  }

  moveItem(oldIndex: number, newIndex: number) {
    this.dropped.emit({
      oldIndex: oldIndex,
      newIndex: newIndex,
      oldContainer: this,
      newContainer: this,
      item: this.getDraggableAt(oldIndex)
    });
  }

  transferItem(oldContainer: SortableDropzoneDirective, oldIndex: number, newContainer: SortableDropzoneDirective, newIndex: number) {
    this.dropped.emit({
      oldIndex: oldIndex,
      newIndex: newIndex,
      oldContainer: oldContainer,
      newContainer: newContainer,
      item: oldContainer.getDraggableAt(oldIndex)
    });
  }

  moveItemInArray(array: Array<any>, oldIndex: number, newIndex: number) {
    const from = this.clamp(oldIndex, array.length - 1);
    const to = this.clamp(newIndex, array.length - 1);

    if (from === to) return;

    let item = array[from];
    array.splice(from, 1);
    array.splice(to, 0, item);
  }

  transferArrayItem(fromArray: Array<any>, toArray: Array<any>, fromIndex: number, toIndex: number) {
    const from = this.clamp(fromIndex, fromArray.length - 1);
    const to = this.clamp(toIndex, toArray.length - 1);

    toArray.splice(to, 0, fromArray.splice(from, 1)[0]);
  }

  /** Clamps a number between zero and a maximum. */
  private clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }
}
