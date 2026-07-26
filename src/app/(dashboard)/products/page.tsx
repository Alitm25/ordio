"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/services/productApi";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen } from "lucide-react";
import CreateProductDialog from "@/components/products/CreateProductDialog";
import EditProductDialog from "@/components/products/EditProductDialog";
import { useDeleteProduct } from "@/features/products/hooks/useProducts";

export default function ProductsPage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    const deleteProduct = useDeleteProduct();

    const products: Product[] = data?.products ?? [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Products</h1>
                <Button className="cursor-pointer" onClick={() => setCreateOpen(true)}>
                    + New Product
                </Button>
            </div>

            {isLoading ? (
                <div className="rounded-xl border bg-card divide-y">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-4">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-48" />
                            <div className="ml-auto flex gap-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                    <div className="rounded-full bg-muted p-3">
                        <PackageOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">No products yet</p>
                        <p className="text-sm text-muted-foreground">
                            Add your first product to the catalog.
                        </p>
                    </div>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setCreateOpen(true)}
                    >
                        + New Product
                    </Button>
                </div>
            ) : (
                <div className="rounded-xl border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="hidden md:table-cell">Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell>
                                        {product.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground hidden md:table-cell">
                                        {product.description || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    setEditingProduct(product)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    setProductToDelete(product)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <CreateProductDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            />

            <EditProductDialog
                product={editingProduct}
                onOpenChange={(open) => {
                    if (!open) setEditingProduct(null);
                }}
            />

            {/* Delete Dialog */}
            <AlertDialog
                open={!!productToDelete}
                onOpenChange={(open) => {
                    if (!open) setProductToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{" "}
                            <strong>{productToDelete?.name}</strong> from your
                            catalog. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
                            disabled={deleteProduct.isPending}
                            onClick={() => {
                                if (productToDelete) {
                                    deleteProduct.mutate(String(productToDelete._id));
                                    setProductToDelete(null);
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}