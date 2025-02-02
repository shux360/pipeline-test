import LayOut from "@/components/LayOut";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

  // const [levels, setLevels] = useState([
  //   {
  //     id: 1,
  //     approvalLevel: "Approver 1",
  //     levelType: "1st Reporting Person",
  //     authPerson: "Reporting Person",
  //     allowBypass: false,
  //     allowRevert: false,
  //   },
  //   {
  //     id: 2,
  //     approvalLevel: "Approver 2",
  //     levelType: "Static",
  //     authPerson: "P E D S Perera",
  //     allowBypass: false,
  //     allowRevert: false,
  //   },
  // ]);

// const [levels, setLevels] = useState([]);
// const { workflowId } = location.state;



const WorkFlowLevels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workflowId } = useParams();
  // const { noOfLevels } = location.state || { noOfLevels: 2 }; // Default to 2 if not provided
  const [editing, setEditing] = useState(false);

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };
  console.log("locaation", location);
  const {
    workflowName,
    workflowDescription,
    noOfLevels,
    workflowType,
    levels: initialLevels,
  } = location.state || {};


  const [levels, setLevels] = useState(() => {
    if (initialLevels && initialLevels.length > 0) {
      
      return initialLevels;
    } else {
      return Array.from({ length: noOfLevels || 2 }, (_, index) => ({
        id: index + 1,
        approvalLevel: `Approver ${index + 1}`,
        levelType: "",
        authPerson: "",
        allowBypass: false,
        allowRevert: false,
      }));
    }
  });

    useEffect(() => {
      if (initialLevels && initialLevels.length > 0) {
        setEditing(true);
      }
    }, [initialLevels]);
  
    //fetch all users
    const [users, setUsers] = useState([]);
    useEffect(() => {
      const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/users`, { headers });
        setUsers(response.data);
        console.log("Users", response.data);

        // // Add fetched users to the Static section in authorizedPersons
        // authorizedPersons.Static = response.data.map(user => user.name);
      } catch (error) {
        console.error("Error fetching users", error);
      }
      };
      fetchUsers();
    }, []);
  
    // useEffect(() => {
    //   if (workflowId && users.length > 0) {
    //     const fetchWorkflow = async () => {
    //       try {
    //         const response = await axios.get(`${backendUrl}/workflows/${workflowId}`, { headers });
    //         const { noOfWorkflowLevel, workflowLevels } = response.data;
    //         console.log("Workflow xx", response.data);
    //         console.log("Workflow levels", workflowLevels);
    
    //         if (workflowLevels && workflowLevels.length > 0) {
    //           setEditing(true);
    //           // If workflow levels exist, set them for updating
    //           setLevels(workflowLevels.map((level, index) => ({
    //             id: level.id,
    //             approvalLevel: level.approvalLevel || `Approver ${index + 1}`,
    //             levelType: level.levelType,
    //             authPerson: level.authPerson,
    //             allowBypass: level.allowBypass,
    //             allowRevert: level.allowRevert,
    //           })));
    //         } else {
    //           // If no workflow levels exist, create default levels
    //           setLevels(
    //             Array.from({ length: noOfWorkflowLevel }, (_, i) => ({
    //               id: i + 1,
    //               approvalLevel: `Approver ${i + 1}`,
    //               levelType: "",
    //               authPerson: "",
    //               allowBypass: false,
    //               allowRevert: false,
    //             }))
    //           );
    //         }
    //       } catch (error) {
    //         console.error("Error fetching workflow data", error);
    //       }
    //     };
    //     fetchWorkflow();
    //   }
    // }, [workflowId, users]);
    

  // const [levels, setLevels] = useState(() => {
  //   // Generate levels based on the passed number
  //   return Array.from({ length: noOfLevels }, (_, index) => ({
  //     id: index + 1,
  //     approvalLevel: `Approver ${index + 1}`,
  //     levelType:  "", // Example logic
  //     authPerson: "",
  //     allowBypass: false,
  //     allowRevert: false,
  //   }));
  // });

  // Sample list of authorized persons based on level type
  const authorizedPersons = {
    STATIC: users.map((user) => user.userProfile?.name || "Unknown"),
    DESIGNATION: [
      "Board of Director",
      "Chairman",
      "General Manager / CEO",
      "Deputy General Manager / Chief Information Officer / Chief Risk Officer / Head of Finance",
      "Regional General Manager / Senior Assistant General Manager",
      "Assistant General Manager",
      "Chief Manager / District Manager",
      "Senior Manager",
      "Manager / Secretary-I",
      "Deputy Manager / Secretary-II",
      "Assistant Manager / Secretary-III",
      "Management Trainee",
      "Banking Assistant-III / Stenographer-III",
      "Banking Assistant-II / Stenographer-II",
      "Banking Assistant-I / Stenographer-I",
      "Typist-III",
      "Typist-II",
      "Typist-I",
      "Driver-III",
      "Driver-II",
      "Driver-I",
      "Office Assistant-III",
      "Office Assistant-II",
      "Office Assistant-I",
      "Laborer-III",
      "Laborer-II",
      "Laborer-I",
      "Trainee Banking Assistant",
    ],
    GRADE: [
      "Grade 1",
      "Grade 2",
      "Special Grade I",
      "Special Grade II",
      "Special Grade III",
      "Special Grade IV",
      "Officer Grade I",
      "Officer Grade II",
      "Officer Grade 3-I",
      "Officer Grade 3-II",
      "Officer Grade 3-III",
      "Officer Grade IV",
      "Grade 5-III",
      "Grade 5-II",
      "Grade 5-I",
      "Grade 6-III",
      "Grade 6-II",
      "Grade 6-I",
      "Grade 7-III",
      "Grade 7-II",
      "Grade 7-I",
      "Grade 8-III",
      "Grade 8-II",
      "Grade 8-I",
      "Grade 9-III",
      "Grade 9-II",
      "Grade 9-I",
      "Grade 5-I (Trainee)",
    ],
    FIRST_REPORTING_PERSON: ["1st Reporting Person"],
    SECOND_REPORTING_PERSON: ["2nd Reporting Person"],
    DEPARTMENT_HEAD: ["Department Head 1", "Department Head 2"],
  };
  

  // useEffect(() => {
  //   const fetchWorkflow = async () => {
  //     try {
  //       const response = await axios.get(`${backendUrl}/workflows/${workflowId}`, { headers });
  //       const { noOfWorkflowLevel, levels } = response.data;
  //       setLevels(
  //         levels || Array.from({ length: noOfWorkflowLevel }, (_, i) => ({
  //           id: i + 1,
  //           approvalLevel: `Approver ${i + 1}`,
  //           levelType: "",
  //           authPerson: "",
  //           allowBypass: false,
  //           allowRevert: false,
  //         }))
  //       );
  //     } catch (error) {
  //       console.error("Error fetching workflow data", error);
  //     }
  //   };
  //   if (workflowId) fetchWorkflow();
  // }, [workflowId]);

  // const handleSave = async () => {
  //   try {
  //     await axios.post(`${backendUrl}/workflows/step2/${workflowId}`, levels, { headers });
  //     console.log("Workflow levels saved successfully");
  //     toast.success("Workflow Step2 saved successfully");
  //   } catch (error) {
  //     console.error("Error saving workflow levels", error);
  //     toast.error("Failed to save workflow levels.");
  //   }
  // };

  const handleSave = async () => {
    try {
      if (editing) {
        // Update existing workflow levels
        await axios.put(`${backendUrl}/workflows/editWorkflowLevel/${workflowId}`, levels, { headers });
        toast.success("Workflow Levels updated successfully");
      } else {
        // Create new workflow levels
        await axios.post(`${backendUrl}/workflows/step2/${workflowId}`, levels, { headers });
        toast.success("Workflow Levels created successfully");
      }
    } catch (error) {
      console.error("Error saving workflow levels", error);
      toast.error("Failed to save workflow levels.");
    }
  };

  const handleLevelTypeChange = (id, value) => {
    setLevels((prev) =>
      prev.map((level) =>
        level.id === id ? { ...level, levelType: value, authPerson: "" } : level
      )
    );
  };

  const handleAuthPersonChange = (id, value) => {
    setLevels((prev) =>
      prev.map((level) =>
        level.id === id ? { ...level, authPerson: value } : level
      )
    );
  };

  const handleCheckboxChange = (id, field) => {
    setLevels((prev) =>
      prev.map((level) =>
        level.id === id ? { ...level, [field]: !level[field] } : level
      )
    );
  };

  const handleDeleteLevel = (id) => {
    setLevels((prev) => prev.filter((level) => level.id !== id));
  };

  const handleSaveChanges  = async () => {
    try {
      await axios.post(`${backendUrl}/workflows/step2/${workflowId}`, levels, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Workflow Step 2 saved successfully");
    } catch (error) {
      console.error("Error saving workflow levels:", error);
      toast.error("Failed to save workflow levels.");
    }
  };

  const handleBack = () => {
    if (workflowId) {
      navigate(`/new-workflow/${workflowId}`);
    } else {
      toast.error("Cannot navigate back without a workflow ID.");
    }
  };

  return (
    <LayOut title={editing?"Edit Workflow Levels":"New Workflow evels"}>
      <div className="max-w-6xl ml-80 mt-48">
        {/* Step Indicator */}
        {/* <div className="flex items-center justify-between w-full px-4 py-6">
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
          <div className="w-96 h-1 bg-black" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">
              3
            </div>
          
          </div>
          <div className="w-96 h-1 bg-black" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">
              4
            </div>
           
          </div>
        </div> */}

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Work Flow Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Delete</TableHead>
                  <TableHead>Approval Level</TableHead>
                  <TableHead>Level Type</TableHead>
                  <TableHead>Auth. Person / Group / Conditional</TableHead>
                  <TableHead className="w-[100px]">Allow Bypass</TableHead>
                  <TableHead className="w-[100px]">Allow Revert</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levels.map((level) => (
                  
                  <TableRow key={level.id}>
                    <TableCell>
                      <Button onClick={() => handleDeleteLevel(level.id)}>
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell>{level.approvalLevel}</TableCell>
                    <TableCell>
                      <Select
                        value={level.levelType || ""}
                        onValueChange={(value) =>
                          handleLevelTypeChange(level.id, value)
                        }
                        defaultValue={level.levelType}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select level type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(authorizedPersons).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {level.levelType && authorizedPersons[level.levelType]?.length > 0 ? (
                        <Select
                          onValueChange={(value) =>
                            handleAuthPersonChange(level.id, value)
                          }
                          value={level.authPerson}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Auth Person" />
                          </SelectTrigger>
                          <SelectContent>
                            {authorizedPersons[level.levelType].map((person) => (
                              <SelectItem key={person} value={person}>
                                {person}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={level.authPerson}
                          onChange={(e) =>
                            handleAuthPersonChange(level.id, e.target.value)
                          }
                          placeholder="Enter auth person"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={level.allowBypass}
                        onCheckedChange={() =>
                          handleCheckboxChange(level.id, "allowBypass")
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={level.allowRevert}
                        onCheckedChange={() =>
                          handleCheckboxChange(level.id, "allowRevert")
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between">
              <Button
                variant="secondary"
                onClick={handleBack}
              >
                &lt;&lt; Back
              </Button>
              <Button onClick={handleSave}>{ editing ? "Update" : "Save" }</Button>
              {/* <Button
                variant="secondary"
                onClick={() => navigate("/workflow-forms")}
              >
                Next &gt;&gt;
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayOut>
  );
};

export default WorkFlowLevels;
