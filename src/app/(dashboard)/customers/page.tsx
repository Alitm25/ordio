"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/features/customers/services/customerApi";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import CreateCustomerDialog from "@/components/customers/CreateCustomerDialog";
import EditCustomerDialog from "@/components/customers/EditCustomerDialog";
import { useDeleteCustomer } from "@/features/customers/hooks/useCustomer";
import {kMaxLength} from "node:buffer";

export default function CustomersPage()  {
    // Create Customer form open and close State
    const [createOpen, setCreateOpen] = useState(false)

    // Edit and Delete customer states
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    // Customers fetch API FN
    const { data, isLoading } = useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });

    // Delete customer API mutation Custom Hook
    const deleteCustomer = useDeleteCustomer();
    const customers: Customer[] = data?.customers ?? [];
    return (
        <div className={'space-y-6'}>
            {/* Header */}
            <div className="space-y-6">
                <div className={'flex items-center justify-between'}>
                    <h1 className={'text-3xl font-bold'}>Customers</h1>
                    <Button className={'cursor-pointer'} onClick={ () => setCreateOpen(true)}>
                        + New Customer
                    </Button>
                </div>
            </div>
            {/* Customer Rendering START */}
                {
                    // Skeleton Loading
                    isLoading ? (
                        <div className={'rounded-xl border bg-card divide-y'}>
                            {Array.from({ length: 4 }).map((_, i) => (
                               <div key={i} className={'flex items-center gap-4 px-4 py-4'}>
                                   <Skeleton className="h-4 w-36" />
                                   <Skeleton className="h-4 w-28" />
                                   <Skeleton className="h-4 w-44" />
                                   <div className="ml-auto flex gap-2">
                                       <Skeleton className="h-8 w-8 rounded-md" />
                                       <Skeleton className="h-8 w-8 rounded-md" />
                                   </div>                     <Skeleton className="h-4 w-36" />
                                   <Skeleton className="h-4 w-28" />
                                   <Skeleton className="h-4 w-44" />
                                   <div className="ml-auto flex gap-2">
                                       <Skeleton className="h-8 w-8 rounded-md" />
                                       <Skeleton className="h-8 w-8 rounded-md" />
                                   </div>
                               </div>
                            ))}
                        </div>
                     // customers rendering
                     ) : customers.length === 0 ? (
                         // If no customers
                         <div className={'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center'}>
                             <div className={'rounded-full bg-muted p-3'}>
                                 <Users className={'h-6 w-6 text-muted p-3'}/>
                             </div>
                             <div>
                                 <p className={'font-medium'}>No customers yet</p>
                                 <p>
                                     Add your first customer to get started.
                                 </p>
                             </div>
                             <Button className={'cursor-pointer'} onClick={ () => setCreateOpen(true)}>
                                 + New Customer
                             </Button>
                         </div>
                    ) : (
                        // If customers exist
                        <div className="rounded-xl border bg-card">
                            <Table>
                                {/* Table Header */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {/* Table body */}
                                <TableBody>
                                    {customers.map((customer, index) => (
                                        <TableRow key={index}>
                                            <TableCell className={'font-medium'}>
                                                {customer.name}
                                            </TableCell>
                                            <TableCell>
                                                <a href={`tel:${customer.phone}`} className={'flex items-center gap-1.5 text-primary hover:underline underline-offset-4'}>
                                                    <Phone className={'h-3.5 w-3.5'}/>
                                                    {customer.phone}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            setEditingCustomer(customer)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            setCustomerToDelete(customer)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    )
                }
            {/* Customer Rendering END */}

            {/* Dialogs rendering START */}
                <CreateCustomerDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />

                <EditCustomerDialog
                    customer={editingCustomer}
                    onOpenChange={(open) => {
                        if (!open) setEditingCustomer(null);
                    }}
                />

                <AlertDialog
                    open={!!customerToDelete}
                    onOpenChange={(open) => {
                        if (!open) setCustomerToDelete(null);
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete this customer?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete{" "}
                                <strong>{customerToDelete?.name}</strong>. Their
                                past orders won't be affected.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
                                disabled={deleteCustomer.isPending}
                                onClick={() => {
                                    if (customerToDelete) {
                                        deleteCustomer.mutate(
                                            customerToDelete._id
                                        );
                                        setCustomerToDelete(null);
                                    }
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            {/* Dialogs rendering END */}
        </div>

    )
}