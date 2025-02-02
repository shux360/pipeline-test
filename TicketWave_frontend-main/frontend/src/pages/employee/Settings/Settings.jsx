// import React from 'react'
// import LayOut from '../../../components/LayOut'

// const Settings = () => {
//   return (
//     <LayOut title='Settings'></LayOut>
//   )
// }

// export default Settings

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import LayOut from "../../../components/LayOut";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const Settings = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    joinedDate: "",
    branchId: "",
    departmentId: "",
    nextReportingPerson: "",
    userPhoneNumber: "",
    maritalStatus: "",
    address: "",
    role: "",
  });

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  };

  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  const fetchCurrentUser = async () => {
    try {
      console.log("Fetching current user...");
      const response = await axios.get(`${backendUrl}/current_user`, {
        headers,
      });
      console.log("Response from backend:", response);
      const data = response.data;

      if (data.userProfile) {
        const name = data.userProfile.name || "";
        const [firstName, lastName] = name.split(" ");

        const joinedDateArray = data.userProfile.joinedDate || null;
        let joinedDate = "";
        if (
          joinedDateArray &&
          Array.isArray(joinedDateArray) &&
          joinedDateArray.length === 3
        ) {
          joinedDate = `${joinedDateArray[0]}-${String(
            joinedDateArray[1]
          ).padStart(2, "0")}-${String(joinedDateArray[2]).padStart(2, "0")}`;
        }

        setProfileData({
          firstName: firstName || "",
          lastName: lastName || "",
          email: data.userProfile.email || "",
          designation: data.userProfile.designation || "",
          joinedDate: joinedDate,
          branchId: data.userProfile.branchId || "",
          departmentId: data.userProfile.departmentId || "",
          nextReportingPerson: data.userProfile.nextReportingPerson || "",
          userPhoneNumber: data.userProfile.userPhoneNumber || "",
          maritalStatus: data.userProfile.maritalStatus || "",
          address: data.userProfile.address || "",
          role: isAdmin ? data.roles?.[1] : data.roles?.[0],
        });

        // Set profile picture if available
        if (data.userProfile.profileImage) {
          try {
            // Convert the binary image data to a Base64 string
            // const base64Image = `data:image/jpeg;base64,${btoa(
            //   String.fromCharCode(
            //     ...new Uint8Array(data.userProfile.profileImage)
            //   )
            // )}`;

            const base64Image = `data:image/jpeg;base64,${data.userProfile.profileImage}`;
            console.log(
              "Raw profile image data:",
              data.userProfile.profileImage
            );
            console.log(
              "Profile image type:",
              typeof data.userProfile.profileImage
            );

            console.log("Base64 Image String:", base64Image);

            // Set the image preview to the Base64 string
            setImagePreview(base64Image);
            console.log("Profile picture set:", base64Image);
          } catch (error) {
            console.error("Error converting profile picture to Base64:", error);
          }
        } else {
          console.log("No profile picture available.");
        }
      }

      if (data.roles && data.roles.length > 0) {
        setRoles(data.roles);
        console.log("Roles set:", data.roles);
      }
      if (data.userId) {
        setUserId(data.userId);
        console.log("User ID set:", data.userId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        console.log("Session expired. Redirecting to login...");
        // Handle logout or redirect to login
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(`Changing ${id} to ${value}`);
    setProfileData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting profile data:", profileData);

    const name = `${profileData.firstName} ${profileData.lastName}`;
    const finalProfileData = {
      ...profileData,
      name,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/create`,
        finalProfileData,
        { headers }
      );

      if (response.status === 200) {
        console.log("Profile created successfully", response.data);
        setSuccess("Profile updated successfully!");
        setError(null);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("Failed to update profile. Please try again.");
      setSuccess(null);

      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        console.log(
          "Session expired during profile creation. Redirecting to login..."
        );
        // Handle logout or redirect to login
      }
    }
  };

  const handlePasswordChange = async () => {
    console.log("Changing password...");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      console.log("Password mismatch error");
      return;
    }

    if (!currentPassword || !newPassword) {
      setError("Please fill in all password fields.");
      console.log("Incomplete password fields error");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await axios.post(
        `${backendUrl}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password changed successfully!");
      setError(null);
      console.log("Password changed successfully!");

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password. Please try again.";

      setError(errorMessage);
      setSuccess(null);
      console.error("Error changing password:", errorMessage);

      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        console.log(
          "Session expired during password change. Redirecting to login..."
        );
        // Handle logout or redirect to login
      }
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log("File dropped:", file);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Please select an image under 5MB.");
        console.log("File size too large:", file.size);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageFile(file);
      console.log("Image preview set:", previewUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting image...");

    if (!userId) {
      setError("User ID is required for uploading image");
      console.log("User ID is missing for image upload");
      return;
    }

    if (!(imageFile instanceof File)) {
      console.log("No new image to upload");
      return; // No new image to upload
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append(
      "profileData",
      JSON.stringify({
        ...profileData,
        name: `${profileData.firstName} ${profileData.lastName}`,
      })
    );

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("No authentication token available");
      }

      console.log("Uploading image with headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      });

      const response = await axios.post(
        `${backendUrl}/${userId}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Profile picture updated successfully!");
        setError(null);
        console.log("Profile picture updated successfully!");
        // Refresh user data to get the new image URL
        fetchCurrentUser();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload profile picture. Please try again.");
      setSuccess(null);

      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        console.log(
          "Session expired during image upload. Redirecting to login..."
        );
        // Handle logout or redirect to login
      }
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    console.log("Saving all changes...");
    setIsLoading(true);

    try {
      // First update profile data
      await handleSubmit(e);

      // Then handle image upload if there's a new image
      if (imageFile instanceof File) {
        await handleImageSubmit(e);
      }

      // Clear any old error messages
      setError(null);
      setSuccess("Profile updated successfully!");
      console.log("All changes saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayOut title="Settings">
      <div className="p-4 sm:ml-72 mt-28 mr-8">
        <div className="bg-white dark:bg-dark3 rounded-xl w-full h-auto shadow-lg px-8 py-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="space-x-12 bg-transparent">
              <TabsTrigger value="all" className="outline-none">
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="users" className="outline-none">
                Security
              </TabsTrigger>
            </TabsList>

            <div className="ml-1 w-full mb-5 h-[1px] bg-tabBorder dark:bg-dark4 outline-none"></div>

            {/* Show global success/error messages */}
            {error && (
              <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 mb-4 p-2 bg-green-50 rounded">
                {success}
              </div>
            )}

            <TabsContent value="users">
              {/* <h1 className="text-left mt-10 text-base">
                Two-factor Authentication
              </h1>
              <label className="inline-flex items-center cursor-pointer my-10">
                <Input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-hover"></div>
                <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300">
                  Enable or disable two factor authentication
                </span>
              </label> */}

              <h1 className="text-left text-lg mt-6 font-bold text-base">
                Change Password
              </h1>

              <form className="mt-8">
                <div className="grid gap-8 mb-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 block w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    className="text-white bg-hover hover:bg-hoverDark"
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="all">
              <form className="mt-8">
                <div className="flex justify-center mb-6">
                  <div
                    {...getRootProps()}
                    className={`relative h-32 w-32  rounded-full flex justify-center items-center cursor-pointer ${
                      isDragActive ? "bg-gray-200" : ""
                    }`}
                  >
                    <input {...getInputProps()} />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src="" alt="User avatar" />
                          <AvatarFallback>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </AvatarFallback>
                        </Avatar>
                        <span className="mt-2 text-sm text-gray-500">
                          Upload Image
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-8 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm font-medium"
                    >
                      First Name
                    </label>
                    <Input
                      type="text"
                      id="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium"
                    >
                      Last Name
                    </label>
                    <Input
                      type="text"
                      id="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium"
                    >
                      Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="designation"
                      className="block mb-2 text-sm font-medium"
                    >
                      Designation
                    </label>
                    <Input
                      type="text"
                      id="designation"
                      value={profileData.designation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="joinedDate"
                      className="block mb-2 text-sm font-medium"
                    >
                      Joined Date
                    </label>
                    <Input
                      type="date"
                      id="joinedDate"
                      value={profileData.joinedDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="branchId"
                      className="block mb-2 text-sm font-medium"
                    >
                      Branch ID
                    </label>
                    <Input
                      type="text"
                      id="branchId"
                      value={profileData.branchId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="departmentId"
                      className="block mb-2 text-sm font-medium"
                    >
                      Department
                    </label>
                    <Input
                      type="text"
                      id="departmentId"
                      value={profileData.departmentId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nextReportingPerson"
                      className="block mb-2 text-sm font-medium"
                    >
                      Next Reporting Person
                    </label>
                    <Input
                      type="text"
                      id="nextReportingPerson"
                      value={profileData.nextReportingPerson}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="userPhoneNumber"
                      className="block mb-2 text-sm font-medium"
                    >
                      Phone Number
                    </label>
                    <Input
                      type="text"
                      id="userPhoneNumber"
                      value={profileData.userPhoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="maritalStatus"
                      className="block mb-2 text-sm font-medium"
                    >
                      Marital Status
                    </label>
                    <Input
                      type="text"
                      id="maritalStatus"
                      value={profileData.maritalStatus}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium"
                    >
                      Address
                    </label>
                    <Input
                      type="text"
                      id="address"
                      value={profileData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block mb-2 text-sm font-medium"
                    >
                      Role
                    </label>
                    <Input
                      type="text"
                      id="role"
                      value={profileData.role}
                      onChange={handleChange}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={handleSaveAll}
                    className="text-white bg-hover hover:bg-hoverDark"
                  >
                    {loading ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="bg-hover"
                    onClick={() => {
                      // Reset form to last saved state
                      fetchCurrentUser();
                      setImageFile(null);
                      setImagePreview(null);
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LayOut>
  );
};

export default Settings;
