import { Directive, ElementRef, Input, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { Sortable } from '@shopify/draggable';
import { SortableDropzoneDirective } from './dropzone.directive';

@Directive({ selector: 'sortable' })
export class SortableDirective {
  private nativeElement: any;
  private $sortable: any;

  @Input() handle: boolean;
  @Output() sorted = new EventEmitter<{ oldIndex, newIndex, oldContainer, newContainer }>();

  @ContentChildren(SortableDropzoneDirective, { descendants: true }) zones: QueryList<SortableDropzoneDirective>;


  constructor(private elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.$sortable != null) this.$sortable.destroy();

    this.$sortable = new Sortable(
      this.zones.map(z => z.elementRef.nativeElement),
      {
        draggable: '.draggable',
        handle: this.handle == null ? null : '.drag-handle',
        mirror: {
          appendTo: '.dropzone',
          constrainDimensions: true,
        }
      });

    this.$sortable.on('sortable:start', (dragEvent: { startIndex, startContainer }) => {
      let draggingZone = this.zones.find(z => z.isProperElement(dragEvent.startContainer));
      let relativeIndex = draggingZone.evaluateRelativeIndex(dragEvent.startIndex);
      draggingZone.getDraggableAt(relativeIndex).drag();
    });

    this.$sortable.on('sortable:sort', sortableEvent => {
      let properEventData: { sourceContainer, overContainer, originalSource } = sortableEvent.data.dragEvent.data;

      let sourceZone = this.zones.find(z => z.isProperElement(properEventData.sourceContainer));
      let sourceDraggable = sourceZone.getDraggableByElement(properEventData.originalSource);

      let droppingZone = this.zones.find(z => z.isProperElement(properEventData.overContainer));

      let allowSort = droppingZone.canSort(droppingZone, sourceDraggable);
      if (allowSort === false) {
        sortableEvent.canceled = true;
      }
    });

    this.$sortable.on('sortable:sorted', (sortableEvent: { oldIndex, newIndex, oldContainer, newContainer }) => {
      // console.log('sortable:sorted');
    });

    this.$sortable.on('sortable:stop', (sortableEvent: { oldIndex, newIndex, oldContainer, newContainer }) => {
      if (sortableEvent.oldContainer === sortableEvent.newContainer &&
        sortableEvent.oldIndex === sortableEvent.newIndex) {
        return;
      }

      if (sortableEvent.oldContainer === sortableEvent.newContainer) {
        let droppedZone = this.zones.find(z => z.isProperElement(sortableEvent.newContainer));

        let relativeOldIndex = droppedZone.evaluateRelativeIndex(sortableEvent.oldIndex);
        let relativeNewIndex = droppedZone.evaluateRelativeIndex(sortableEvent.newIndex);

        droppedZone.moveItem(relativeOldIndex, relativeNewIndex);

      } else {
        let oldZone = this.zones.find(z => z.isProperElement(sortableEvent.oldContainer));
        let newZone = this.zones.find(z => z.isProperElement(sortableEvent.newContainer));

        let relativeOldIndex = oldZone.evaluateRelativeIndex(sortableEvent.oldIndex);
        let relativeNewIndex = newZone.evaluateRelativeIndex(sortableEvent.newIndex);

        newZone.transferItem(oldZone, relativeOldIndex, newZone, relativeNewIndex);
      }


      let draggingZone = this.zones.find(z => z.isProperElement(sortableEvent.oldContainer));
      let relativeIndex = draggingZone.evaluateRelativeIndex(sortableEvent.oldIndex);
      draggingZone.getDraggableAt(relativeIndex).drop();

      this.sorted.emit(sortableEvent);
    });
  }
}