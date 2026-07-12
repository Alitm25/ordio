"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { productSchema, ProductFormValues } from "@/features/products/schemas/productSchema";
import { useUpdateProduct } from "@/features/products/hooks/useProducts";
import { Product } from "@/types/product";

interface Props {
    product: Product | null;
    onOpenChange: (open: boolean) => void;
}

export default function EditProductDialog({ product, onOpenChange }: Props) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            description: "",
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                price: product.price,
                description: product.description,
            });
        }
    }, [product, form]);

    const updateProduct = useUpdateProduct(() => onOpenChange(false));

    const onSubmit = (data: ProductFormValues) => {
        if (!product) return;
        updateProduct.mutate({ id: String(product._id), data });
    };

    return (
        <Dialog open={!!product} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Update this product's details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Input
                            {...form.register("name")}
                            placeholder="Product name"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input
                            type="number"
                            {...form.register("price", { valueAsNumber: true })}
                            placeholder="Price"
                        />
                        {form.formState.errors.price && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.price.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input
                            {...form.register("description")}
                            placeholder="Description (optional)"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={updateProduct.isPending}
                        >
                            {updateProduct.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}