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
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogOverlay, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import LayOut from "../../../../components/LayOut";
import { ArrowUpDown, ChevronDown, MoreHorizontal,Plus,SquareArrowOutUpRight,Trash2,Pencil  } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

function DataTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const { state } = useLocation();
  const [selectedRequests, setSelectedRequests] = useState(state?.selectedRequests || []);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowLevels, setWorkflowLevels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkflowsArray, setSelectedWorkflowsArray] = useState([]);
  
  
  const headers = {
     'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await axios.get(`${backendUrl}/workflows/all`, { headers });
          console.log("response", response.data);
        const formattedData = response.data.map((item) => ({
          workflowId: item.workflowId,
          identificationString: item.identificationString,
          workflowName: item.workflowName,
          workflowType: item.workflowType,
          workflowLevels: item.workflowLevels.map((level) => ({
            ...level,
            escalatingTime: "Unlimited", 
          })),

        }));
        setData(formattedData);

        const uniqueCategories = [
          ...new Set(response.data.map((item) => item.workflowType)),
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

  const createWorkflowObject = (workflow) => ({
    workflowId: workflow.workflowId,
    workflowLevels: workflow.workflowLevels.map(level => ({
      id: level.id,
      approvalLevel: level.approvalLevel,
      escalatingTime: level.escalatingTime || "Unlimited"
    }))
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchQuery
        ? item.workflowName.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategory ? item.workflowType === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  const handleCategorySelection = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleRowSelectionChange = useCallback((updater) => {
    setRowSelection(prev => {
      const newSelection = typeof updater === "function" ? updater(prev) : updater;
      
      // Get all newly selected workflows
      const selectedWorkflows = Object.entries(newSelection)
        .filter(([_, isSelected]) => isSelected)
        .map(([index]) => filteredData[parseInt(index)]);

      // Update selectedWorkflowsArray with all currently selected workflows
      setSelectedWorkflowsArray(prevWorkflows => {
        const newWorkflows = [];
        
        selectedWorkflows.forEach(workflow => {
          const existingWorkflow = prevWorkflows.find(w => w.workflowId === workflow.workflowId);
          if (existingWorkflow) {
            newWorkflows.push(existingWorkflow);
          } else {
            newWorkflows.push(createWorkflowObject(workflow));
          }
        });

        return newWorkflows;
      });

      return newSelection;
    });
  }, [filteredData]);

  


  // const handleAssign = () => {
  //   console.log("selectedWorkflows", selectedWorkflow);
  //   console.log("selectedRows", selectedRows);
  //   // const selected = filteredData.filter(row => selectedRows[row.id]);
  //   // navigate("/assign-workflows/select-workflows", { state: { selected } });
  // };

  const handleAssign = async () => {
    console.log("selectedWorkflows", selectedWorkflow);
    console.log("selectedRows", selectedRows);
    if (selectedWorkflowsArray.length === 0) {
      toast.error("Please select at least one workflow");
      return;
    }

    if (selectedRequests.length === 0) {
      toast.error("No requests selected");
      return;
    }

    const selectedWorkflowIds = Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(key => filteredData[parseInt(key)].workflowId);

    const finalWorkflows = selectedWorkflowIds.map(workflowId => {
      const existingWorkflow = selectedWorkflowsArray.find(w => w.workflowId === workflowId);
      if (existingWorkflow) {
        return existingWorkflow;
      }
      const workflow = data.find(w => w.workflowId === workflowId);
      return createWorkflowObject(workflow);
    });

    const assignmentData = {
      requestIds: selectedRequests.map(request => request.requestId),
      workflows: finalWorkflows
    };

    try {

      const response = await axios.post(
        `${backendUrl}/workflows/assign`,
        assignmentData,
        { headers }
      );

      if (response.status === 200) {
        toast.success("Workflows assigned successfully!");
        // navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error assigning workflows:", error);
      toast.error("Failed to assign workflows. Please try again.");
    }
  };

  const handleEditClick = (workflow) => {
    console.log("rowselection", rowSelection);
    console.log("workflow", workflow);
    
    const selectedRow = table.getRowModel().rows.find(
      (row) => row.original.workflowId === workflow.workflowId
    );
  
    // Check if the row is selected using its internal React Table ID
    if (!selectedRow?.getIsSelected()) {
      toast.error("Please select the workflow first.");
      return;
    }
    setSelectedWorkflow(workflow);
    setWorkflowLevels(workflow.workflowLevels);
    setIsModalOpen(true);
  };

  const handleSaveTime = () => {
    if (workflowLevels.some((level) => level.escalatingTime && parseInt(level.escalatingTime, 10) <= 0)) {
      toast.error("Please ensure all escalating times are valid.");
      return;
    }

    setSelectedWorkflowsArray(prevWorkflows => {
      const updatedWorkflows = [...prevWorkflows];
      const workflowIndex = updatedWorkflows.findIndex(w => w.workflowId === selectedWorkflow.workflowId);
      
      const updatedWorkflow = {
        workflowId: selectedWorkflow.workflowId,
        workflowLevels: workflowLevels.map(level => ({
          id: level.id,
          approvalLevel: level.approvalLevel,
          escalatingTime: level.escalatingTime || "Unlimited"
        }))
      };

      if (workflowIndex !== -1) {
        updatedWorkflows[workflowIndex] = updatedWorkflow;
      } else {
        updatedWorkflows.push(updatedWorkflow);
      }

      return updatedWorkflows;
    });

    setData(prevData =>
      prevData.map(workflow =>
        workflow.workflowId === selectedWorkflow.workflowId
          ? { ...workflow, workflowLevels }
          : workflow
      )
    );
    
    setIsModalOpen(false);
    setSelectedWorkflow(null);
    setWorkflowLevels([]);
  };

  const updateEscalatingTime = (levelId, value) => {
    setWorkflowLevels((prevLevels) =>
      prevLevels.map((level) =>
        level.id === levelId ? { ...level, escalatingTime: value } : level
      )
    );
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
      accessorKey: "identificationString",
      header: "Workflow",
      cell: ({ row }) => <div>{row.getValue("identificationString")}</div>,
    },
    {
      accessorKey: "workflowName",
      header: "Workflow Name",
      // header: ({ column }) => (
      //   <Button
      //     variant="ghost"
      //     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //   >
      //   Workflow Name
      //   <ArrowUpDown />
      //   </Button>
      // ),
      cell: ({ row }) => row.getValue("workflowName") || "N/A",
              },
    {
      accessorKey: "workflowType",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("workflowType")}</div>,
    },
    {
      id: "edit",
      header: "Edit",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => handleEditClick(row.original)}
          // disabled={Object.keys(rowSelection).length === 0}
        >
          <SquareArrowOutUpRight
          className="h-4 w-4"/>
        </Button>
      ),
    },
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
    onRowSelectionChange: handleRowSelectionChange,
    
  });

  if (loading) {
    return <div className="justify-center items-center">Loading...</div>;
  }

  return (
    <div className="w-full">
          {selectedRequests.length > 0 && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Selected Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {selectedRequests.map((request, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg shadow-sm bg-white flex flex-col"
              >
                <span className="text-[14px] font-medium text-gray-600">
                  {request.requestName || "N/A"}
                </span>
                <span className="text-[13px]  text-gray-500">
                  {request.requestCategory}
                </span>
                <span className="text-[12px]  text-gray-400">
                  {request.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center py-4">
      <Input
          placeholder="Search workflows by name"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
        />
         <DropdownMenu>
         <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
          Workflow Type  <ChevronDown />
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
          <div className="p-4 text-center">No workflows found.</div>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {" "}
          {table.getFilteredRowModel().rows.length} request(s) selected.
        </div>
        <div className="space-x-2">
        <Button
          onClick={handleAssign}
          // disabled={Object.keys(selectedRows).length === 0}
        >
          {/* <Plus className="mr-2 h-4 w-4" /> */}
          Save
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* <DialogOverlay className="fixed inset-0 bg-black/50" /> */}
        <DialogContent className="fixed top-1/2 left-1/2 w-[90%] max-w-lg p-6 bg-white rounded-lg shadow-md transform -translate-x-1/2 -translate-y-1/2">
          <DialogTitle className="text-lg font-bold">
            Edit Workflow Levels
          </DialogTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Approval Level</TableHead>
                <TableHead>Authorized Person</TableHead>
                <TableHead>Escalating Time (mins)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflowLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell>{level.approvalLevel}</TableCell>
                  <TableCell>{level.authPerson}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={
                        level.escalatingTime === "Unlimited" ? "" : level.escalatingTime
                      }
                      placeholder="Unlimited"
                      onChange={(e) => {
                        const value = e.target.value;
                        updateEscalatingTime(level.id, value === "" ? "Unlimited" : value);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTime}
              // disabled={Object.keys(selectedRows).length === 0}
            >
              Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <WorkflowAssignmentsTable />
    </div>
  );

  
}

const WorkflowAssignmentsTable = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [workflowAssignments, setWorkflowAssignments] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workflowAssignmentIdToDelete, setWorkflowAssignmentIdToDelete] = useState(null);

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
     'Content-Type': 'application/json',
  };
  
  const transformData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const { workflowId, workflowIdentificationString, requestTypes, jobCategories, levelAssignments } = item;
  
      if (!acc[workflowId]) {
        acc[workflowId] = {
          workflowId,
          workflowIdentificationString,
          requestTypes: new Set(),
          jobCategories: new Set(),
          levelAssignments: [],
        };
      }
  
      requestTypes.forEach((type) => acc[workflowId].requestTypes.add(type.trim()));
      jobCategories.forEach((category) => acc[workflowId].jobCategories.add(category));
      acc[workflowId].levelAssignments.push({
        requestType: requestTypes[0].trim(), 
        jobCategories: jobCategories,
        levels: levelAssignments,
      });
  
      return acc;
    }, {});
  
    return Object.values(groupedData).map((workflow) => ({
      workflowId: workflow.workflowId,
      workflowIdentificationString: workflow.workflowIdentificationString,
      requestTypes: Array.from(workflow.requestTypes),
      jobCategories: Array.from(workflow.jobCategories),
      levelAssignments: workflow.levelAssignments,
    }));
  };

  const fetchWorkflowAssignments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/workflows/assignments`, { headers });
      console.log("fetched data", response.data);
      const transformedData = transformData(response.data);
      console.log("Transformed Data:", transformedData);
      setWorkflowAssignments(transformedData);

    } catch (error) {
      console.error("Error fetching workflow assignments:", error);
      toast.error("Failed to fetch workflow assignments");
    }
  };
  
  useEffect(() => {
    fetchWorkflowAssignments();
  }, []);

  const handleEditClick = (workflow, requestType) => {
    console.log("Edit Clicked:", workflow, requestType);
    const levelAssignments = workflow.levelAssignments.find(
      (assignment) => assignment.requestType === requestType
    )?.levels || [];

    setSelectedRequest({
      workflowIdentificationString: workflow.workflowIdentificationString,
      requestType,
      levelAssignments,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async (updatedRequest) => {
    console.log("Updated Request:", updatedRequest);
    try {
      const response = await axios.put(
        `${backendUrl}/workflows/assignments/update-escalating-times`,
        {
          workflowIdentificationString: updatedRequest.workflowIdentificationString,
          requestType: updatedRequest.requestType,
          levelAssignments: updatedRequest.levelAssignments.map((level) => ({
            id: level.levelAssignmentId,
            approvalLevel: level.approvalLevel,
            escalatingTime: level.escalatingTime,
          })),
        },
        { headers }
      );
  
      if (response.status === 200) {
        toast.success("Escalating times updated successfully!");
        setIsDialogOpen(false);
        fetchWorkflowAssignments();
      }
    } catch (error) {
      console.error("Error updating escalating times:", error);
      toast.error("Failed to update escalating times.");
    }
  };

  const handleDeleteClick = async (workflowAssignmentId) => {
    console.log("Delete Clicked:", workflowAssignmentId);
    try {
      const response = await axios.delete(
        `${backendUrl}/workflows/assignments/delete-level-assignment`,
        {
          headers,
          data: { id: workflowAssignmentId },
        }
      );

      if (response.status === 200) {
        toast.success("Workflow level assignment deleted successfully!");
        fetchWorkflowAssignments(); 
      }
    } catch (error) {
      console.error("Error deleting workflow level assignment:", error);
      toast.error("Failed to delete workflow level assignment.");
    }
  };

  // // Group assignments by workflow
  // const groupedAssignments = assignments.reduce((acc, assignment) => {
  //   if (!acc[assignment.workflowIdentificationString]) {
  //     acc[assignment.workflowIdentificationString] = {
  //       workflowIdentificationString: assignment.workflowIdentificationString,
  //       levelAssignments: [],
  //     };
  //   }
  //   assignment.levelAssignments.forEach((levelAssignment) => {
  //     acc[assignment.workflowIdentificationString].levelAssignments.push(levelAssignment);
  //   });
  //   return acc;
  // }, {});

  const columns = [
    {
      accessorKey: "workflowIdentificationString",
      header: "Workflow",
      cell: ({ row }) => <div>{row.getValue("workflowIdentificationString")}</div>,
    },
    {
      accessorKey: "requestAndJobCategories",
      header: "Request Types & Job Categories",
      cell: ({ row }) => (
        <div>
          {row.original.levelAssignments.map((assignment, index) => (
            <div key={index} className="flex items-center justify-between gap-12">
              <span>
                {assignment.requestType} - {assignment.jobCategories.join(", ")}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log("Edit button clicked", row.original, assignment.requestType); // Debugging
                    handleEditClick(row.original, assignment.requestType);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setWorkflowAssignmentIdToDelete(assignment.levels[0].workflowAssignmentId);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the workflow assignment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          if (workflowAssignmentIdToDelete) {
                            await handleDeleteClick(workflowAssignmentIdToDelete);
                            setIsDeleteDialogOpen(false);
                            setWorkflowAssignmentIdToDelete(null);
                          }
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: workflowAssignments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-8 mb-6">
      <h2 className="text-lg font-semibold mb-4">Current Workflow Assignments</h2>
      <div className="rounded-md border max-h-80 overflow-y-scroll">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pop-up Dialog for Editing */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 w-[90%] max-w-lg p-6 bg-white rounded-lg shadow-md transform -translate-x-1/2 -translate-y-1/2">
          <DialogTitle className="text-lg font-bold">
            Edit Escalating Times for {selectedRequest?.requestType}
          </DialogTitle>
          <DialogDescription id="dialog-description">
            Edit the escalating times for the selected request type.
          </DialogDescription>
          {selectedRequest && (
            <>
              <div className="mb-4">
                <strong>Workflow:</strong> {selectedRequest.workflowIdentificationString}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Approval Level</TableHead>
                    <TableHead>Authorized Person</TableHead>
                    <TableHead>Escalating Time (mins)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedRequest.levelAssignments.map((level) => (
                    <TableRow key={level.levelId}>
                      <TableCell>{level.approvalLevel}</TableCell>
                      <TableCell>{level.authPerson}</TableCell>
                      <TableCell>
                        <Input
                          type="string"
                          value={level.escalatingTime === "Unlimited" ? "" : level.escalatingTime}
                          placeholder={level.escalatingTime === "Unlimited" ? "Unlimited" : ""}
                          onChange={(e) => {
                            const updatedLevels = selectedRequest.levelAssignments.map((l) =>
                              l.levelId === level.levelId
                                ? { ...l, escalatingTime: e.target.value || "Unlimited" }
                                : l
                            );
                            setSelectedRequest({
                              ...selectedRequest,
                              levelAssignments: updatedLevels,
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleUpdate(selectedRequest)}>
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SelectWorkflows = () => {
  return (
    <LayOut title='Assign Workflows' >
      <div className="w-full max-w-4xl mt-5 mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-indigo-900">Select Workflows</h1>
        </div>
        <div>
          <DataTable />
          
        </div>
      </div>
      </LayOut>
  )
}

export default SelectWorkflows
