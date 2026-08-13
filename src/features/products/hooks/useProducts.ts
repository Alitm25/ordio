"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createProduct, deleteProduct, getProducts, updateProduct} from "../services/productApi";
import { toast } from "sonner";
import {useTranslations} from "next-intl";

const tToast = useTranslations('toast.product');

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
            toast.success( tToast('createSuccess') );
            onSuccess?.();
        },
        onError: () => {
            toast.error( tToast('createError') );
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
            toast.success( tToast('updateSuccess') );
            onSuccess?.();
        },
        onError: () => {
            toast.error( tToast('updateError') );
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
            toast.success( tToast('deleteSuccess') );
        },
        onError: () => {
            toast.error( tToast('deleteError') );
        },
    });
}