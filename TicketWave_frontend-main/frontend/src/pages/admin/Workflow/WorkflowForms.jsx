import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LayOut from "../../../components/LayOut";

const WorkFlowForms = () => {
  const navigate = useNavigate(); // Get navigate function for navigation
  const [selectedTab, setSelectedTab] = useState("Administration");
  const [forms, setForms] = useState([
    {
      id: 1,
      name: "Acting Promotion Request",
      description: "Acting Promotion Request",
      granted: false,
    },
    {
      id: 2,
      name: "Admin Transfer Request",
      description: "Admin Transfer Request",
      granted: false,
    },
    {
      id: 3,
      name: "Annual Transfer Appeal",
      description: "Annual Transfer Appeal",
      granted: false,
    },
    {
      id: 4,
      name: "Annual Transfer Request",
      description: "Annual Transfer Request",
      granted: false,
    },
    {
      id: 5,
      name: "Confirmation Evaluation (Before 3 Months)",
      description: "Confirmation Evaluation",
      granted: false,
    },
    {
      id: 6,
      name: "Confirmation Process",
      description: "Confirmation Process",
      granted: false,
    },
    {
      id: 7,
      name: "Critical Illness Amount Approved",
      description: "Critical Illness Approved",
      granted: false,
    },
    {
      id: 8,
      name: "Critical Illness Claim",
      description: "Critical Illness Claim",
      granted: false,
    },
    {
      id: 9,
      name: "Critical Illness Claim HR",
      description: "Critical Illness HR",
      granted: false,
    },
    { id: 10, name: "Critical HR", description: "Critical HR", granted: false },
  ]);

  const handleCheckboxChange = (id) => {
    setForms(
      forms.map((form) =>
        form.id === id ? { ...form, granted: !form.granted } : form
      )
    );
  };

  return (
    <LayOut title="New Workflow">
      <div className="max-w-4xl mx-auto mt-36 mb-16 ">
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
          <div className="w-96 h-1 bg-black" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold">
              4
            </div>
          </div>
        </div>

        <Card className="max-w-4xl px-10 mb-10">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Work Flow Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="Administration">Administration</TabsTrigger>
                <TabsTrigger value="Attendance">Attendance</TabsTrigger>
                <TabsTrigger value="Benefit">Benefit</TabsTrigger>
                <TabsTrigger value="OHS">OHS</TabsTrigger>
                <TabsTrigger value="Recruitment">Recruitment</TabsTrigger>
                <TabsTrigger value="Training">Training</TabsTrigger>
              </TabsList>
              <TabsContent value={selectedTab}>
                <ScrollArea className="h-[400px] w-full border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Grant</TableHead>
                        <TableHead>Form Name</TableHead>
                        <TableHead>Form Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {forms.map((form) => (
                        <TableRow key={form.id}>
                          <TableCell>
                            <Checkbox
                              checked={form.granted}
                              onCheckedChange={() =>
                                handleCheckboxChange(form.id)
                              }
                            />
                          </TableCell>
                          <TableCell>{form.name}</TableCell>
                          <TableCell>{form.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
            <div className="mt-4 flex justify-between">
              <Button
                variant="secondary"
                onClick={() => navigate("/Workflow-levels")}
              >
                &lt;&lt; Back
              </Button>
              <Button>Save</Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/Assign-employee")}
              >
                Next &gt;&gt;
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayOut>
  );
};

export default WorkFlowForms;
