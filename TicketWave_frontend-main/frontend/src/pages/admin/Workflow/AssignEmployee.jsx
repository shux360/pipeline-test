// //AssignEmployee.jsx implemetation

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import LayOut from "../../../components/LayOut";

// const AssignEmployee = () => {
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState([]);
//   const navigate = useNavigate(); // Initialize the useNavigate hook

//   const allUsers = [
//     { id: "0101498", name: "A A A Sandaruwan" },
//     { id: "0103307", name: "A A C L Thilakarathne" },
//     { id: "0103237", name: "A A D C Amarasinghe" },
//     { id: "0101580", name: "A A D P Aththanayaka" },
//     { id: "0103411", name: "A A G D K Wickramasinghe" },
//     { id: "0103308", name: "A A M Fernando" },
//     { id: "0100983", name: "A A M N Weerasinghe" },
//     { id: "0100699", name: "A A M Rifai" },
//     { id: "0103230", name: "A A N T Amarasinghe" },
//     // ... add more users as needed
//   ];

//   const handleAssign = () => {
//     setAssignedUsers([...assignedUsers, ...selectedUsers]);
//     setSelectedUsers([]);
//   };

//   const handleUnassign = () => {
//     setAssignedUsers(
//       assignedUsers.filter((user) => !selectedUsers.includes(user))
//     );
//     setSelectedUsers([]);
//   };

//   const handleSave = () => {
//     // Implement save logic here
//     console.log("Save changes", assignedUsers);
//   };

//   return (
//     <LayOut>
//       <div className="max-w-6xl ml-80 mt-48">
//         {/* Step Indicator */}
//         <div className="mb-8 flex items-center justify-between">
//           {/* Step 1 */}
//           <div className="flex flex-col items-center">
//             <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
//               1
//             </div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               New Workflow
//             </span>
//           </div>
//           <div className="flex-1 h-1 bg-yellow-500"></div>

//           {/* Step 2 */}
//           <div className="flex flex-col items-center">
//             <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
//               2
//             </div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               Workflow Levels
//             </span>
//           </div>
//           <div className="flex-1 h-1 bg-yellow-500"></div>

//           {/* Step 3 */}
//           <div className="flex flex-col items-center">
//             <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
//               3
//             </div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               Work Flow Forms
//             </span>
//           </div>
//           <div className="flex-1 h-1 bg-yellow-500"></div>

//           {/* Step 4 */}
//           <div className="flex flex-col items-center">
//             <div className="w-8 h-8 bg-white border-2 border-yellow-500 rounded-full flex items-center justify-center">
//               4
//             </div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               Assign Employee
//             </span>
//           </div>
//         </div>

//         <Card className="w-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Assign Employee</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[
//                 "Group (*)",
//                 "Company (*)",
//                 "Head Office(Cor.Mgt)",
//                 "Divisions",
//                 "Province Office / Head office Departments",
//                 "District Office / HO Section / PO Section",
//                 "Branch / DO Section",
//                 "Extension Office",
//               ].map((field, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span className="w-64 text-sm">{field}</span>
//                   <Select>
//                     <SelectTrigger className="w-[300px]">
//                       <SelectValue placeholder="--- Select One ---" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="option1">Option 1</SelectItem>
//                       <SelectItem value="option2">Option 2</SelectItem>
//                       {/* Add more options as needed */}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 flex justify-between">
//               <div className="w-[45%]">
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Employee" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All</SelectItem>
//                     {/* Add more options as needed */}
//                   </SelectContent>
//                 </Select>
//                 <div className="mt-2">Unselected Users</div>
//                 <ScrollArea className="h-[200px] w-full border rounded">
//                   {allUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       className={`p-2 hover:bg-gray-100 cursor-pointer ${
//                         selectedUsers.includes(user) ? "bg-gray-200" : ""
//                       }`}
//                       onClick={() =>
//                         setSelectedUsers(
//                           selectedUsers.includes(user)
//                             ? selectedUsers.filter((u) => u !== user)
//                             : [...selectedUsers, user]
//                         )
//                       }
//                     >
//                       {user.name} ({user.id})
//                     </div>
//                   ))}
//                 </ScrollArea>
//               </div>

//               <div className="flex flex-col justify-center space-y-2">
//                 <Button onClick={handleAssign}>&gt;&gt;</Button>
//                 <Button onClick={handleUnassign}>&lt;&lt;</Button>
//               </div>

//               <div className="w-[45%]">
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Assigned Employee" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All</SelectItem>
//                     {/* Add more options as needed */}
//                   </SelectContent>
//                 </Select>
//                 <div className="mt-2">Selected Users</div>
//                 <ScrollArea className="h-[200px] w-full border rounded">
//                   {assignedUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       className={`p-2 hover:bg-gray-100 cursor-pointer ${
//                         selectedUsers.includes(user) ? "bg-gray-200" : ""
//                       }`}
//                       onClick={() =>
//                         setSelectedUsers(
//                           selectedUsers.includes(user)
//                             ? selectedUsers.filter((u) => u !== user)
//                             : [...selectedUsers, user]
//                         )
//                       }
//                     >
//                       {user.name} ({user.id})
//                     </div>
//                   ))}
//                 </ScrollArea>
//               </div>
//             </div>
//             <div className="mt-4 flex justify-between">
//               <Button
//                 variant="secondary"
//                 onClick={() => navigate("/Workflow-forms")}
//               >
//                 &lt;&lt; Back
//               </Button>
//               <Button onClick={handleSave}>Save</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </LayOut>
//   );
// };

// export default AssignEmployee;

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import LayOut from "../../../components/LayOut";

// const AssignEmployee = () => {
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [assignedUsers, setAssignedUsers] = useState([]);
//   const navigate = useNavigate(); // Initialize the useNavigate hook

//   const allUsers = [
//     { id: "0101498", name: "A A A Sandaruwan" },
//     { id: "0103307", name: "A A C L Thilakarathne" },
//     { id: "0103237", name: "A A D C Amarasinghe" },
//     { id: "0101580", name: "A A D P Aththanayaka" },
//     { id: "0103411", name: "A A G D K Wickramasinghe" },
//     { id: "0103308", name: "A A M Fernando" },
//     { id: "0100983", name: "A A M N Weerasinghe" },
//     { id: "0100699", name: "A A M Rifai" },
//     { id: "0103230", name: "A A N T Amarasinghe" },
//     // ... add more users as needed
//   ];

//   const handleAssign = () => {
//     setAssignedUsers([...assignedUsers, ...selectedUsers]);
//     setSelectedUsers([]);
//   };

//   const handleUnassign = () => {
//     setAssignedUsers(
//       assignedUsers.filter((user) => !selectedUsers.includes(user))
//     );
//     setSelectedUsers([]);
//   };

//   const handleSave = () => {
//     console.log("Save changes", assignedUsers);
//   };

//   return (
//     <LayOut>
//       <div className=" flex-col max-w-6xl ml-80 mt-48">
//         {/* Step Indicator */}
//         <div className="flex items-center justify-between w-full px-4 py-6">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
//               1
//             </div>
//             <div className="text-sm font-semibold">New Workflow</div>
//           </div>
//           <div className="w-24 h-1 bg-[#0095B7]" />
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
//               2
//             </div>
//             <div className="text-sm font-semibold">Workflow Levels</div>
//           </div>
//           <div className="w-24 h-1 bg-[#0095B7]" />
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
//               3
//             </div>
//             <div className="text-sm font-semibold">Workflow Forms</div>
//           </div>
//           <div className="w-24 h-1 bg-[#0095B7]" />
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
//               4
//             </div>
//             <div className="text-sm font-semibold text-black">
//               Create Request Type
//             </div>
//           </div>
//         </div>
//         <div className="mb-8 field section relative flex items-center justify-between space-x-4">
//           {/* First Step */}
//           <div className="relative flex flex-col items-center">
//             <div
//               className={`w-8 h-8 ${
//                 currentStep >= 0
//                   ? "bg-secondary"
//                   : "bg-white border-2 border-secondary"
//               } rounded-full flex items-center justify-center`}
//             ></div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               Required fields
//             </span>
//           </div>

//           {/* Line between first and second step */}
//           <div className="absolute top-3 left-10 w-64 h-2 bg-secondary"></div>

//           {/* Second Step */}
//           <div className="relative left-10 flex flex-col items-center">
//             <div
//               className={`w-8 h-8 ${
//                 currentStep >= 1
//                   ? "bg-secondary"
//                   : "bg-white border-2 border-secondary"
//               } rounded-full flex items-center justify-center`}
//             ></div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               Assign time
//             </span>
//           </div>

//           {/* Line between second and third step */}
//           <div className="absolute top-3 left-[326px] w-52 h-2 bg-secondary"></div>

//           {/* Third Step */}
//           <div className="relative left-12 flex flex-col items-center">
//             <div
//               className={`w-8 h-8 ${
//                 currentStep >= 2
//                   ? "bg-secondary"
//                   : "bg-white border-2 border-secondary"
//               } rounded-full flex items-center justify-center`}
//             ></div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               Create Form
//             </span>
//           </div>

//           {/* Line between third and fourth step */}
//           <div className="absolute top-3 right-20 w-[190px] h-2 bg-secondary"></div>

//           {/* Fourth Step */}
//           <div className="relative flex flex-col items-center">
//             <div
//               className={`w-8 h-8 ${
//                 currentStep >= 3
//                   ? "bg-secondary"
//                   : "bg-white border-2 border-secondary"
//               } rounded-full flex items-center justify-center`}
//             ></div>
//             <span className="mt-2 text-sm text-text3 dark:text-light1">
//               Create Request Type
//             </span>
//           </div>
//         </div>

//         <Card className="w-full">
//           <CardHeader>
//             <CardTitle className="text-xl font-bold">Assign Employee</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[
//                 "Group (*)",
//                 "Company (*)",
//                 "Head Office(Cor.Mgt)",
//                 "Divisions",
//                 "Province Office / Head office Departments",
//                 "District Office / HO Section / PO Section",
//                 "Branch / DO Section",
//                 "Extension Office",
//               ].map((field, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span className="w-64 text-sm">{field}</span>
//                   <Select>
//                     <SelectTrigger className="w-[300px]">
//                       <SelectValue placeholder="--- Select One ---" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="option1">Option 1</SelectItem>
//                       <SelectItem value="option2">Option 2</SelectItem>
//                       {/* Add more options as needed */}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 flex justify-between">
//               <div className="w-[45%]">
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Employee" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All</SelectItem>
//                     {/* Add more options as needed */}
//                   </SelectContent>
//                 </Select>
//                 <div className="mt-2">Unselected Users</div>
//                 <ScrollArea className="h-[200px] w-full border rounded">
//                   {allUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       className={`p-2 hover:bg-gray-100 cursor-pointer ${
//                         selectedUsers.includes(user) ? "bg-gray-200" : ""
//                       }`}
//                       onClick={() =>
//                         setSelectedUsers(
//                           selectedUsers.includes(user)
//                             ? selectedUsers.filter((u) => u !== user)
//                             : [...selectedUsers, user]
//                         )
//                       }
//                     >
//                       {user.name} ({user.id})
//                     </div>
//                   ))}
//                 </ScrollArea>
//               </div>

//               <div className="flex flex-col justify-center space-y-2">
//                 <Button onClick={handleAssign}>&gt;&gt;</Button>
//                 <Button onClick={handleUnassign}>&lt;&lt;</Button>
//               </div>

//               <div className="w-[45%]">
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Assigned Employee" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All</SelectItem>
//                     {/* Add more options as needed */}
//                   </SelectContent>
//                 </Select>
//                 <div className="mt-2">Selected Users</div>
//                 <ScrollArea className="h-[200px] w-full border rounded">
//                   {assignedUsers.map((user) => (
//                     <div
//                       key={user.id}
//                       className={`p-2 hover:bg-gray-100 cursor-pointer ${
//                         selectedUsers.includes(user) ? "bg-gray-200" : ""
//                       }`}
//                       onClick={() =>
//                         setSelectedUsers(
//                           selectedUsers.includes(user)
//                             ? selectedUsers.filter((u) => u !== user)
//                             : [...selectedUsers, user]
//                         )
//                       }
//                     >
//                       {user.name} ({user.id})
//                     </div>
//                   ))}
//                 </ScrollArea>
//               </div>
//             </div>
//             <div className="mt-4 flex justify-between">
//               <Button
//                 variant="secondary"
//                 onClick={() => navigate("/Workflow-forms")}
//               >
//                 &lt;&lt; Back
//               </Button>
//               <Button onClick={handleSave}>Save</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </LayOut>
//   );
// };

// export default AssignEmployee;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayOut from "../../../components/LayOut";

const AssignEmployee = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); // Ensure currentStep is initialized
  const navigate = useNavigate();

  const allUsers = [
    { id: "0101498", name: "A A A Sandaruwan" },
    { id: "0103307", name: "A A C L Thilakarathne" },
    { id: "0103237", name: "A A D C Amarasinghe" },
    { id: "0101580", name: "A A D P Aththanayaka" },
    { id: "0103411", name: "A A G D K Wickramasinghe" },
    { id: "0103308", name: "A A M Fernando" },
    { id: "0100983", name: "A A M N Weerasinghe" },
    { id: "0100699", name: "A A M Rifai" },
    { id: "0103230", name: "A A N T Amarasinghe" },
  ];

  const toggleUserSelection = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(user)
        ? prevSelected.filter((u) => u !== user)
        : [...prevSelected, user]
    );
  };

  const handleAssign = () => {
    setAssignedUsers((prevAssigned) => [
      ...prevAssigned,
      ...selectedUsers.filter((user) => !prevAssigned.includes(user)),
    ]);
    setSelectedUsers([]);
  };

  const handleUnassign = () => {
    setAssignedUsers((prevAssigned) =>
      prevAssigned.filter((user) => !selectedUsers.includes(user))
    );
    setSelectedUsers([]);
  };

  const handleSave = () => {
    console.log("Save changes:", assignedUsers);
    // Implement save logic (API call or state update)
  };

  return (
    <LayOut title="New Workflow">
      <div className="flex-col max-w-6xl ml-80 mt-48">
        {/* Step Indicator */}
        <div className="flex items-center justify-between w-full px-4 py-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
              1
            </div>
          </div>
          <div className="w-96 h-1 bg-[#0095B7]" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
              2
            </div>
          </div>
          <div className="w-96 h-1 bg-[#0095B7]" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
              3
            </div>
          </div>
          <div className="w-96 h-1 bg-[#0095B7]" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
              4
            </div>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Assign Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Group (*)",
                "Company (*)",
                "Head Office(Cor.Mgt)",
                "Divisions",
                "Province Office / Head office Departments",
                "District Office / HO Section / PO Section",
                "Branch / DO Section",
                "Extension Office",
              ].map((field, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-64 text-sm">{field}</span>
                  <Select>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="--- Select One ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <div className="w-[45%]">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">Unselected Users</div>
                <ScrollArea className="h-[200px] w-full border rounded">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${
                        selectedUsers.includes(user) ? "bg-gray-200" : ""
                      }`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      {user.name} ({user.id})
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div className="flex flex-col justify-center space-y-2">
                <Button onClick={handleAssign}>&gt;&gt;</Button>
                <Button onClick={handleUnassign}>&lt;&lt;</Button>
              </div>

              <div className="w-[45%]">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assigned Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">Selected Users</div>
                <ScrollArea className="h-[200px] w-full border rounded">
                  {assignedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${
                        selectedUsers.includes(user) ? "bg-gray-200" : ""
                      }`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      {user.name} ({user.id})
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Button
                variant="secondary"
                onClick={() => navigate("/Workflow-forms")}
              >
                &lt;&lt; Back
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayOut>
  );
};

export default AssignEmployee;
