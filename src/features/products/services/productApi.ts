import { api } from "@/services/api";
import { Product } from "@/types/product";

export interface ProductPayload {
    name: string;
    price: number;
    description?: string;
}

// GET Products
export const getProducts = async (): Promise<{ products: Product[] }> => {
    const response = await api.get<{ products: Product[] }>("products");
    return response.data;
};

// POST Products
export const createProduct = async (data: ProductPayload): Promise<{ product: Product }> => {
    const response = await api.post<{ product: Product }>("products", data);
    return response.data;
};

// PATCH Products
export const updateProduct = async ( {id, data}: { id: string; data: Partial<ProductPayload> } ): Promise<{ product: Product }> => {
    const response = await api.patch<{ product: Product }>(
        `products/${id}`,
        data
    );
    return response.data;
};

// DELETE Products
export const deleteProduct = async (id: string): Promise<void> => {
    await api.delete(`products/${id}`);
};