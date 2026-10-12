import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
    // icon size in px (the wordmark is styled separately with textClassName)
    size?: number;
    withText?: boolean;
    className?: string;
    textClassName?: string;
    // load it first when it's above the fold (e.g. the landing navbar)
    priority?: boolean;
}

// The Ordio mark + wordmark, used everywhere the brand appears
export default function Logo({ size = 28, withText = true, className, textClassName, priority }: Props) {
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            {/* Loaded as a file (not inline SVG): the logo's internal ids (#ring, #gMid...)
                would collide if the same inline SVG appeared twice on one page.
                unoptimized: an SVG is already sharp at any size, there's nothing to resize.
                alt="": when the word "Ordio" is next to it, screen readers shouldn't hear the name twice */}
            <Image
                src="/logo.svg"
                alt={withText ? "" : "Ordio"}
                width={size}
                height={size}
                unoptimized
                priority={priority}
                className="shrink-0"
            />
            {withText && (
                <span className={cn("font-bold tracking-tight text-primary", textClassName)}>Ordio</span>
            )}
        </span>
    );
}
