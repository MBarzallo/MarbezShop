export interface Product  {
    id:string;
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagen: string;
    categoria: string;
}
export type VarianteRow = {
  id: string;             // varchar(10)
  sku: string;
  precio: number | null;
  stock: number | null;
};

export type ValorAtributoRow = {
  id: number;
  valor: string;          // p.ej. "S", "M", "Negro"
  atributos?: { id: number; nombre: string } | null; // FK
};

export type VarianteAtributoRow = {
  valores_atributo?: ValorAtributoRow | null;
};

export type ProductoDetallado = Product & {
  variantes: (VarianteRow & {
    variante_atributo: VarianteAtributoRow[];
  })[];
};

export type Option = { name: string; values: string[] };