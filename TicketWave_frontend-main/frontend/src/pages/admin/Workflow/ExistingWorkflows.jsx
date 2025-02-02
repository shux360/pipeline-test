// // import React from 'react'
// // import LayOut from '../../../components/LayOut'

// // const ExistingWorkflows = () => {
// //   return (
// //     <LayOut title='Existing Workflows'>
// //       <h1 className="text-center">Existing Workflows</h1>
// //     </LayOut>
// //   )
// // }

// // export default ExistingWorkflows
// //AssignEmployee.jsx implemetation

// //AssignEmployee.jsx implemetation
// import LayOut from "@/components/LayOut";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Search } from "lucide-react";
// import { useState } from "react";

// const existingWorkflows = [
//   {
//     name: "District managers OPA approve",
//     description: "District managers OPA approve",
//     noLevels: 2,
//     type: "Dynamic",
//   },
//   {
//     name: "Grade 3-1 > DM",
//     description: "Grade 3-1 > DM",
//     noLevels: 2,
//     type: "Dynamic",
//   },
//   {
//     name: "Head Office OPA/OT approval",
//     description: "Head Office OPA/OT approval",
//     noLevels: 2,
//     type: "Dynamic",
//   },
//   {
//     name: "Medical claim HO below CM",
//     description: "Medical claim HO below CM",
//     noLevels: 2,
//     type: "Dynamic",
//   },
//   {
//     name: "Medical claim HR staff",
//     description: "Medical claim HR staff",
//     noLevels: 2,
//     type: "Dynamic",
//   },
//   {
//     name: "Recruitment Manpower Plan",
//     description: "Recruitment Manpower Plan",
//     noLevels: 2,
//     type: "Dynamic",
//   },
// ];

// const ExistingWorkflows = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const existingWorkflows = await fetch(`${backendUrl}/workflows/all`).then((response) => {
//     return response.data;
//   });
//   return (
//     <LayOut title="Existing Workflows">
//       <div className="max-w-6xl ml-80 mt-48">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle>Existing workflows {existingWorkflows.length}</CardTitle>
//             <div className="relative">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />

//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

//               <Input
//                 placeholder="Search Request Type"
//                 className="pl-10 w-[300px]"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>No levels</TableHead>
//                   <TableHead>Workflow type</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {existingWorkflows && existingWorkflows.map((workflow, index) => (
//                   <TableRow key={index}>
//                     <TableCell className="font-medium">
//                       {workflow.name}
//                     </TableCell>
//                     <TableCell>{workflow.description}</TableCell>
//                     <TableCell>{workflow.noLevels}</TableCell>
//                     <TableCell>{workflow.type}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </LayOut>
//   );
// };

// export default ExistingWorkflows;

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

const ExistingWorkflows = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [existingWorkflows, setExistingWorkflows] = useState([]); // State to hold workflows
  const [filteredWorkflows, setFilteredWorkflows] = useState([]); // For filtered workflows
  const [loading, setIsLoading] = useState(false);

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };
  // Fetch workflows from the backend using Axios
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/workflows/all`,{ headers });
        const workflows = Array.isArray(response.data) ? response.data : [];
        console.log("workflows", workflows);
        // Ensure data is an array
        setExistingWorkflows(workflows);
        setFilteredWorkflows(workflows);
      } catch (error) {
        console.error("Error fetching workflows:", error); // Handle fetch errors
        setExistingWorkflows([]); // Set empty array in case of an error
        setFilteredWorkflows([]);
      }finally{
        setIsLoading(false);  
      }
    };

    fetchWorkflows(); // Call fetch on component mount
  }, []);

  const handleRowClick = (workflowId) => {
    navigate(`/new-workflow/${workflowId}`); // Navigate to the new workflow route
  };

  // Filter workflows based on search input
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredWorkflows(existingWorkflows);
    } else {
      const filtered = existingWorkflows.filter((workflow) =>
        workflow.identificationString.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWorkflows(filtered);
    }
  }, [searchTerm, existingWorkflows]);

  return (
    <LayOut title="Existing Workflows">
      <div className="max-w-6xl ml-80 mt-48">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Existing workflows ({filteredWorkflows.length})</CardTitle>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search Workflow"
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
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead>No levels</TableHead>
                  <TableHead>Workflow type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading? <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Loading Workflows
                      </TableCell>
                    </TableRow> : Array.isArray(filteredWorkflows) && filteredWorkflows.length > 0 ? (
                  filteredWorkflows.map((workflow, index) => (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(workflow.workflowId)} // Add onClick handler to navigate
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-light3">
                      <TableCell className="font-medium">{workflow.identificationString}</TableCell>
                      {/* <TableCell>{workflow.description}</TableCell> */}
                      <TableCell>{workflow.noOfWorkflowLevel}</TableCell>
                      <TableCell>{workflow.workflowType                      }</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No workflows found
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

export default ExistingWorkflows;
