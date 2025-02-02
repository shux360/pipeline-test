
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react";


const Combobox = ({ users, value, onSelect }) => {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
  
    useEffect(() => {
      setSelectedValue(value || ""); 
    }, [value]);
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-300"
          >
            {selectedValue
              ? users.find((user) => user.userId.toString() === selectedValue)?.name
              : "Select user..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search user..." className="h-9" />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.userId}
                    value={user.userId.toString()}
                    onSelect={(currentValue) => {
                      setSelectedValue(currentValue === selectedValue ? "" : currentValue);
                      setOpen(false);
                      onSelect(currentValue); 
                    }}
                  >
                    {user.name} (ID: {user.userId})
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValue === user.userId.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
}
  
export default Combobox;