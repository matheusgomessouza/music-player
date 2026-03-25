import { Node, SongData } from './node';

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
  public insertAtEnd(data: SongData): void {
    const newNode = new Node(data);

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
  public insertAtPosition(data: SongData, position: number): boolean {
    if (position < 1 || position > this.size + 1) {
      return false; // Invalid position
    }

    if (position === this.size + 1) {
      this.insertAtEnd(data);
      return true;
    }

    const newNode = new Node(data);

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

    return false;
  }

  // 4. Remove a song by its numeric position (1-based index)
  public removeByPosition(position: number): SongData | null {
    if (position < 1 || position > this.size) {
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
      return current.data;
    }

    return null;
  }

  // 5. Move a song to another position
  public move(fromPosition: number, toPosition: number): boolean {
    if (fromPosition < 1 || fromPosition > this.size || toPosition < 1 || toPosition > this.size) {
      return false;
    }

    if (fromPosition === toPosition) {
      return true; // No movement needed
    }

    // First remove the node from the current position
    const data = this.removeByPosition(fromPosition);

    if (data) {
      // Re-insert at the new position
      return this.insertAtPosition(data, toPosition);
    }

    return false;
  }

  // 6. Convert playlist to Array (for API responses)
  public toArray(): {
    position: number;
    title: string;
    artist: string;
    filename: string;
    duration: string;
  }[] {
    const result = [];
    let current = this.head;
    let index = 1;

    while (current !== null) {
      result.push({
        position: index,
        title: current.data.title,
        artist: current.data.artist,
        filename: current.data.filename,
        duration: current.data.duration || '0:00',
      });
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
