"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customerSchema, CustomerFormValues } from "@/features/customers/schemas/customerSchema";
import { useCreateCustomer } from "@/features/customers/hooks/useCustomer";
import {useTranslations} from "next-intl";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateCustomerDialog({ open, onOpenChange }: Props) {
    // Customer dialog form default values initialization
    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: "",
            phone: "",
            notes: "",
        },
    });

    const tCustomerCreate = useTranslations('customers.create');
    const tCommon = useTranslations('common');



    // Creating customer FN
    const createCustomer = useCreateCustomer(() => {
        form.reset();
        onOpenChange(false);
    });

    // Customer dialog form onSubmit FN
    const onSubmit = (data: CustomerFormValues) => {
        createCustomer.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ tCustomerCreate('title') }</DialogTitle>
                    <DialogDescription>
                        { tCustomerCreate('description') }
                    </DialogDescription>
                </DialogHeader>
                {/* Form START */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name input */}
                        <div className="space-y-1">
                            <Input{...form.register("name")} placeholder={ tCustomerCreate('name') } />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>
                        {/* Phone number input */}
                        <div className="space-y-1">
                            <Input {...form.register("phone")} placeholder={ tCustomerCreate('phone') } />
                            {form.formState.errors.phone && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.phone.message}
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
                            <Button type="submit" className="cursor-pointer" disabled={createCustomer.isPending}>
                                {
                                    createCustomer.isPending
                                    ? tCustomerCreate('loading')
                                    : tCustomerCreate('submit')
                                }
                            </Button>
                        </div>
                    </form>
                {/* Form END */}
            </DialogContent>
        </Dialog>
    );
}