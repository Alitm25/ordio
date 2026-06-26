"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (current > 3) {
        pages.push("ellipsis");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push("ellipsis");
    }

    pages.push(total);

    return pages;
}

export default function OrdersPagination({page, totalPages, onPageChange}: Props) {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = getPageNumbers(page, totalPages);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        className="cursor-pointer"
                        aria-disabled={page === 1}
                        onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) onPageChange(page - 1);
                        }}
                    />
                </PaginationItem>

                {pageNumbers.map((p, index) =>
                    p === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={p}>
                            <PaginationLink
                                className="cursor-pointer"
                                isActive={p === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(p);
                                }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        className="cursor-pointer"
                        aria-disabled={page === totalPages}
                        onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) onPageChange(page + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}