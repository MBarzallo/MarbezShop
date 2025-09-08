import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CartItem = {
  productId: string;        // productos.id
  variantId: string;        // variantes.id  (requerido por tu FK)
  title: string;
  image?: string | null;
  price: number;            // precio_unitario al momento de añadir
  qty: number;
  attributes?: Record<string, string>; // { talla:'M', color:'Negro', ... }
};

const LS_KEY = 'cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<CartItem[]>(this.load());
  readonly items$ = this._items$.asObservable();

  private load(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch { return []; }
  }
  private persist(items: CartItem[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
    this._items$.next(items);
  }

  get items(): CartItem[] { return this._items$.value; }
  get count(): number { return this.items.reduce((a, i) => a + i.qty, 0); }
  get subtotal(): number { return this.items.reduce((a, i) => a + i.price * i.qty, 0); }

  add(item: CartItem) {
    const items = [...this.items];
    const idx = items.findIndex(i => i.variantId === item.variantId);
    if (idx >= 0) items[idx].qty += item.qty;
    else items.push(item);
    this.persist(items);
  }

  updateQty(variantId: string, qty: number) {
    const items = this.items.map(i => i.variantId === variantId ? { ...i, qty } : i)
                            .filter(i => i.qty > 0);
    this.persist(items);
  }

  remove(variantId: string) {
    this.persist(this.items.filter(i => i.variantId !== variantId));
  }

  clear() { this.persist([]); }
}
