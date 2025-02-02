import { useRef, useState, useEffect } from "react";
import LayOut from "../../../components/LayOut";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormBuilder from "../../../components/FormBuilder";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import CheckboxDropdown from "../../../components/DropDownCheck";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const NewRequestType = () => {
  const { urlRequestId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [roles, setRoleName] = useState([]);
  const [formData, setFormData] = useState({
    requestCategory: "",
    priority: "",
    requestName: "",
    requestCode: "",
    attachmentsAllowed: "",
    roles: [], // Changed to array to handle multiple roles
  });
  const [requestId, setRequestId] = useState(null);
  const [formElements, setFormElements] = useState([]);
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };

  const formBuilderRef = useRef(null);

  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoleName = async () => {
      try {
        const response = await axios.get(`${backendUrl}/roles`, { headers });
        setRoleName(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles. Please try again.");
      }
    };
    fetchRoleName();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (selectedRoles) => {
    setFormData((prev) => ({ ...prev, roles: selectedRoles }));
  };


  useEffect(() => {
    if (urlRequestId) {
      const fetchRequestData = async () => {
        try {
          const response = await axios.get(`${backendUrl}/requests/${urlRequestId}`, { headers });
          const data = response.data;
          console.log("Request data fetched:", data);
          const roleNames = data.roles.map((role) => role.roleName);
          setFormData({
            requestCategory: data.requestCategory,
            priority: data.priority,
            requestName: data.requestName,
            requestCode: data.requestCode,
            attachmentsAllowed: data.attachmentsAllowed,
            roles: roleNames // Ensure roles is an array
          });
          console.log("Form Data:", formData);
          console.log("Request data fetched:", data);
        } catch (error) {
          console.error("Error fetching request data:", error);
          toast.error("Failed to load request data. Please try again.");
        }
      };
      fetchRequestData();
    }
  }, [urlRequestId]);

  const nextStep = async () => {
    if (currentStep === 0) {
      if (currentStep === 0 && urlRequestId) {
        try {
          const formResponse = await axios.get(`${backendUrl}/forms/${urlRequestId}`, { headers });
          console.log("Form Response:", formResponse.data);
          setFormElements(formResponse.data.elements);
        } catch (error) {
          console.error("Error fetching form elements:", error);
          toast.error("Failed to load form elements. Please try again.");
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      const completeData = {
        ...formData,
        roles: formData.roles,
      };

      let response;
      if (urlRequestId) {
        // Update existing request
        
        response = await axios.put(`${backendUrl}/requests/${urlRequestId}`, completeData, { headers });
        toast.success("Request updated successfully!");
      } else {
        // Create new request
        console.log("Updating request with data:", completeData);
        response = await axios.post(`${backendUrl}/requests/create-request`, completeData, { headers });
        console.log("Response from backend:", response.data);
        setRequestId(response.data.requestId);
        toast.success("Request created successfully!");
      }

      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending step0 data to backend:", error);
      toast.error("Failed to create request type. Please try again.");
    }
  };

  return (
    <LayOut title="New Request Type">
      <div className="w-full max-w-4xl my-20 mx-auto p-6 rounded-lg">
        <h1 className="text-2xl font-semibold text-text3 dark:text-light1 mb-16">
          Create new request type
        </h1>

        {currentStep === 0 && (
          <form className="space-y-8 mt-16">
            {[
              {
                label: "Request Category",
                field: "requestCategory",
                options: ["Category 1", "Category 2"],
                value: formData.requestCategory,
              },
              {
                label: "Priority",
                field: "priority",
                options: ["High", "Medium", "Low"],
                value: formData.priority,
              },
              { label: "Request Name", field: "requestName", value: formData.requestName },
              { label: "Request Code", field: "requestCode", value: formData.requestCode },
              {
                label: "Attachments",
                field: "attachmentsAllowed",
                options: ["Allowed", "Not Allowed"],
                value: formData.attachmentsAllowed ? "Allowed" : "Not Allowed",
              },
            ].map((input, index) => (
              <div className="flex items-center" key={index}>
                <Label className="w-2/5 text-base" htmlFor={input.field}>
                  {input.label}
                </Label>
                {input.options ? (
                  <select
                    value={input.value}
                    onChange={(e) => {
                      if (input.field === "attachmentsAllowed") {
                        handleInputChange(input.field, e.target.value === "Allowed");
                      } else {
                        handleInputChange(input.field, e.target.value);
                      }
                    }}
                    className="w-3/5 p-2 bg-light2 border-2 border-text3 dark:bg-dark4 dark:border-none rounded-lg"
                  >
                    {input.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={input.field}
                    className="w-3/5 bg-light2 border-2 border-text3 dark:bg-dark4 dark:border-none rounded-lg"
                    onChange={(e) => handleInputChange(input.field, e.target.value)}
                    value={input.value}
                  />
                )}
              </div>
            ))}
            <div className="flex items-center">
              <Label className="w-2/5 text-base" htmlFor="roles">
                Roles
              </Label>
              <CheckboxDropdown
                options={roles} // Pass roles as options
                selectedValues={formData.roles} // Pass selected roles
                onChange={handleRoleChange} // Handle role selection changes
              />
            </div>
          </form>
        )}
        {currentStep === 1 && (
          <FormBuilder
            ref={formBuilderRef}
            requestId={requestId}
            urlRequestId={urlRequestId ? urlRequestId : ""}
            formElements={formElements}
            setFormElements={setFormElements}
          />
        )}

        <div className="pt-4 mt-12 flex justify-end space-x-4">
          {currentStep > 0 && (
            <Button
              className="bg-hover w-32 text-white text-base"
              onClick={prevStep}
            >
              Back
            </Button>
          )}

          {currentStep === 0 && (
            <Button
              className="bg-hover w-32 text-white text-base"
              onClick={handleSave}
            >
              Save
            </Button>
          )}

          {currentStep === 0 && (
            <Button
              className="bg-hover w-32 text-white text-base"
              onClick={nextStep}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </LayOut>
  );
};

export default NewRequestType;