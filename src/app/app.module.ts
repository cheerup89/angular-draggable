import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { TreeComponent } from './tree.component';
import { SortableDirective } from './sortable.directive';
import { SortableDropzoneDirective } from './dropzone.directive';
import { SortableDraggableDirective } from './draggable.directive';
import { SortableDraggableHandleDirective } from './draggable-handle.directive';

@NgModule({
  imports: [BrowserModule, FormsModule, DragDropModule],
  declarations: [AppComponent, TreeComponent, SortableDirective, SortableDropzoneDirective, SortableDraggableDirective, SortableDraggableHandleDirective],
  bootstrap: [AppComponent]
})
export class AppModule { }
