"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function Topbar() {
    const { data } = useCurrentUser();
    const logoutMutation = useLogout();

    return (
        <header className="border-b px-8 py-5 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">
                    Orders Management
                </h1>

                <p className="text-sm text-muted-foreground mt-1">
                    Manage and track customer orders
                </p>
            </div>

            <div className="flex items-center gap-4">
                {
                    data?.user.email && (
                        <span className="text-sm text-muted-foreground">
                            {data.user.email}
                        </span>
                    )
                }

                <Button variant="outline" size="sm" className={'cursor-pointer group'}
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                >
                    <LogOut className="h-4 w-4 mr-2 group-hover:text-red-500 transition" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
            </div>
        </header>
    );
}