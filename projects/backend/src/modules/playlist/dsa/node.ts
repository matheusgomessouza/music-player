export interface SongData {
  title: string;
  artist: string;
  filename: string;
  duration?: string;
}

export class Node {
  private _data: SongData;
  private _next: Node | null;
  private _prev: Node | null;

  constructor(data: SongData) {
    this._data = data;
    this._next = null;
    this._prev = null;
  }

  get data(): SongData {
    return this._data;
  }

  set data(data: SongData) {
    this._data = data;
  }

  get title(): string {
    return this._data.title;
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
