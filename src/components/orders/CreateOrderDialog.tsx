"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateOrderDialog({open, onOpenChange}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create New Order
                    </DialogTitle>
                </DialogHeader>

                <div>
                    form goes here
                </div>
            </DialogContent>
        </Dialog>
    );
}