import LayOut from "@/components/LayOut";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const NewWorkflow = () => {
  const navigate = useNavigate();
  const { workflowId } = useParams();
  const [currentStep, setCurrentStep] = useState(0); // Define currentStep state
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [selectedWorkflowType, setSelectedWorkflowType] = useState("DYNAMIC");
  const [noOfLevels, setNoOfLevels] = useState(1);
  const [currentWorkflowId, setCurrentWorkflowId] = useState(workflowId || "");
  const [levels, setLevels] = useState([]); 

  console.log("workflowId", workflowId);
  // const [WorkflowData, setWorkflowData] = useState({
  //     WorkflowId: "",
  //     workflowName: workflowName,
  //     workflowDescription: workflowDescription,
  //     noOfWorkflowLevel: noOfLevels,
  //     workflowType: selectedWorkflowType.toUpperCase(),
  // });
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };
  

  const handleNext = () => {
    if (currentWorkflowId) {
      navigate(`/workflow-levels/${currentWorkflowId}`, {
        state: {
          workflowId: currentWorkflowId,
          workflowName,
          workflowDescription,
          noOfLevels,
          workflowType: selectedWorkflowType,
          levels, 
        },
      });
    } else {
      toast.error("Please save the workflow before proceeding to the next step.");
    }
  };

  const handleSave = async () => {
    
  
    const workflowData = {
      workflowName: workflowName,
      workflowDescription: workflowDescription,
      noOfWorkflowLevel: noOfLevels,
      workflowType: selectedWorkflowType.toUpperCase(),
    };
  
    try {
      if (workflowId) {
        // Update existing workflow
        await axios.put(`${backendUrl}/workflows/editWorkflow/${workflowId}`, workflowData, { headers });
        toast.success("Workflow updated successfully");
      } else {
      //create new workflow
      const response = await axios.post(`${backendUrl}/workflows/step1`, workflowData, { headers });
      console.log("Workflow created:", response.data);
      setCurrentWorkflowId(response.data.workflowId);
      setWorkflowName(response.data.workflowName);
      setWorkflowDescription(response.data.workflowDescription);
      setNoOfLevels(response.data.noOfWorkflowLevel);
      setSelectedWorkflowType(response.data.workflowType);

      toast.success("Step1 Saved Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Saved Step1");

    }
  };

  const fetchWorkflowDetails = async () => {
    if (workflowId) {
      try {
        const response = await axios.get(`${backendUrl}/workflows/${workflowId}`, 
          { headers }
        );
        console.log("Workflow details:", response.data);
        const workflow = response.data;
        setWorkflowName(workflow.workflowName);
        setWorkflowDescription(workflow.workflowDescription);
        setNoOfLevels(workflow.noOfWorkflowLevel);
        setSelectedWorkflowType(workflow.workflowType);

        if (workflow.workflowLevels && workflow.workflowLevels.length > 0) {
          setLevels(
            workflow.workflowLevels.map((level) => ({
              id: level.id,
              approvalLevel: level.approvalLevel,
              levelType: level.levelType,
              authPerson: level.authPerson,
              allowBypass: level.allowBypass,
              allowRevert: level.allowRevert,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch workflow details", error);
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  }
  useEffect(() => {
    fetchWorkflowDetails();
  }, []);

  // const handleNext = () => {
  //   navigate("/workflow-levels", { state: { noOfLevels } });
  // };

  // Calculate progress value based on current step
  const progressValue = ((currentStep + 1) / 4) * 100;

  return (
    <LayOut title={workflowId?"Edit Workflow":"New Workflow"}>
      <div className=" max-w-4xl ml-96 mt-36">
     

        {/* <div className="flex items-center justify-between w-full px-4 py-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#0095B7] flex items-center justify-center text-white font-bold">
              1
            </div>
           
          </div>
          <div className="w-60 h-1 bg-black" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">
              2
            </div>
          
          </div>
          <div className="w-60 h-1 bg-black" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">
              3
            </div>
            
          </div>
          <div className="w-60 h-1 bg-black" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">
              4
            </div>
          
          </div>
        </div> */}

        <Card className="max-w-4xl max-h-lvh px-10 mb-10">
          <CardHeader>
            <CardTitle>Create new workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="workflowName"
                  className="block text-sm font-medium mb-1"
                >
                  Workflow name
                </label>
                <Input
                  id="workflowName"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  
                />
              </div>
              <div>
                <label
                  htmlFor="workflowDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Workflow description
                </label>
                <textarea
                  id="workflowDescription"
                  className="w-full h-24 px-3 py-2 border rounded-md dark:bg-transparent"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="noOfLevels"
                  className="block text-sm font-medium mb-1"
                >
                  No of levels
                </label>
                <Input
                  id="noOfLevels"
                  type="number"
                  value={noOfLevels}
                  onChange={(e) => setNoOfLevels(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="workflowType"
                  className="block text-sm font-medium mb-1"
                >
                  Workflow Type
                </label>
                <Select
                  value={selectedWorkflowType}
                  onValueChange={setSelectedWorkflowType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DYNAMIC">Dynamic</SelectItem>
                    <SelectItem value="STATIC">Static</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 flex justify-between">
                <Button onClick={handleSave}>{workflowId?"Update":"Save"}</Button>
                {/* <Button>Refresh</Button>
                <Button>Delete</Button> */}

                <Button onClick={handleNext} variant="secondary">
                  Next &gt;&gt;
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </LayOut>
  );
};

export default NewWorkflow;
