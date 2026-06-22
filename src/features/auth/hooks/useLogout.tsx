"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "../services/authApi";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ["currentUser"] });
            router.push("/login");
        },
    });
}