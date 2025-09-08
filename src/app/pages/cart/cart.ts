import { Component } from '@angular/core';
import { CartService } from '../../shared/services/cart/car-service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
    constructor(public cart: CartService) {}

  trackById = (_: number, it: any) => it.variantId;

  onQtyChange(ev: Event, variantId: string) {
  const el = ev.target as HTMLInputElement;
  const qty = Math.max(1, el.valueAsNumber || Number(el.value) || 1);
  this.cart.updateQty(variantId, qty);
}
}
