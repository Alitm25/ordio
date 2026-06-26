"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    title?: string;
    description?: string;
    onRetry: () => void;
}

export default function ErrorState({ title = "Something went wrong", description = "Please try again.", onRetry }: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
            </div>

            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Button variant="outline" className="cursor-pointer" onClick={onRetry}>
                Try again
            </Button>
        </div>
    );
}