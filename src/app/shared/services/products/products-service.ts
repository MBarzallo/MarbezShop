import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';
import { Option, Product, ProductoDetallado } from '../../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private sb: Supabase) {}

  async getProductosByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await this.sb.supabase
      .from('productos')
      .select('*')
      .eq('categoria', categoryId)
      .order('imagen');
    if (error) throw error;
    return data;
  }

  async getProductoById(productId: string): Promise<Product | null> {
    const { data, error } = await this.sb.supabase
      .from('productos')
      .select('*')
      .eq('id', productId)
      .single();
    if (error) throw error;
    return data;
  }
  async getProductoDetallado(id: string): Promise<ProductoDetallado> {
    const { data, error } = await this.sb.supabase
      .from('productos')
      .select(`
        id, nombre, descripcion, precio_base, categoria, imagen,
        variantes (
          id, sku, precio, stock,
          variante_atributo (
            valores_atributo (
              id, valor,
              atributos ( id, nombre )
            )
          )
        )
      `)
      .eq('id', id)
      .single<ProductoDetallado>();

    if (error) throw error;
    return data!;
  }

  /** De las variantes arma las opciones tipo [{ name:'Talla', values:['S','M','L'] }, ...] */
  buildOptions(prod: ProductoDetallado): Option[] {
    const map = new Map<string, Set<string>>();

    for (const v of prod.variantes ?? []) {
      for (const va of v.variante_atributo ?? []) {
        const att = va.valores_atributo?.atributos?.nombre;
        const val = va.valores_atributo?.valor;
        if (!att || !val) continue;
        if (!map.has(att)) map.set(att, new Set());
        map.get(att)!.add(val);
      }
    }

    return Array.from(map.entries()).map(([name, set]) => ({
      name,
      values: Array.from(set.values()),
    }));
  }
}
