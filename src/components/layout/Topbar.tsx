"use client";

import { Button } from "@/components/ui/button";
import {LogOut, Menu} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import {useState} from "react";
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {SidebarContent} from "@/components/layout/Sidebar";

export default function Topbar() {
    const { data } = useCurrentUser();
    const logoutMutation = useLogout();
    const [open, setOpen] = useState(false);

    return (
        <header className="border-b px-8 py-5 flex items-center justify-between">
        {/* SideBar Menu */}
            <div className={'flex items-center gap-4'}>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} size={"icon"} className={'lg:hidden cursor-pointer'}>
                            <Menu className={'h-5 w-5'} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side={'left'} className={'p-0 w-64'}>
                        <SheetTitle className={'sr-only'}>
                            Navigation Menu
                        </SheetTitle>
                        <SidebarContent onNavigate={ () => setOpen(false)}/>
                    </SheetContent>
                </Sheet>
            </div>
        {/* Logout section */}
            <div className="flex items-center gap-4">
                {data?.user.email && (
                    <span className={'text-sm text-muted-foreground hidden sm:block'}>
                        {data.user.email}
                    </span>
                )}
                {/* language Toggle */}
                <LanguageToggle />
                {/* logout */}
                <Button
                    variant={'outline'}
                    size={'sm'}
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className={'cursor-pointer group'}
                >
                    <LogOut className={'h-4 w-4 mr-2 group-hover:text-red-600'}/>
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>
            </div>
        </header>
    );
}