import {
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Option, ProductoDetallado } from '../../models/product';
import { ProductsService } from '../../shared/services/products/products-service';
import { CartService } from '../../shared/services/cart/car-service';

// Utilidad para key de query/estado: "Talla" → "talla", "Peso Neto" → "peso-neto"

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, NgIf, NgFor, NgClass],
  templateUrl: './product-page.html',
  styleUrls: ['./product-page.css'],
})
export class ProductPage implements OnInit {
  WA_NUMBER = '593999762586';
  showMore: boolean |null = null;

  product: ProductoDetallado | null = null;
  options: Option[] = []; // [{name:'Talla', values:[...]}, ...]
  selected: Record<string, string | undefined> = {}; // { 'talla': 'M', 'color': 'Negro', ... }

  // índices para resolver variantes y disponibilidad
  allVariantIds = new Set<string>();
  index: Record<string, Record<string, Set<string>>> = {}; // attrKey -> value -> Set(variantId)
  public keyize = keyize;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private products: ProductsService,
    private cart: CartService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    await this.loadProduct(id);

    // leer query params e inicializar selección (si vienen)
    const qp = this.route.snapshot.queryParamMap;
    for (const opt of this.options) {
      const k = keyize(opt.name);
      const v = qp.get(k) ?? undefined;
      if (v && opt.values.includes(v)) this.selected[k] = v;
    }
  }

  private async loadProduct(id: string) {
    const prod = await this.products.getProductoDetallado(id);
    this.product = prod;

    if(this.product.descripcion.length>200){
      this.showMore = false;
    }
    this.options = this.products.buildOptions(prod);

    // construir índice inverso attrKey/value → variantes
    this.buildVariantIndex();
  }

  viewMore() {
    this.showMore = !this.showMore;
  }

  private buildVariantIndex() {
    this.index = {};
    this.allVariantIds = new Set<string>();

    for (const v of this.product?.variantes ?? []) {
      this.allVariantIds.add(v.id);

      // recolectar pares (attrName → value) de la variante
      const attrs: Record<string, string> = {};
      for (const va of v.variante_atributo ?? []) {
        const name = va.valores_atributo?.atributos?.nombre;
        const value = va.valores_atributo?.valor;
        if (!name || !value) continue;
        attrs[keyize(name)] = value;
      }

      // llenar índice inverso
      for (const [attrKey, val] of Object.entries(attrs)) {
        this.index[attrKey] ??= {};
        this.index[attrKey][val] ??= new Set<string>();
        this.index[attrKey][val].add(v.id);
      }
    }
  }

  /** variantes compatibles con la selección actual */
  private candidates(): Set<string> {
    let current: Set<string> | null = null;

    for (const [k, val] of Object.entries(this.selected)) {
      if (!val) continue;
      const setForVal = this.index[k]?.[val];
      if (!setForVal) return new Set(); // selección imposible
      current = current ? intersect(current, setForVal) : new Set(setForVal);
      if (current.size === 0) return current;
    }

    return current ?? new Set(this.allVariantIds);
  }

  /** variante resuelta si la intersección queda en 1 */
  get resolvedVariant() {
    const c = this.candidates();
    if (c.size === 1) {
      const id = Array.from(c)[0];
      return (this.product?.variantes ?? []).find((v) => v.id === id);
    }
    return undefined;
  }

  /** deshabilita valores que no tienen variantes válidas con la selección actual */
  isDisabled(attrName: string, value: string): boolean {
    const k = keyize(attrName);

    // simulamos seleccionar este valor y intersectamos
    const tmp: Record<string, string> = {};
    for (const [kk, vv] of Object.entries(this.selected)) {
      if (vv) tmp[kk] = vv;
    }
    tmp[k] = value;

    // intersección
    let current: Set<string> | null = null;
    for (const [kk, vv] of Object.entries(tmp)) {
      if (!vv) continue;
      const setForVal = this.index[kk]?.[vv];
      if (!setForVal) return true;
      current = current ? intersect(current, setForVal) : new Set(setForVal);
      if (current.size === 0) return true;
    }
    return false;
  }

  select(attrName: string, value: string) {
    const k = keyize(attrName);
    this.selected[k] = value;

    // sync query param con la clave del atributo
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [k]: value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  // precio mostrado: precio de la variante si resuelta, si no el base
  get displayPrice(): number | undefined {
    const v = this.resolvedVariant;
    console.log("Resolviendo precio para variante:");
    console.log(v);
    if (v?.precio) return v.precio;
    console.log(this.product?.precio_base);
    return this.product?.precio_base;
  }

  

  colorSwatchStyle(val: string) {
    // si es un color reconocible pintamos; si es "2kg" no afectará
    const css = colorToHex(val);
    return { 'background-color': css, 'border-color': '#ccc' };
  }
  
addToCart(qty = 1) {
  const variant = this.resolvedVariant; // de tu lógica dinámica
  if (!variant) { alert('Selecciona las opciones del producto'); return; }

  this.cart.add({
    productId: this.product!.id,
    variantId: variant.id,
    title: this.product!.nombre,
    image: this.product!.imagen,
    price: (variant.precio ?? this.product!.precio_base)!,
    qty,
    attributes: this.selected as any // { talla:'M', color:'Negro', ... }
  });
}
}

// utilidades
function intersect<A>(a: Set<A>, b: Set<A>): Set<A> {
  const out = new Set<A>();
  for (const x of a) if (b.has(x)) out.add(x);
  return out;
}
function normalizeKey(s: string) {
  return (s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .replace(/\s+/g, '_');
}

// Mapeo de nombre → color sólido (hex o palabra CSS)
// Nota: valores como “USA”, “MULTICOLOR”, “CUADRADO”, “CON …” no son colores puros;
// les asigno un color representativo/neutral para poder pintar el swatch.
const COLOR_MAP: Record<string, string> = {
  DORADO: '#D4AF37',
  AMARILLO: '#FFFF00',
  NARANJA: '#FFA500',
  AZUL: '#0000FF',
  CAFE: '#6F4E37', // CAFÉ
  ROSADO: '#FFC0CB',
  ROJO: '#FF0000',
  MORADO: '#800080',
  BEIGE: '#F5F5DC',

  USA: '#3C3B6E', // azul bandera (aprox)
  MILITAR_CAMUFLADO: '#556B2F', // verde camo (aprox)
  CON_AZUL: '#0000FF',
  CUADRADO: '#BDBDBD', // neutral
  VERDE_CLARO: '#90EE90',
  MADERA: '#8B5A2B',
  MATCHA: '#A7C957',
  BLANCO: '#FFFFFF',
  PLATEADO: '#C0C0C0',
  VERDE: '#008000',
  PLOMO: '#7A7A7A',
  TURQUESA: '#40E0D0',
  CELESTE: '#87CEEB',
  NEGRO: '#000000',
  FUCSIA: '#FF00FF',
  MULTICOLOR: '#888888', // neutral (no sólido real)
  BRONCE: '#CD7F32',
  VERDE_OSCURO: '#006400',
  VERDE_MILITAR: '#4B5320',
  TRANSPARENTE: 'transparent',
  MILITAR: '#4B5320',
  ROSADO_CLARO: '#FFD1DC',
  CON_BLANCO: '#FFFFFF',
  CIELO: '#87CEEB',
  VERDE_OLIVO: '#808000',
  CON_NEGRO: '#000000',
  LILA: '#C8A2C8',
  VERDE_ELECTRICO: '#39FF14',
  CON_CREMA: '#FFFDD0',
  LACRE: '#A10000',
  AGUACATE: '#568203',
};

// Devuelve un color CSS válido para pintar el swatch.
// Si ya te llega un #hex o nombre CSS válido, lo respeta.
export function colorToHex(input: string): string {
  if (!input) return '#CCCCCC';
  const key = normalizeKey(input);
  return COLOR_MAP[key] ?? input; // fallback: usa el valor tal cual
}

const keyize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
