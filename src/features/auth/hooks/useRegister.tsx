"use client"

import {useMutation} from "@tanstack/react-query";
import {register} from "@/features/auth/services/authApi";

export function useRegister() {
    return useMutation({
        mutationFn: register,
    });
}