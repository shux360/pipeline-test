import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ChevronDown, Plus } from "lucide-react";

const DataTable = ({ data }) => {
  const navigate = useNavigate();
  const [rowSelection, setRowSelection] = useState({});
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Extract unique categories from the data
  const uniqueCategories = useMemo(() => {
    return [...new Set(data.map((item) => item.priority))];
  }, [data]);

  // Filter data based on search query and selected category
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchQuery
        ? item.requestName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategory ? item.priority === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  const handleCategorySelection = useCallback((priority) => {
    setSelectedCategory(priority);
  }, []);

  const handleRowClick = (requestId) => {
    navigate(`/forms/${requestId}`); // Navigate to the form page
  };

  // const handleAssign = () => {
  //   const selectedRequests = table.getFilteredSelectedRowModel().rows.map(
  //     (row) => row.original
  //   );
  //   navigate("/assign-workflows/select-workflows", { state: { selectedRequests } });
  // };

  const columns = [
    {
      accessorKey: "requestId",
      header: "Request ID",
      cell: ({ row }) => <div>{row.getValue("requestId")}</div>,
    },
    {
      accessorKey: "requestCode",
      header: "Request Code",
      cell: ({ row }) => <div>{row.getValue("requestCode")}</div>,
    },
    {
      accessorKey: "requestName",
      header: ({ column }) => ("Request Name"),
      cell: ({ row }) => row.getValue("requestName") || "N/A",
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <div>{row.getValue("priority")}</div>,
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search requests by name"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Priority <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setSelectedCategory("")}
              className={selectedCategory === "" ? "font-bold" : ""}
            >
              All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {uniqueCategories.map((priority) => (
              <DropdownMenuItem
                key={priority}
                onClick={() => handleCategorySelection(priority)}
                className={selectedCategory === priority ? "font-bold" : ""}
              >
                {priority}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border max-h-80 overflow-y-scroll">
        {filteredData.length ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}
                  onClick={() => handleRowClick(row.original.requestId)} 
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 text-center">No requests found.</div>
        )}
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} request(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            className="dark:text-white"
            onClick={handleAssign}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Assign Workflows
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default DataTable;