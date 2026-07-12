"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";


interface Props {
    products: Product[];
    value: string;
    onSelect: (product: Product) => void;
}

export default function ProductCombobox({ products, value, onSelect }: Props) {
    const [open, setOpen] = useState(false);

    const selectedProduct = products.find((p) => p.name === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between cursor-pointer font-normal"
                >
                    {selectedProduct ? selectedProduct.name : "Select from catalog..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                            {products.map((product) => (
                                <CommandItem
                                    key={product._id}
                                    value={product.name}
                                    onSelect={() => {
                                        onSelect(product);
                                        setOpen(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === product.name
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <span className="flex-1">{product.name}</span>
                                    <span className="text-muted-foreground text-sm">
                                        {product.price.toLocaleString()}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}