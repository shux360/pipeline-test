import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import LayOut from "../../../../components/LayOut";
import { ArrowUpDown, ChevronDown, MoreHorizontal,Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";
const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

function DataTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const headers = {
     'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/requests/all`, { headers });
        
        const formattedData = response.data.map((item) => ({
          requestId: item.requestId,
          requestCategory: item.requestCategory,
          requestName: item.requestName,
          roles: item.roles,
        }));
        setData(formattedData);
        console.log("formattedData",formattedData);

        const uniqueCategories = [
          ...new Set(response.data.map((item) => item.requestCategory)),
        ];
        setCategories(uniqueCategories);

      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchQuery
        ? item.requestName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategory ? item.requestCategory === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  const handleCategorySelection = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleAssign = () => {
    const selectedRequests = table.getFilteredSelectedRowModel().rows.map(
      (row) => row.original
    );
    navigate("/assign-workflows/select-workflows", { state: { selectedRequests } });
  };

  const columns = [
    {
      id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "requestCategory",
      header: "Request Category",
      cell: ({ row }) => <div>{row.getValue("requestCategory")}</div>,
    },
    {
      accessorKey: "requestName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Request Name
        <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => row.getValue("requestName") || "N/A",
      },
      {
        accessorKey: "roles",
        header: "Role",
        cell: ({ row }) => (
          <div>
            {row.getValue("roles")?.map((role, index) => (
              <span key={index}>
                {role.roleName}
                {index < row.getValue("roles").length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        ),
      }
  ];

  const memoizedColumns = useMemo(() => columns, []);

  const table = useReactTable({
    data: filteredData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    
  });

  if (loading) {
    return <div className="justify-center items-center">Loading...</div>;
  }

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
          Category  <ChevronDown />
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setSelectedCategory("")}
              className={selectedCategory === "" ? "font-bold" : ""}
            >
              All Categories
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem
              key={category}
              onClick={() => handleCategorySelection(category)}
                className={
                  selectedCategory === category ? "font-bold" : ""
                }
              >
                {category}
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
                <TableRow key={row.id}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {" "}
          {table.getFilteredRowModel().rows.length} request(s) selected.
        </div>
        <div className="space-x-2">
        <Button
        className='dark:text-white'
            onClick={handleAssign}
            disabled={
              table.getFilteredSelectedRowModel().rows.length === 0
            }
          // disabled={Object.keys(selectedRows).length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Assign Workflows
        </Button>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            // disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            // disabled={!table.getCanNextPage()}
          >
            Next
          </Button> */}
        </div>
      </div>
    </div>
  );
}


function AssignWorkflows() {
  return (
      
      <LayOut title='Assign Workflows' >
      <div className="w-full max-w-4xl mt-5 mx-auto p-6 bg-white dark:bg-dark2 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-indigo-900 dark:text-white">Select Request Types</h1>
        </div>
        <div>
            <DataTable />
        </div>
      </div>
      </LayOut>
  );
}

export default AssignWorkflows;
