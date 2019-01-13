import { Component } from '@angular/core';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {
  root: Array<TRoot>;

  constructor() {
    this.root = new Array<TRoot>();
    this.root.push(
      this.generateTRoot(1,
        [
          this.generateTNode(1, ['Leaf 1', 'Leaf 2', 'Leaf 3']),
          this.generateTNode(2, ['Leaf 4'])
        ]
      ),
      this.generateTRoot(2,
        [
          this.generateTNode(1, []),
          this.generateTNode(2, [])
        ]
      ),
      this.generateTRoot(3,
        [
          this.generateTNode(1, ['Leaf 1']),
          this.generateTNode(2, ['Leaf 2', 'Leaf 3'])
        ]
      )
    );
  }

  private generateTRoot(times: number, nodes: Array<TNode>) {
    let r = new TRoot();
    r.name = 'Root ' + times;
    r.nodes = nodes;
    return r;
  }

  private generateTNode(times: number, leaves: Array<string>) {
    let n = new TNode();
    n.name = 'Node ' + times;
    n.leaves = leaves;
    return n;
  }

  onRootDropped(event) {
    event.oldContainer.data.splice(event.oldIndex, 1);

    if (event.item.data instanceof TRoot) {
      let rootNode = event.item.data as TRoot;
      this.root.splice(event.newIndex, 0, rootNode);

    } else if (event.item.data instanceof TNode) {
      let node = event.item.data as TNode;

      let newRoot = new TRoot();
      newRoot.name = node.name;
      newRoot.nodes = node.leaves.map(lf => { return { name: lf, leaves: [] } });

      this.root.splice(event.newIndex, 0, newRoot);

    } else if (typeof event.item.data === 'string') {
      let leaf = event.item.data as string;

      let newRoot = new TRoot();
      newRoot.name = leaf;

      this.root.splice(event.newIndex, 0, newRoot);
    }
  }

  onNodeDropped(event) {
    event.oldContainer.data.splice(event.oldIndex, 1);

    if (event.item.data instanceof TRoot) {
      let rootNode = event.item.data as TRoot;

      let newNode = new TNode();
      newNode.name = rootNode.name;

      event.newContainer.data.splice(event.newIndex, 0, newNode);

    } else if (event.item.data instanceof TNode) {
      let node = event.item.data as TNode;
      event.newContainer.data.splice(event.newIndex, 0, node);

    } else if (typeof event.item.data === 'string') {
      let leaf = event.item.data as string;

      let newNode = new TNode();
      newNode.name = leaf;

      event.newContainer.data.splice(event.newIndex, 0, newNode);
    }
  }

  onNodeSort(event) {
    if (event.dragItem.data instanceof TRoot) {
      let rootNode = event.dragItem.data as TRoot;
      if (rootNode.nodes.length > 0) {
        event.canSort = false;
      }
    }
  }

  onLeafDropped(event) {
    if (event.oldContainer === event.newContainer) {
      event.newContainer.data.splice(event.newIndex, 0, event.newContainer.data.splice(event.oldIndex, 1)[0]);
    } else {
      event.newContainer.data.splice(event.newIndex, 0, event.oldContainer.data.splice(event.oldIndex, 1)[0]);
    }
  }

  onLeafSort(event) {
    if (typeof event.dragItem.data !== 'string') {
      event.canSort = false;
    }
  }
}

class TRoot {
  name: string;
  nodes: Array<TNode> = new Array();
}

class TNode {
  name: string;
  leaves: Array<string> = new Array();
}