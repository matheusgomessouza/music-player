export class Node {
  private _title: string;
  private _next: Node | null;
  private _prev: Node | null;

  constructor(title: string) {
    this._title = title;
    this._next = null;
    this._prev = null;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
  }

  get next(): Node | null {
    return this._next;
  }

  set next(node: Node | null) {
    this._next = node;
  }

  get prev(): Node | null {
    return this._prev;
  }

  set prev(node: Node | null) {
    this._prev = node;
  }
}
