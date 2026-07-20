"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createCustomer, deleteCustomer, getCustomers, updateCustomer} from "@/features/customers/services/customerApi";
import {toast} from "sonner";

// GET customers Custom Hook
export function useCustomers (){
    return useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers
    })
}

// POST (create) customers Custom Hook
export function useCreateCustomer(onSuccess?: () => void) {
    const queryClients = useQueryClient();

    return useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['customers'] });
            toast.success("Customers created successfully.");
            onSuccess?.()
        },
        onError: () => {
            toast.error("Could not create customer")
        }
    })
}

// PATCH (edit) customers Custom Hook
export function useUpdateCustomer(onSuccess?: () => void) {
    const queryClients = useQueryClient();

    return useMutation({
        mutationFn: updateCustomer,
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['customers'] });
            toast.success("Customers updated successfully.");
            onSuccess?.();
        },
        onError: () => {
            toast.error("Could not update customer")
        }
    })
}

// DELETE customer Custom Hook
export function useDeleteCustomer () {
    const queryClients = useQueryClient();

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['customers'] });
            toast.success("Customers deleted successfully.");
        },
        onError: () => {
            toast.error("Could not delete customer")
        }
    })
}