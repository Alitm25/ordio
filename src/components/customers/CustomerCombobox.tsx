"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Customer } from "@/types/customer";
import { cn } from "@/lib/utils";

interface Props {
    customers: Customer[];
    value: string;
    onSelect: (customer: Customer) => void;
}

export default function CustomerCombobox({ customers, value, onSelect }: Props) {
    // Open and Close dialog state
    const [open, setOpen] = useState(false);

    // Customer value variable ( The value which  )
    const selectedCustomer = customers.find((c) => c._id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between cursor-pointer font-normal"
                >
                    {selectedCustomer
                        ? `${selectedCustomer.name} — ${selectedCustomer.phone}`
                        : "Select from customers..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search customers..." />
                    <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                            {customers.map((customer) => (
                                <CommandItem
                                    key={customer._id}
                                    value={`${customer.name} ${customer.phone}`}
                                    onSelect={() => {
                                        onSelect(customer);
                                        setOpen(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === customer._id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <span className="flex-1">
                                        {customer.name}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                        {customer.phone}
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