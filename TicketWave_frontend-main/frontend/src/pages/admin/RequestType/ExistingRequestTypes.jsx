// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { ArrowRight, Edit, MoreVertical, Trash } from "lucide-react"
// import { useState } from "react"
// import LayOut from "@/components/LayOut"

// const requestTypes = [
//   { name: "Account Access", category: "IT Support", priority: "High", workflow: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"] },
//   { name: "Loan Application", category: "Financial", priority: "Medium", workflow: ["/avatar1.jpg", "/avatar2.jpg"] },
//   { name: "Password Reset", category: "IT Support", priority: "High", workflow: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"] },
//   { name: "New Employee Onboard", category: "HR", priority: "Medium", workflow: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"] },
//   { name: "Expense Reimbursement", category: "Finance", priority: "Low", workflow: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"] },
//   { name: "Equipment Purchase", category: "Procurement", priority: "Medium", workflow: ["/avatar1.jpg", "/avatar2.jpg", "/avatar3.jpg"] },
// ]

// const PriorityBadge = ({ priority }) => {
//   const colorClass = {
//     High: "bg-red-100 text-red-800",
//     Medium: "bg-yellow-100 text-yellow-800",
//     Low: "bg-green-100 text-green-800"
//   }[priority]

//   return (
//     <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
//       {priority}
//     </span>
//   )
// }




// const RequestTypeDetails = ({ request, onInputChange, onSave, onClose }) => {
//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Request</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           {Object.entries(request).map(([key, value]) => (
//             key !== "workflow" && (
//               <div key={key} className="flex flex-col">
//                 <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
//                 <Input
//                   id={key}
//                   name={key}
//                   value={value}
//                   onChange={onInputChange}
//                 />
//               </div>
//             )
//           ))}
          
//           <div>
//             <span className="text-gray-600 font-medium">Workflow</span>
//             <div className="flex items-center mt-2 space-x-2">
//               {request.workflow.map((person, index) => (
//                 <div key={person.name} className="flex flex-col items-center">
//                   <Avatar className="h-12 w-12">
//                     <AvatarImage src={person.avatar} alt={person.name} />
//                     <AvatarFallback>{person.name}</AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm font-medium mt-1">{person.name}</span>
//                   <span className="text-xs text-gray-500">{person.role}</span>
//                   {index < request.workflow.length - 1 && (
//                     <ArrowRight className="text-purple-500 mx-2" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="flex justify-end space-x-2">
//             <Button onClick={onSave}>Save</Button>
//             <Button variant="outline" onClick={onClose}>Cancel</Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default function ExistingRequestTypes() {
//   const [openDialog, setOpenDialog] = useState(false)
//   const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
//   const [selectedRequest, setSelectedRequest] = useState(null)
//   const [editedRequest, setEditedRequest] = useState(null)

//   const handleEdit = (request) => {
//     setSelectedRequest(request)
//     setEditedRequest({ ...request })
//     setOpenDialog(true)
//   }

//   const handleDelete = (request) => {
//     setSelectedRequest(request)
//     setOpenDeleteConfirm(true)
//   }

//   const confirmDelete = () => {
//     // Implement delete functionality here
//     console.log("Deleting:", selectedRequest)
//     setOpenDeleteConfirm(false)
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setEditedRequest((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const saveChanges = () => {
//     console.log("Saving changes:", editedRequest)
//     // Here you would update the request in your state or backend
//     setOpenDialog(false)
//   }

//   return (
//     <LayOut title='Existing Request Types'>
//     <div className="w-full max-w-4xl mt-5 mx-auto p-6 bg-white rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold text-indigo-900">Existing Request Types</h1>
//       </div>
      
//       <Table>
//         <TableHeader>
//           <TableRow className="bg-gray-100">
//             <TableHead>Name</TableHead>
//             <TableHead>Category</TableHead>
//             <TableHead>Priority</TableHead>
//             <TableHead>Workflow</TableHead>
//             <TableHead className="w-[50px]"></TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {requestTypes.map((request, index) => (
//             <TableRow key={index}>
//               <TableCell className="font-medium">{request.name}</TableCell>
//               <TableCell>{request.category}</TableCell>
//               <TableCell><PriorityBadge priority={request.priority} /></TableCell>
//               <TableCell>
//                 <div className="flex -space-x-2">
//                   {request.workflow.map((avatar, i) => (
//                     <Avatar key={i} className="h-8 w-8 border-2 border-white">
//                       <AvatarImage src={avatar} />
//                       <AvatarFallback>U</AvatarFallback>
//                     </Avatar>
//                   ))}
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="h-4 w-4" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent align="end" className="w-32 p-0">
//                     <Button
//                       variant="ghost"
//                       className="w-full justify-start text-left"
//                       onClick={() => handleEdit(request)}
//                     >
//                       <Edit className="mr-2 h-4 w-4" /> Edit
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       className="w-full justify-start text-left"
//                       onClick={() => handleDelete(request)}
//                     >
//                       <Trash className="mr-2 h-4 w-4" /> Delete
//                     </Button>
//                   </PopoverContent>
//                 </Popover>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {selectedRequest && openDialog && (
//         <RequestTypeDetails
//           request={editedRequest}
//           onInputChange={handleInputChange}
//           onSave={saveChanges}
//           onClose={() => setOpenDialog(false)}
//         />
//       )}

//       {selectedRequest && openDeleteConfirm && (
//         <Dialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Are you sure?</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4">
//               <p>Do you really want to delete <strong>{selectedRequest.name}</strong>? This action cannot be undone.</p>
//               <div className="flex justify-end space-x-2">
//                 <Button variant="outline" onClick={() => setOpenDeleteConfirm(false)}>
//                   Cancel
//                 </Button>
//                 <Button variant="destructive" onClick={confirmDelete}>
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//     </LayOut>
//   )
// }
import LayOut from "@/components/LayOut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const ExistingRequestTypes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [existingRequestTypes, setExistingRequestTypes] = useState([]); // State to hold workflows
  const [filteredRequestTypes, setFilteredRequestTypes] = useState([]); // For filtered workflows
  const [loading, setIsLoading] = useState(false);

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    const fetchRequestTypes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/requests/all`,{ headers });
        const requests = Array.isArray(response.data) ? response.data : [];
        console.log("requests", requests);
 
        setExistingRequestTypes(requests);
        setFilteredRequestTypes(requests);
      } catch (error) {
        console.error("Error fetching request types:", error); 
        setExistingRequestTypes([]); 
        setFilteredRequestTypes([]);
      }finally{
        setIsLoading(false);
      }
    };

    fetchRequestTypes();
  }, []);

  const handleRowClick = (requestId) => {
    navigate(`/new-request-type/${requestId}`); 
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRequestTypes(existingRequestTypes);
    } else {
      const filtered = existingRequestTypes.filter((requests) =>
        requests.requestName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequestTypes(filtered);
    }
  }, [searchTerm, existingRequestTypes]);

  return (
    <LayOut title="Existing Request Types">
      <div className="max-w-6xl ml-80 mt-48 ">
        <Card className='dark:bg-dark2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Existing Request Types ({filteredRequestTypes.length})</CardTitle>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search by Request Name"
                className="pl-10 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Code</TableHead>
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead>Request Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                 
                </TableRow>
              </TableHeader>
              <TableBody>
                { loading? <TableRow>
      <TableCell colSpan={5} className="text-center">
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        Loading Request Types
      </TableCell>
    </TableRow> : Array.isArray(filteredRequestTypes) && filteredRequestTypes.length > 0 ? (
                  filteredRequestTypes.map((requests, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(requests.requestId)} // Add onClick handler to navigate
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-light4">
                      <TableCell className="font-medium">{requests.requestCode}</TableCell>
                      {/* <TableCell>{workflow.description}</TableCell> */}
                      <TableCell>{requests.requestName}</TableCell>
                      <TableCell>{requests.requestCategory}</TableCell>
                      <TableCell>{requests.priority}</TableCell>
                      
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No Request Types found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayOut>
  );
};

export default ExistingRequestTypes;