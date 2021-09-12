export class QElement {
  element: any;
  priority: number;
  constructor(element: any, priority: number) {
    this.element = element;
    this.priority = priority;
  }
}

// PriorityQueue class
export class PriorityQueue {
  items: QElement[];
  length: number;
  constructor(items: any[] = null) {
    if (items == null) {
      this.items = [];
      this.length = 0;
    } else {
      this.items = [];
      for (var i = 0; i < items.length; i++) {
        this.enqueue(items[i], items[i].priority);
      }
      this.length = items.length;
    }
  }

  enqueue(element: any, priority: number) {
    var returnValue;
    // creating object from queue element
    var qElement = new QElement(element, priority);
    var contain = false;
    this.length++;
    // iterating through the entire
    // item array to add element at the
    // correct location of the Queue
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        // Once the correct location is found it is
        // enqueued
        this.items.splice(i, 0, qElement);
        contain = true;
        returnValue = i;
        break;
      }
    }

    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
      this.items.push(qElement);
      returnValue = this.items.length - 1;
    }
    return returnValue;
  }

  remove(id: any) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].element.id == id) {
        this.items.splice(i, 1);
        this.length--;
      }
    }
  }

  getRaw(id: any) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].element.id == id) {
        return this.items[i];
      }
    }
    return null;
  }

  changeRaw(id: any, newItem: QElement) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].element.id == id) {
        this.items[i].element = newItem;
        return true;
      }
    }
    return false;
  }

  dequeue() {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow

    if (this.isEmpty()) return null;
    this.length--;
    return this.items.shift();
  }

  front() {
    // returns the highest priority element
    // in the Priority queue without removing it.
    if (this.isEmpty()) return null;
    return this.items[0];
  }
  rear() {
    // returns the lowest priorty
    // element of the queue
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    // return true if the queue is empty.
    return this.items.length == 0;
  }

  printPQueue() {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
      str += this.items[i].element + " ";
    return str;
  }
}
