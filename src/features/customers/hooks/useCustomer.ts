"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createCustomer, deleteCustomer, getCustomers, updateCustomer} from "@/features/customers/services/customerApi";
import {toast} from "sonner";
import {useTranslations} from "next-intl";

const tToast = useTranslations('toast.customer');

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
            toast.success( tToast('createSuccess') );
            onSuccess?.()
        },
        onError: () => {
            toast.error( tToast('createError') )
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
            toast.success( tToast('updateSuccess') );
            onSuccess?.();
        },
        onError: () => {
            toast.error( tToast('updateError') )
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
            toast.success( tToast('deleteSuccess') );
        },
        onError: () => {
            toast.error( tToast('deleteError') );
        }
    })
}