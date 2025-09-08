import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';
import { AuthService } from '../auth/auth-service';
import { CartService } from '../cart/car-service';


@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(
    private sb: Supabase,
    private auth: AuthService,
    private cart: CartService
  ) {}

  /** Crea la orden y sus detalles. Devuelve el id de la orden. */
  async placeOrder(input: PlaceOrderInput): Promise<number> {
    const user = this.auth.user;
    if (!user) throw new Error('Debes iniciar sesión.');
    if (!this.cart.items.length) throw new Error('El carrito está vacío.');

    const subtotal = this.cart.subtotal;
    const envio = input.envio ?? 0;
    const moneda = input.moneda ?? 'USD';

    // 1) Crear orden con snapshot de envío
      const { data: order, error: e1 } = await this.sb.supabase
    .from('ordenes')
    .insert([{
      id_usuario: user.id,
      estado: 'pendiente',
      subtotal,
      envio,
      moneda,
      notas: input.notas ?? null,

      shipping_nombre:        input.shipping.nombre,
      shipping_email:         input.shipping.email,   // 👈 snapshot email
      shipping_telefono:      input.shipping.telefono,
      shipping_direccion1:    input.shipping.direccion1,
      shipping_direccion2:    input.shipping.direccion2 ?? null,
      shipping_ciudad:        input.shipping.ciudad,
      shipping_provincia:     input.shipping.provincia,
      shipping_codigo_postal: input.shipping.codigo_postal ?? null,
      shipping_referencia:    input.shipping.referencia ?? null,
    }])
    .select('id')
    .single();

    if (e1) throw e1;
    const orderId = order!.id as number;

    // 2) Detalles
    const detalles = this.cart.items.map(i => ({
      id_orden: orderId,
      cantidad: i.qty,
      precio_unitario: i.price,
      id_variante: i.variantId,
    }));
    const { error: e2 } = await this.sb.supabase.from('orden_detalle').insert(detalles);
    if (e2) throw e2;

    // 3) (Opcional) guardar/actualizar dirección favorita del usuario
    // await this.sb.supabase.from('direcciones').insert({
    //   id_usuario: user.id, ...input.shipping, es_principal: true
    // });

    // 4) Vaciar carrito
    this.cart.clear();

    return orderId;
  }
}


export type ShippingInfo = {
  nombre: string;
  telefono: string;
  direccion1: string;
  direccion2?: string;
  ciudad: string;
  provincia: string;
  codigo_postal?: string;
  referencia?: string;
  email?: string;  // opcional
};

export type PlaceOrderInput = {
  shipping: ShippingInfo;
  envio: number;      // costo envío (0 si no aplica)
  notas?: string;
  moneda?: string;    // default 'USD'
};