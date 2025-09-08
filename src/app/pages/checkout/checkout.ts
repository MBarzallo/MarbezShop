import { Component } from '@angular/core';
import { CartService } from '../../shared/services/cart/car-service';
import { Router } from '@angular/router';
import { OrdersService } from '../../shared/services/orders/orders-service';
import { CommonModule } from '@angular/common';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // 👈

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
loading = false; msg = '';
  // costo de envío: cámbialo según tu lógica
  shippingCost = 0;

  form: FormGroup;

  constructor(
    public cart: CartService,
    private orders: OrdersService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
    nombre: ['', Validators.required],
  telefono: [''],
  email: ['', [Validators.required, Validators.email]],
  direccion1: ['', Validators.required],
  direccion2: [''],
  ciudad: ['', Validators.required],
  provincia: ['', Validators.required],
  codigo_postal: [''],
  referencia: [''],
  notas: [''],
  });
  }

  async pay() {
    if (this.form.invalid) {
      this.msg = 'Completa los campos requeridos.';
      return;
    }
    this.loading = true; this.msg = '';
    try {
      const v = this.form.value;
      const orderId = await this.orders.placeOrder({
        envio: this.shippingCost,
        notas: v.notas ?? undefined,
        shipping: {
          nombre: v.nombre!, telefono: v.telefono ?? '',
          direccion1: v.direccion1!, direccion2: v.direccion2 ?? '',
          ciudad: v.ciudad!, provincia: v.provincia!,
          codigo_postal: v.codigo_postal ?? '', referencia: v.referencia ?? '',
          email: v.email!,
        },

      });
      await this.showOrderSuccess(orderId);
      
    } catch (e: any) {
      this.showOrderError(e?.message || 'Ocurrió un error creando la orden.');
    } finally { this.loading = false; }
  }

  private async showOrderSuccess(orderId: number) {
    await Swal.fire({
      icon: 'success',
      title: '¡Pedido realizado!',
      html: `
        <p class="text-gray-600 mt-2">
          Tu orden <b>#${orderId}</b> se creó correctamente.<br/>
          Nos pondremos en contacto contigo por email para coordinar el envío.
        </p>
      `,
      confirmButtonText: 'Ver mis pedidos',
      customClass: {
        popup: 'rounded-2xl shadow-xl',
        title: 'text-2xl font-extrabold text-principal',
        htmlContainer: 'text-sm',
        confirmButton: 'bg-secundario text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 focus:ring-2 focus:ring-secundario/40',
      },
      buttonsStyling: false,
      backdrop: true,
    });

    // Redirige después de cerrar
    this.router.navigate(['/']); // cambia a la ruta que uses
  }

  private showOrderError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'No pudimos completar tu pedido',
      html: `<p class="text-gray-600 mt-2">${message}</p>`,
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'rounded-2xl shadow-xl',
        title: 'text-xl font-extrabold',
        htmlContainer: 'text-sm',
        confirmButton: 'bg-gray-800 text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90',
      },
      buttonsStyling: false,
    });
  }
}
