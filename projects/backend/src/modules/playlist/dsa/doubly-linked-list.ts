import { Node } from './node';

export class DoublyLinkedList {
  private head: Node | null;
  private tail: Node | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // 1. Insert a song at the end of the playlist
  public insertAtEnd(title: string): void {
    const newNode = new Node(title);

    if (this.size === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) {
        this.tail.next = newNode;
      }
      this.tail = newNode;
    }
    this.size++;
  }

  // 2. Insert a song at a specific position (1-based index)
  public insertAtPosition(title: string, position: number): boolean {
    if (position < 1 || position > this.size + 1) {
      console.log(`[Error] Invalid position: ${position}. Operation not performed.`);
      return false; // Invalid position
    }

    if (position === this.size + 1) {
      this.insertAtEnd(title);
      return true;
    }

    const newNode = new Node(title);

    if (position === 1) {
      newNode.next = this.head;
      if (this.head) {
        this.head.prev = newNode;
      }
      this.head = newNode;
      if (this.size === 0) {
        this.tail = newNode;
      }
    } else {
      let current = this.head;
      let currentIndex = 1;

      while (current !== null && currentIndex < position) {
        current = current.next;
        currentIndex++;
      }

      if (current) {
        newNode.prev = current.prev;
        newNode.next = current;
        if (current.prev) {
          current.prev.next = newNode;
        }
        current.prev = newNode;
      }
    }

    this.size++;
    return true;
  }

  // 3. Remove a song by its title
  public removeByTitle(title: string): boolean {
    let current = this.head;

    while (current !== null) {
      if (current.title === title) {
        this.unlinkNode(current);
        return true;
      }
      current = current.next;
    }

    console.log(`[Error] Song "${title}" not found.`);
    return false;
  }

  // 4. Remove a song by its numeric position (1-based index)
  public removeByPosition(position: number): string | null {
    if (position < 1 || position > this.size) {
      console.log(`[Error] Invalid position: ${position}. Operation not performed.`);
      return null;
    }

    let current = this.head;
    let currentIndex = 1;

    while (current !== null && currentIndex < position) {
      current = current.next;
      currentIndex++;
    }

    if (current) {
      this.unlinkNode(current);
      return current.title;
    }

    return null;
  }

  // 5. Move a song to another position
  public move(fromPosition: number, toPosition: number): boolean {
    if (fromPosition < 1 || fromPosition > this.size || toPosition < 1 || toPosition > this.size) {
      console.log(`[Error] Invalid positions for move operation.`);
      return false;
    }

    if (fromPosition === toPosition) {
      return true; // No movement needed
    }

    // First remove the node from the current position
    const title = this.removeByPosition(fromPosition);

    if (title) {
      // Re-insert at the new position
      return this.insertAtPosition(title, toPosition);
    }

    return false;
  }

  // 6. Print the numbered playlist
  public print(): void {
    console.log('--- Current Playlist ---');
    let current = this.head;
    let index = 1;

    if (this.size === 0) {
      console.log('Empty playlist.');
      return;
    }

    while (current !== null) {
      console.log(`${index}. ${current.title}`);
      current = current.next;
      index++;
    }
    console.log('------------------------\n');
  }

  // 7. Convert playlist to Array (for API responses)
  public toArray(): { position: number; title: string }[] {
    const result = [];
    let current = this.head;
    let index = 1;

    while (current !== null) {
      result.push({ position: index, title: current.title });
      current = current.next;
      index++;
    }

    return result;
  }

  // Helper method to unlink a node safely
  private unlinkNode(node: Node): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next; // Node was head
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev; // Node was tail
    }

    this.size--;
  }
}
