export interface ProductoAttributes {
  id?: number;
  nombre: string;
  cant_almacenada: number;
  fecha_compra: Date;
  fecha_vec?: Date;
  categoria_id: number;
  created_at?: Date;
  updated_at?: Date;
}
