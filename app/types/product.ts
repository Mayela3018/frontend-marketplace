export interface Product {
  id: number;
  nombre: string;
  precio: string | number;
  descripcion: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}