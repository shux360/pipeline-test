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


const ComboboxWorkflow = ({ items, value, onSelect }) => {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    // console.log("value", value);
  
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
            className="w-full justify-between bg-gray-100"
          >
            {selectedValue
              ? items.find((item) => item.id.toString() === selectedValue)?.name
              : "Select workflow..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full lg:w-[500px] md:w-[500px] p-0" align="end" // Align the dropdown with the start of the input
        sideOffset={5}>
          <Command>
            <CommandInput placeholder="Search workflow by Id" className="h-9" />
            <CommandList>
              <CommandEmpty>No workflow found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id.toString()}
                    onSelect={(currentValue) => {
                      setSelectedValue(currentValue === selectedValue ? "" : currentValue);
                      setOpen(false);
                      onSelect(currentValue); 
                    }}
                  >
                    {item.name} (ID: {item.id})
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValue === item.id.toString() ? "opacity-100" : "opacity-0"
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
  
export default ComboboxWorkflow;