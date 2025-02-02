import LayOut from "@/components/LayOut";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Combobox from "@/components/Combobox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const designationOptions = [
  { value: "Senior Manager", label: "Senior Manager" },
  { value: "Chief Manager / District Manager", label: "Chief Manager / District Manager" },
  { value: "Chairman", label: "Chairman" },
  { value: "Assistant General Manager", label: "Assistant General Manager" },
];

const branchOptions = [
  { value: "Kelaniya", label: "Kelaniya" },
  { value: "Kandy", label: "Kandy" },
  { value: "Colombo", label: "Colombo" },
];

const departmentOptions = [
  { value: "HR", label: "Human Resources" },
  { value: "IT", label: "Information Technology" },
  { value: "Finance", label: "Finance" },
];

const gradeOptions = [
  { value: "Grade 6-I", label: "Grade 6-I" },
  { value: "Officer Grade I", label: "Officer Grade I" },
  { value: "Officer Grade II", label: "Officer Grade II" },
  { value: "Officer Grade III", label: "Officer Grade III" },
];

const initialFormData = {
  Username: "",
  UserId: "",
  AddressLine1: "",
  AddressLine2: "",
  Email: "",
  Name: "",
  PhoneNumber: "",
  Branch: "",
  Grade: "",
  JoinedDate: "",
  Designation: "",
  MaritalStatus: "",
  Department: "",
  NextReportingPerson: "",
  Role: "",
};

export default function CreateNewUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setIsLoadingDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [existingUserIds, setExistingUserIds] = useState([]);
  const [existingUsernames, setExistingUsernames] = useState([]);
  const [tempFormData, setTempFormData] = useState(null);
  const [users, setUsers] = useState([]);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${backendUrl}/roles`, {
        headers,
      });

      const transformedRoles = response.data.map((role) => role.name || role);
      setRoles(transformedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUserNameAndUserId = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user-ids-and-names`, {
        headers,
      });
      setUsers(response.data);
      console.log("User Ids and Names fetched successfully:", response.data);

      setExistingUserIds(response.data.map((user) => user.userId));
      setExistingUsernames(response.data.map((user) => user.username));
    } catch (error) {
      console.error("Error fetching existing users:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUserNameAndUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      setIsEditing(true);
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    setIsLoadingDetails(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Session expired. Please log in again.");
        return;
      }

      const response = await axios.get(`${backendUrl}/user-profile/${userId}`, {
        headers,
      });

      console.log("User details fetched successfully:", response.data);

      const roleName = response.data.roles[0]?.roleName || "";
      setFormData({
        Username: response.data.username,
        UserId: response.data.userId,
        AddressLine1: response.data.address.split(" ")[0] || "",
        AddressLine2: response.data.address.split(" ")[1] || "",
        Email: response.data.email,
        Name: response.data.name,
        PhoneNumber: response.data.userPhoneNumber,
        Branch: response.data.branchId,
        Grade: response.data.grade,
        JoinedDate: response.data.joinedDate,
        Designation: response.data.designation,
        MaritalStatus: response.data.maritalStatus,
        Department: response.data.departmentId,
        NextReportingPerson: response.data.nextReportingPerson,
        Role: roleName,
      });
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, JoinedDate: date });
  };

  const handleDropdownChange = (selectedOption, field) => {
    setFormData({ ...formData, [field]: selectedOption.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userId) {
      if (!formData.UserId) {
        newErrors.UserId = "*User ID is required";
      } else if (existingUserIds.includes(formData.UserId)) {
        newErrors.UserId = "*User ID already exists";
      }

      if (!formData.Username) {
        newErrors.Username = "*Username is required";
      } else if (existingUsernames.includes(formData.Username)) {
        newErrors.Username = "*Username already exists";
      }

      if (!formData.Email) newErrors.Email = "*Email is required";
      if (!formData.Name) newErrors.Name = "*Name is required";
      if (!formData.PhoneNumber)
        newErrors.PhoneNumber = "*Phone Number is required";
      if (!formData.Branch) newErrors.Branch = "*Branch is required";
      if (!formData.Designation)
        newErrors.Designation = "*Designation is required";
      if (!formData.Department)
        newErrors.Department = "*Department is required";
      if (!formData.JoinedDate)
        newErrors.JoinedDate = "*Joined Date is required";
      if (!formData.NextReportingPerson)
        newErrors.NextReportingPerson = "*Next Reporting Person is required";
      if (!formData.Role) newErrors.Role = "*Role is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      if (!validateForm()) return;
    }
    setTempFormData(formData);
    setIsSubmitted(true);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const endpoint = isEditing
        ? `${backendUrl}/update_user/${userId}`
        : `${backendUrl}/create_user`;

      const response = await axios.post(
        endpoint,
        {
          userId: tempFormData.UserId,
          username: tempFormData.Username,
          roles: [{ roleName: tempFormData.Role }],
          name: tempFormData.Name,
          email: tempFormData.Email,
          designation: tempFormData.Designation,
          grade: tempFormData.Grade,
          maritalStatus: tempFormData.MaritalStatus,
          joinedDate: tempFormData.JoinedDate,
          branchId: tempFormData.Branch,
          departmentId: tempFormData.Department,
          nextReportingPerson: tempFormData.NextReportingPerson,
          userPhoneNumber: tempFormData.PhoneNumber,
          address: tempFormData.AddressLine1 + " " + tempFormData.AddressLine2,
        },
        { headers }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `${isEditing ? "User updated" : "User created"} successfully.`
        );
        setOpenDialog(false);
        if (isEditing) {
          navigate("/existing-users");
        } else {
          setFormData(initialFormData); // Reset form data after successful submission
        }
      } else {
        toast.warning(response.data);
      }
    } catch (error) {
      const errorMessage =
        error.response.data || "An error occurred while saving the user.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayOut>
      <div className="md:w-9/12 w-11/12 min-h-screen my-40 md:ml-80 mx-auto p-6 bg-white dark:bg-dark3 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
          {isEditing ? "Edit User" : "Create New User"}
        </h1>
        {loadingDetails ? (
          <div className="flex justify-center items-center h-32">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="UserId">User ID</Label>
                <Input
                  id="UserId"
                  value={formData.UserId}
                  onChange={handleChange}
                  className="bg-gray-300 dark:bg-dark2"
                />
                {errors.UserId && (
                  <span className="text-red-500">{errors.UserId}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Username">Username</Label>
                <Input
                  id="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  className="bg-gray-300 dark:bg-dark2"
                />
                {errors.Username && (
                  <span className="text-red-500">{errors.Username}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="AddressLine1">Address Line 1</Label>
                <Input
                  id="AddressLine1"
                  value={formData.AddressLine1}
                  onChange={handleChange}
                  className="bg-gray-300 dark:bg-dark2"
                />
                {errors.AddressLine1 && (
                  <span className="text-red-500">{errors.AddressLine1}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="AddressLine2">Address Line 2</Label>
                <Input
                  id="AddressLine2"
                  value={formData.AddressLine2}
                  onChange={handleChange}
                  className="bg-gray-300 dark:bg-dark2"
                />
                {errors.AddressLine2 && (
                  <span className="text-red-500">{errors.AddressLine2}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Email">Email</Label>
                <Input
                  id="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="bg-gray-300 dark:bg-dark2"
                />
                {errors.Email && (
                  <span className="text-red-500">{errors.Email}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Name">Name</Label>
                <Input
                  id="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className="bg-gray-300 dark:bg-dark2"
                />
                {errors.Name && (
                  <span className="text-red-500">{errors.Name}</span>
                )}
              </div>

              <div className="space-y-2">
                <br />
                <Label htmlFor="PhoneNumber">Phone Number</Label>
                <Input
                  id="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  className="bg-gray-300 dark:bg-dark2"
                />
                {errors.PhoneNumber && (
                  <span className="text-red-500">{errors.PhoneNumber}</span>
                )}
              </div>
            </div>

            <h2 className="text-lg font-semibold mt-10 mb-4">
              Professional Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Designation">Designation</Label>
                <select
                  id="Designation"
                  value={formData.Designation}
                  onChange={(e) =>
                    handleDropdownChange(
                      { value: e.target.value },
                      "Designation"
                    )
                  }
                  className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full"
                >
                  <option value="">Select Designation</option>
                  {designationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.Designation && (
                  <span className="text-red-500">{errors.Designation}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Branch">Branch</Label>
                <select
                  id="Branch"
                  value={formData.Branch}
                  onChange={(e) =>
                    handleDropdownChange({ value: e.target.value }, "Branch")
                  }
                  className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full"
                >
                  <option value="">Select Branch</option>
                  {branchOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.Branch && (
                  <span className="text-red-500">{errors.Branch}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Department">Department</Label>
                <select
                  id="Department"
                  value={formData.Department}
                  onChange={(e) =>
                    handleDropdownChange(
                      { value: e.target.value },
                      "Department"
                    )
                  }
                  className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full"
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.Department && (
                  <span className="text-red-500">{errors.Department}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Grade">Grade</Label>
                <select
                  id="Grade"
                  value={formData.Grade}
                  onChange={(e) =>
                    handleDropdownChange({ value: e.target.value }, "Grade")
                  }
                  className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full"
                >
                  <option value="">Select Grade</option>
                  {gradeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.Grade && (
                  <span className="text-red-500">{errors.Grade}</span>
                )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="MaritalStatus">Marital Status</Label>
                  <select
                    id="MaritalStatus"
                    value={formData.MaritalStatus}
                    onChange={handleChange}
                    className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>


                  </select>
                  {errors.MaritalStatus && (
                    <span className="text-red-500">{errors.MaritalStatus}</span>
                  )}
                </div>

              <div className="space-y-2">
                <Label htmlFor="NextReportingPerson">
                  Next Reporting Person
                </Label>
                <br />
                <Combobox
                  users={users} // Pass the fetched users
                  className="bg-gray-300 dark:bg-dark2"
                  value={formData.NextReportingPerson} // Pass the current value
                  onSelect={(selectedUserId) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      NextReportingPerson: selectedUserId,
                    }));
                  }}
                />
                {errors.NextReportingPerson && (
                  <span className="text-red-500">
                    {errors.NextReportingPerson}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="Role">Role</Label>
                <div className="relative">
                  <button
                    type="button"
                    value={formData.roles}
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full text-left"
                  >
                    {formData.Role || "Select a role"}
                  </button>
                  {isRoleDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white dark:bg-dark2 border border-gray-300 rounded shadow-lg">
                      <div className="p-2">
                        <Input
                          type="text"
                          placeholder="Type a new role"
                          onChange={(e) =>
                            setFormData({ ...formData, Role: e.target.value })
                          }
                          className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full mb-2"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {roles.map((role, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setFormData({ ...formData, Role: role });
                              setIsRoleDropdownOpen(false);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark3 cursor-pointer"
                          >
                            {role}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {errors.Role && (
                  <span className="text-red-500">{errors.Role}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="JoinedDate">Joined Date</Label>
                <br />
                <DatePicker
                  selected={
                    formData.JoinedDate ? new Date(formData.JoinedDate) : null
                  }
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="bg-gray-300 dark:bg-dark2 p-2 rounded w-full"
                  placeholderText="Select a date"
                />
                {errors.JoinedDate && (
                  <span className="text-red-500">{errors.JoinedDate}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
              <Button
                className="bg-[#0097A9] hover:bg-[#487a7f] text-white"
                onClick={handleSubmit}
              >
                {isEditing ? (
                  loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    "Update"
                  )
                ) : (
                  "Create"
                )}
              </Button>
              <Button className="border-2 border-hover bg-transparent text-hover hover:bg-hover hover:text-white">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isSubmitted && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="max-h-[80vh] overflow-y-auto dark:bg-dark1">
              <DialogHeader>
                <DialogTitle>Review and Save User Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => (
                  <div className="space-y-2" key={key}>
                    <Label htmlFor={key}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id={key}
                      value={formData[key]}
                      readOnly
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
                <Button
                  className="bg-[#0097A9] text-white"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  className="border-2 border-hover hover:border-none bg-transparent text-hover hover:bg-transparent hover:dark:text-white"
                  onClick={() => setOpenDialog(false)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </LayOut>
  );
}
