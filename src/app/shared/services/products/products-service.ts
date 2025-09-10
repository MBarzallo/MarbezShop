import { Injectable } from '@angular/core';
import { Supabase } from '../supabase/supabase';
import { Option, Product, ProductoDetallado } from '../../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private sb: Supabase) {}

  async getProductosByCategory(categoryId: string, search: string): Promise<Product[]> {
    search = search?.trim() ?? '';
    search = search.toLowerCase();
    search = search.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u");

    const { data, error } = await this.sb.supabase
      .from('productos')
      .select('*')
      .eq('categoria', categoryId)
      .ilike('nombre', `%${search}%`)
      .order('imagen');
    if (error) throw error;
    return data;
  }

  async getProducts(filter: { offset?: number; limit?: number , search?: string }): Promise<Product[]> {
    filter.search = filter.search?.trim() ?? '';
    filter.search = filter.search.toLowerCase();
    filter.search = filter.search.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u");    

    const { data, error } = await this.sb.supabase
      .from('productos')
      .select('*')
      .ilike('nombre', `%${filter.search}%`)
      .order('imagen')
      .range(filter.offset ?? 0, (filter.offset ?? 0) + (filter.limit ?? 8) - 1);
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
