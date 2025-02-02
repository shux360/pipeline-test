import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "@/components/LayOut";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Combobox from "./ComboBoxWorkflow";
import { Button } from "@/components/ui/button";
import DatePicker from 'react-datepicker';
import ComboboxUser from "@/components/Combobox";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const FormSubmit = () => {
  const { requestId } = useParams();
  const [formData, setFormData] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("");
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [approver1, setApprover1] = useState(null);
  const [approver1Users, setApprover1Users] = useState([]);
  const [StaticApprover1, setStaticApprover1] = useState(null);
  const [firstApproverData, setFirstApproverData] = useState("");

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };

  // Fetch form data and workflows from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse, workflowsResponse] = await Promise.all([
          axios.get(`${backendUrl}/forms/${requestId}`, { headers }),
          axios.get(`${backendUrl}/workflows/by-request/${requestId}`, { headers })
        ]);

        console.log("Form data:", formResponse.data);
        console.log("Workflows data:", workflowsResponse.data);

        setFormData(formResponse.data);
        setWorkflows(workflowsResponse.data);

        const hasUserAssignElement = formResponse.data.elements.some(
          (element) => element.type === 'user assign'
        );
        // Fetch users only if there is at least one 'user assign' element
        if (hasUserAssignElement) {
          const usersResponse = await axios.get(`${backendUrl}/user-ids-and-names`, { headers });
          console.log("Users data:", usersResponse.data);
          setUsers(usersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId]);

  const handleInputChange = (elementId, value) => {
    if (typeof value === "object" && value !== null && value.assignedUser) {
      value = value.assignedUser.toString(); 
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      [elementId]: value,
    }));
    console.log("Form values:", formValues);
  };

  useEffect(() => {
    console.log("Updated firstApproverData:", firstApproverData);
  }, [firstApproverData]);

  const handleApprover1Select = (selectedUserId) => {
    console.log("Selected user ID:", selectedUserId);
    const selectedUser = approver1Users.find(user => user.userId.toString() === selectedUserId);
    setFirstApproverData(selectedUser);
    // console.log("Selected approver 1:", firstApproverData);
  };

  // Handle workflow selection
  const handleWorkflowSelect = async (workflowId) => {
    setSelectedWorkflowId(workflowId);
    setFormValues((prevValues) => ({
      ...prevValues,
      workflowId,
    }));
    console.log("Selected workflowID:", workflowId);

    // Fetch the selected workflow details
    const selectedWorkflow = workflows.find(w => w.workflowId.toString() === workflowId);
    setSelectedWorkflow(selectedWorkflow);
    console.log("Selected workflow:", selectedWorkflow);
    if (selectedWorkflow) {
      const firstLevel = selectedWorkflow.workflowLevels[0];
      console.log("First level:", firstLevel);
      let approver = null;

      if (firstLevel.levelType === "FIRST_REPORTING_PERSON") {
        // Fetch the immediate reporting person of the current user
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const first_reporting_person_ID= currentUser.user.userProfile.nextReportingPerson;
        const response = await axios.get(`${backendUrl}/user-id-name/${first_reporting_person_ID}`, { headers });
        approver = response.data;
        setApprover1Users([]);
        setApprover1(approver);

      } else if (firstLevel.levelType === "DESIGNATION") {
        // Fetch users with the specified designation
        const response = await axios.get(`${backendUrl}/users-by-designation/${firstLevel.authPerson}`, { headers });
        setApprover1("");
        setApprover1Users(response.data);

      } else if (firstLevel.levelType === "GRADE") {
        // Fetch users with the specified grade
        const response = await axios.get(`${backendUrl}/users-by-grade/${firstLevel.authPerson}`, { headers });
        setApprover1("");
        setApprover1Users(response.data); 

      } else if (firstLevel.levelType === "STATIC") {
        // Use the authPerson name directly
        approver = { name: firstLevel.authPerson };
        setApprover1Users([]);
        setApprover1("");
        setStaticApprover1(approver);
      }

      
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!selectedWorkflow || !selectedWorkflow.workflowLevels || selectedWorkflow.workflowLevels.length === 0) {
        toast.error("No workflow selected or workflow levels are missing.");
        return;
      }
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const requesterId = currentUser.user.userProfile.userId;
      console.log("Requester ID:", requesterId);

      const formDataForSubmission = Object.keys(formValues).map((elementId) => ({
        elementId,
        value: formValues[elementId], 
      }));
      console.log("Form data for submission:", formDataForSubmission);
  
      // Determine the current approver ID and level
      const currentApproverId = firstApproverData ? firstApproverData.userId : approver1 ? approver1.userId : StaticApprover1 ? StaticApprover1.userId : null;
      
      const currentWorkflowLevelNumber = 1;
      const workflowLength = selectedWorkflow.workflowLevels.length;

      const currentApproverLevel = selectedWorkflow.workflowLevels[0].approvalLevel;
      // console.log("Current approver ID:", currentApproverId);
      // console.log("Current approver level:", currentApproverLevel);
  
      // Determine the currentApproverLevelId and nextApproverLevelId
      const currentApproverLevelId = selectedWorkflow.workflowLevels[0].id;
      const nextApproverLevelId = selectedWorkflow.workflowLevels[1]?.id || null;
      // console.log("Current approver level ID:", currentApproverLevelId);
      // console.log("Next approver level ID:", nextApproverLevelId);
  
      const response = await axios.post(
        `${backendUrl}/request-submissions/submit`,
        formDataForSubmission,
        {
          params: {
            requestId,
            workflowId: selectedWorkflow.workflowId,
            requesterId,
            currentApproverId,
            currentApproverLevel,
            currentApproverLevelId,
            nextApproverLevelId,
            currentWorkflowLevelNumber,
            workflowLength
          },
          headers,
        }
      );
  
      toast.success("Form submitted successfully!");
      console.log("Form submission response:", response.data);
    } catch (error) {
      toast.error("Error submitting form: " + error.message);
      console.error("Error submitting form:", error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout title="Submit Form">
      <div className="md:ml-64 p-8 min-h-screen flex justify-center items-center bg-gray-50 dark:bg-dark2">
        {loading ? (
          <div>
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            Loading Form
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white dark:bg-dark3 rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-indigo-900 dark:text-white">
                Form for Request ID: {requestId}
              </h1>
            </div>

            {/* Form Section */}
            <form className="space-y-4">
              {formData.elements.map((element) => (
                <div key={element.id} className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    {element.label}
                    {element.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderFormElement(element, handleInputChange, users)}
                </div>
              ))}
              {/* <Button
                type="submit"
                className="w-full mt-6 px-4 py-2 "
              >
                Save Form
              </Button> */}
            </form>

            {/* Separator */}
            <div className="my-8 border-t border-gray-300 dark:border-gray-600"></div>

            {/* Workflow Dropdown Section */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-indigo-900 dark:text-white mb-4">
                Select Workflow
              </h2>
              <Combobox
                items={workflows.map((workflow) => ({
                  id: workflow.workflowId.toString(),
                  name:  workflow.identificationString,
                }))}
                value={selectedWorkflowId}
                onSelect={handleWorkflowSelect}
                />
                
              {/* Approver 1 Section */}
              {approver1 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-indigo-900 dark:text-white mb-4">
                    Approver 1
                  </h2>
                  <div className="bg-gray-100 p-4 rounded">
                    {approver1.name}
                  </div>
                </div>
              )}
              {approver1Users.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-indigo-900 dark:text-white mb-4">
                  Select Approver 1
                </h2>
                <ComboboxUser
                  users={approver1Users}
                  onSelect={handleApprover1Select}
                />
              </div>
                )}
                {StaticApprover1 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-bold text-indigo-900 dark:text-white mb-4">
                      Approver 1
                    </h2>
                    <div className="bg-gray-100 p-4 rounded">
                      {StaticApprover1.name}
                    </div>
                  </div>
                )}
              </div>
               <div className="mt-8">
                <Button onClick={handleSubmit}
                  type="submit" className="w-full">
                  Send Request
                </Button>
              </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Helper function to render form elements
const renderFormElement = (element, handleInputChange,users) => {
  const { id, type, placeholder, required, options, accept,startDate, endDate, assignedUser } = element;

  switch (type) {
    case "text":
      return (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full p-2 border rounded"
          required={required}
          onChange={(e) => handleInputChange(id, e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          placeholder={placeholder}
          className="w-full p-2 border rounded"
          required={required}
          onChange={(e) => handleInputChange(id, e.target.value)}
        />
      );
    case "select":
      return (
        <select
          className="w-full p-2 border rounded"
          required={required}
          onChange={(e) => handleInputChange(id, e.target.value)}
        >
          <option value="">Select an option</option>
          {options.map((option, i) => (
            <option key={i} value={option.optionValue}>
              {option.optionValue}
            </option>
          ))}
        </select>
      );
    case "checkbox":
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            required={required}
            className="mr-2"
            onChange={(e) => handleInputChange(id, e.target.checked)}
          />
          <span>{placeholder}</span>
        </div>
      );
    case "radio":
      return (
        <div>
          {options.map((option, i) => (
            <div key={i} className="flex items-center mb-1">
              <input
                type="radio"
                name={`radio-${id}`}
                required={required}
                className="mr-2"
                value={option.optionValue}
                onChange={(e) => handleInputChange(id, e.target.value)}
              />
              <span>{option.optionValue}</span>
            </div>
          ))}
        </div>
      );
    case "file":
      return (
        <input
          type="file"
          accept={accept}
          required={required}
          className="w-full p-2 border rounded"
          onChange={(e) => handleInputChange(id, e.target.files[0])}
        />
      );
    case 'date picker':
      return (
        <DatePicker
          selectsRange
          placeholderText='Select the date'
          startDate={startDate}
          endDate={endDate}
          onChange={(dates) => handleInputChange(id, { startDate: dates[0], endDate: dates[1] })}
          isClearable
          className="w-full p-2 border rounded"
          />
    );
    case 'user assign':
      return (
        <ComboboxUser
          users={users} // Pass the fetched users
          className="w-full p-2 border rounded" // Add your desired className
          value={assignedUser} // Pass the current value
          onSelect={(selectedUserId) => {
            handleInputChange(id, { assignedUser: selectedUserId }); 
            }}
         required={required} // Pass the required prop
          />
    );
    default:
      return null;
  }
};

export default FormSubmit;