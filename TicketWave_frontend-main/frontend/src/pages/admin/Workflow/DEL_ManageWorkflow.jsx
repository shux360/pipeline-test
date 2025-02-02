//WorkflowDetails.jsx implemetation

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";

const ManageWorkFlows = () => {
  const [workFlowName, setWorkFlowName] = useState("");
  const [workFlowDescription, setWorkFlowDescription] = useState("");
  const [noOfLevels, setNoOfLevels] = useState("");
  const [workFlowType, setWorkFlowType] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    // Implement save logic here
    toast({
      title: "Work Flow Saved",
      description: "Your work flow has been successfully saved.",
    });
  };

  const handleRefresh = () => {
    // Implement refresh logic here
    setWorkFlowName("");
    setWorkFlowDescription("");
    setNoOfLevels("");
    setWorkFlowType("");
    toast({
      title: "Form Refreshed",
      description: "The form has been reset.",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-600">
            Manage Work Flows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Flow Name(*)
              </label>
              <Input
                value={workFlowName}
                onChange={(e) => setWorkFlowName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Flow Description
              </label>
              <Textarea
                value={workFlowDescription}
                onChange={(e) => setWorkFlowDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  No of Levels(*)
                </label>
                <Input
                  type="number"
                  value={noOfLevels}
                  onChange={(e) => setNoOfLevels(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Work Flow Type(*)
                </label>
                <Select
                  value={workFlowType}
                  onValueChange={setWorkFlowType}
                  className="mt-1"
                >
                  <option value="">--Select One--</option>
                  <option value="dynamic">Dynamic</option>
                  <option value="static">Static</option>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </Button>
              <Button
                onClick={handleRefresh}
                className="bg-gray-300 hover:bg-gray-400 text-black"
              >
                Refresh
              </Button>
              <Button className="bg-gray-300 hover:bg-gray-400 text-black">
                Button 3
              </Button>
              <Button className="bg-gray-300 hover:bg-gray-400 text-black">
                Button 4
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageWorkFlows;
