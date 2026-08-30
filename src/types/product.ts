export interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    stock: number | null;
    createdAt: string;
}