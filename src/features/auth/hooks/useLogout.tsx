"use client";

import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/authApi";

export function useLogout() {
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Full page load instead of router.push: everything in memory (the whole React Query cache
            // with this user's orders, customers...) is thrown away, so the next user starts empty.
            // replace() also stops the Back button from returning into the app.
            window.location.replace("/login");
        },
    });
}
