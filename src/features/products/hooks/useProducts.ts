"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createProduct, deleteProduct, getProducts, updateProduct} from "../services/productApi";
import { toast } from "sonner";


// Get the products Query
export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });
}

// Create a product Query (onSuccess? is for unnecessary outer function, such as closing a dialog)
export function useCreateProduct(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product created successfully");
            onSuccess?.();
        },
        onError: () => {
            toast.error("Could not create product");
        },
    });
}

// Update a product Query (onSuccess? is for unnecessary outer function, such as closing a dialog)
export function useUpdateProduct(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product updated successfully");
            onSuccess?.();
        },
        onError: () => {
            toast.error("Could not update product");
        },
    });
}

// Delete a Product Query
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product deleted successfully");
        },
        onError: () => {
            toast.error("Could not delete product");
        },
    });
}