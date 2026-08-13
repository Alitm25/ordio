"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { productSchema, ProductFormValues } from "@/features/products/schemas/productSchema";
import { useCreateProduct } from "@/features/products/hooks/useProducts";
import {useTranslations} from "next-intl";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateProductDialog({ open, onOpenChange }: Props) {
    // Dialog form default values initiation
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            description: "",
        },
    });

    const tProductsCreate = useTranslations('products.create');
    const tCommon = useTranslations('common');

    // Create Product function declaration
    const createProduct = useCreateProduct(() => {
        form.reset();
        onOpenChange(false);
    });

    // Dialog Form OnSubmit function declaration
    const onSubmit = (data: ProductFormValues) => {
        createProduct.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ tProductsCreate('title') }</DialogTitle>
                    <DialogDescription>
                        { tProductsCreate('description') }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Input
                            {...form.register("name")}
                            placeholder={ tProductsCreate('name') }
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
                            placeholder={ tProductsCreate('price') }
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
                            placeholder={ tProductsCreate('descriptionField') }
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onOpenChange(false)}
                        >
                            { tCommon('cancel') }
                        </Button>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={createProduct.isPending}
                        >
                            {createProduct.isPending ? tProductsCreate('loading') : tProductsCreate('submit') }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}