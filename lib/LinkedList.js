class Node {
    constructor(payload) {
        this.payload = payload;
        this.next = null;
        this.prev = null;
    }
    hasNext() {
        return this.next != null? true: false;
    }
}

class LinkedList {

    constructor() {
        this.head = null;
        this.numNodes = 0;
    }
    add(node) {
        if(this.head == null) {
            this.head = node;
            this.numNodes = 1;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
            this.numNodes++;
        }
    }
    // TO-DO: insert(node, index)?   
    remove(node) {

        if(node == null) {
            return;
        } else if(node == this.head) {
            let hold = this.head;
            this.head = hold.next;
            if(this.head != null) {
                this.head.prev = null;
            }
        } else {
            let previous = node.prev;
            previous.next = node.next;
            if(node.next != null) {
                node.next.prev = previous;
            }
        }
        this.numNodes--;
    }
    peek() {
        return this.head;
    }
}