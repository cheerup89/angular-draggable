import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SortableDraggableHandleDirective } from './draggable-handle.directive';
import { SortableDraggableDirective } from './draggable.directive';
import { SortableDropzoneDirective } from './dropzone.directive';
import { SortableDirective } from './sortable.directive';


@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, SortableDirective, SortableDropzoneDirective, SortableDraggableDirective, SortableDraggableHandleDirective],
  bootstrap: [AppComponent]
})
export class AppModule { }
