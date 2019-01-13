import { Component } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, startWith, scan } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from './category.model';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './table.scss']
})
export class AppComponent {
  categories: Array<Category> = [{
    name: 'Shoes',
    products: ['Adidas Ultra Boost', 'New Balance 585', 'Nike Jordan']
  },
  {
    name: 'Phones',
    products: ['Google Pixel 3', 'Samsung S9+', 'IPhone XS Max']
  },
  {
    name: 'Clothes',
    products: ['T-Shirt', 'Jogger']
  },
  {
    name: '!@#$%^&&$%$',
    products: []
  }];


  root: Array<any> = [
    {
      name: 'Root 1',
      nodes: [
        {
          name: 'Node 1 of Root 1',
          leaves: [
            { name: 'Leaf 1 - 1' },
            { name: 'Leaf 1 - 2' },
            { name: 'Leaf 1 - 3' }
          ]
        },
        {
          name: 'Node 2 of Root 1',
          leaves: [
            { name: 'Leaf 1 - 1' },
            { name: 'Leaf 1 - 2' },
            { name: 'Leaf 1 - 3' }
          ]
        }
      ]
    },
    {
      name: 'Phones',
      products: ['Google Pixel 3', 'Samsung S9+', 'IPhone XS Max']
    },
    {
      name: 'Clothes',
      products: ['T-Shirt', 'Jogger']
    },
    {
      name: '!@#$%^&&$%$',
      products: []
    }
  ];


  ngOnInit() {

  }

  onCategoryDropped(event: CdkDragDrop<string[]>, categoryIndex: number) {
    event.previousContainer.data.splice(event.previousIndex, 1);

    this.categories.splice(categoryIndex + 1, 0, {
      name: event.item.data,
      products: []
    });
  }

  onProductDropped(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  onProductEntered(event) {
    console.log('Product Entered');
  }

  onProductExited(event) {
    console.log('Product Exited');
  }

  onProductSorted(event) {
    console.log('Product Sorted');
  }

  onProductStarted(event) {
    console.log('Product Started');
  }

  onSorted(event) {
    console.log(event);
  }

  onCatDrop(event) {
    event.oldContainer.data.splice(event.oldIndex, 1);

    this.categories.splice(event.newIndex, 0, {
      name: event.item.data,
      products: []
    });
  }

  onProdDrop(event) {
    if (event.oldContainer === event.newContainer) {
      event.newContainer.moveItemInArray(event.newContainer.data, event.oldIndex, event.newIndex);
    } else {
      event.newContainer.transferArrayItem(event.oldContainer.data, event.newContainer.data, event.oldIndex, event.newIndex);
    }
  }
}
