export interface Product {
  id: number;
  nombre: string;
  precio: string | number;
  descripcion: string;
  imageUrl?: string;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}