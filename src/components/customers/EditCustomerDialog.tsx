"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customerSchema, CustomerFormValues } from "@/features/customers/schemas/customerSchema";
import { useUpdateCustomer } from "@/features/customers/hooks/useCustomer";
import { Customer } from "@/types/customer";
import {useTranslations} from "next-intl";

interface Props {
    customer: Customer | null;
    onOpenChange: (open: boolean) => void;
}

export default function EditCustomerDialog({ customer, onOpenChange }: Props) {
    // Customer dialog form default values initialization
    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: "",
            phone: "",
            notes: "",
        },
    });

    // Translation functions
    const tCustomersEdit = useTranslations('customers.edit')
    const tCustomerCreate = useTranslations('customers.create');
    const tCommon = useTranslations('common');
    const tValid = useTranslations('validation');


    // Attaching customer values to the edit form (new and old values)
    useEffect(() => {
        if (customer) {
            form.reset({
                name: customer.name,
                phone: customer.phone,
                notes: customer.notes,
            });
        }
    }, [customer, form]);

    // Update customer function
    const updateCustomer = useUpdateCustomer(() => onOpenChange(false));

    // Edit form onSubmit function
    const onSubmit = (data: CustomerFormValues) => {
        if (!customer) return;
        updateCustomer.mutate({ id: customer._id, data });
    };

    return (
        <Dialog open={!!customer} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ tCustomersEdit('title') }</DialogTitle>
                    <DialogDescription>
                        { tCustomersEdit('description') }
                    </DialogDescription>
                </DialogHeader>
                {/* Form START */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-1">
                            <Input {...form.register("name")} placeholder={ tCustomerCreate('name') } />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    { tValid('productNameRequired') }
                                </p>
                            )}
                        </div>
                        {/* Phone number input */}
                        <div className="space-y-1">
                            <Input {...form.register("phone")} placeholder={ tCustomerCreate('phone') } />
                            {form.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                    { tValid('phoneExact') }
                                </p>
                            )}
                        </div>
                        {/* Notes input */}
                        <div className="space-y-1">
                            <Input {...form.register("notes")} placeholder={ tCustomerCreate('notes') } />
                        </div>
                        {/* Submit button */}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                                { tCommon('cancel') }
                            </Button>
                            <Button type="submit" className="cursor-pointer" disabled={updateCustomer.isPending}>
                                {
                                    updateCustomer.isPending
                                    ? tCustomersEdit('loading')
                                    : tCustomersEdit('submit')
                                }
                            </Button>
                        </div>
                    </form>
                {/* Form START */}
            </DialogContent>
        </Dialog>
    );
}