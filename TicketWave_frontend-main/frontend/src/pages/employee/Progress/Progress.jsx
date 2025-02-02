import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayOut from "../../../components/LayOut.jsx";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const Progress = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?.userProfile?.userId;

  // Date conversion functions
  const convertArrayToDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 7) {
      console.error("Invalid date array:", dateArray);
      return "Invalid Date";
    }

    // Extract date components from the array
    const [year, month, day, hour, minute, second, nanoseconds] = dateArray;

    //  (ISO 8601 format)
    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}:${String(second).padStart(2, "0")}.${String(
      nanoseconds
    ).padStart(9, "0")}Z`;

    return dateString;
  };

  // Function to format the date
  const formatDate = (dateArray) => {
    const dateString = convertArrayToDate(dateArray); // Convert array to date string
    const date = new Date(dateString); // Parse the date string

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "REQUEST_APPROVED":
        return "bg-green-500";
      case "REQUEST_PENDING":
        return "bg-yellow-500";
      case "REQUEST_REJECTED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Fetch requests submitted by the user
  useEffect(() => {
    if (!userId) {
      setError("User ID not found in local storage.");
      setLoading(false);
      toast.error("User ID not found in local storage."); // Display toast for missing userId
      return;
    }

    const fetchUserRequests = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/request-submissions/requester`, // Updated endpoint
          {
            params: { requesterId: userId }, // Updated query parameter
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`, // Ensure JWT token is included
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("Fetched requests:", response.data); // Debugging log

        // Fetch request names, approver details, and workflow identification string for each request
        const requestsWithDetails = await Promise.all(
          response.data.map(async (request) => {
            // Fetch request name
            const requestTypeResponse = await axios.get(
              `${backendUrl}/requests/${request.requestID}`, // Fetch request details
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Fetched request details:", requestTypeResponse.data); // Debugging log

            // Fetch workflow identification string
            const workflowResponse = await axios.get(
              `${backendUrl}/workflows/${request.workflowID}`, // Fetch workflow details
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                  "Content-Type": "application/json",
                },
              }
            );

            // console.log("Fetched workflow details:", workflowResponse.data); // Debugging log

            // Fetch approver details for each detail
            const detailsWithApprovers = await Promise.all(
              request.details.map(async (detail) => {
                const approverResponse = await axios.get(
                  `${backendUrl}/user-profile/${detail.currentApproverID}`, // Fetch approver details
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                // console.log("Fetched approver details:", approverResponse.data); // Debugging log

                return {
                  ...detail,
                  approverName: approverResponse.data.name, // Add approver's name to the detail
                  approverProfileImage: approverResponse.data.profileImage, // Add approver's profile image to the detail
                };
              })
            );

            // console.log("Details with approvers:", detailsWithApprovers); // Debugging log

            return {
              ...request,
              requestName: requestTypeResponse.data.requestName, // Add requestName to the request object
              workflowIdentificationString:
                workflowResponse.data.identificationString, // Add workflow identification string
              details: detailsWithApprovers, // Update details with approver names and profile images
            };
          })
        );

        console.log("Requests with details:", requestsWithDetails); // Debugging log

        setRequests(requestsWithDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user requests:", error);
        setError("Failed to fetch requests. Please try again later.");
        setLoading(false);
        toast.error("Failed to fetch requests. Please try again later."); // Display toast for API error
      }
    };

    fetchUserRequests();
  }, [userId]);

  // Filter requests based on search query
  const filteredRequests = requests.filter((request) =>
    request.requestName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <LayOut>
        <div className="p-6 pl-72">
          <h1 className="text-2xl font-bold mb-6">Your Request Progress</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </LayOut>
    );
  }

  if (error) {
    return (
      <LayOut>
        <div className="p-6 pl-72">
          <h1 className="text-2xl font-bold mb-6">Your Request Progress</h1>
          <div className="text-red-500">{error}</div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className="p-6 pl-72">
        <h1 className="text-2xl font-bold mb-6">Your Request Progress</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by request name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Request Name</th>
                <th className="p-3 text-left">Submitted Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.requestSubmissionID}
                  onClick={() => setSelectedRequest(request)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="p-3 border-t">{request.requestName}</td>
                  <td className="p-3 border-t">
                    {formatDate(request.requestMadeDate)}
                  </td>
                  <td className="p-3 border-t">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(
                          request.overallStatus
                        )}`}
                      ></div>
                      <span>{request.overallStatus}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Card Popup */}
        {/* {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                Request ID: {selectedRequest.requestSubmissionID}
              </h2>
              <p className="mb-2">
                <strong>Request Name:</strong> {selectedRequest.requestName}
              </p>
              <p className="mb-2">
                <strong>Workflow:</strong>{" "}
                {selectedRequest.workflowIdentificationString}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {selectedRequest.overallStatus}
              </p>
              <p className="mb-4">
                <strong>Submitted On:</strong>{" "}
                {formatDate(selectedRequest.requestMadeDate)}
              </p>
              <div className="space-y-4">
                {selectedRequest.details.map((detail, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-lg shadow-sm ${getStatusColor(
                      detail.status
                    )}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Level {detail.currentApproverLevel}
                        </p>
                        <p>Approver: {detail.approverName}</p>
                        <p>Status: {detail.status}</p>
                        <p>Date: {formatDate(detail.requestMadeDate)}</p>
                      </div>
                      <Avatar>
                        <AvatarImage
                          src={
                            detail.approverProfileImage
                              ? `data:image/jpeg;base64,${detail.approverProfileImage}`
                              : undefined
                          }
                        />
                        <AvatarFallback>
                          {detail.approverName
                            ? detail.approverName
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()
                            : "CN"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )} */}

        {/* Detailed Card Popup */}

        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                Request ID: {selectedRequest.requestSubmissionID}
              </h2>
              <p className="mb-2">
                <strong>Request Name:</strong> {selectedRequest.requestName}
              </p>
              <p className="mb-2">
                <strong>Workflow:</strong>{" "}
                {selectedRequest.workflowIdentificationString}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {selectedRequest.overallStatus}
              </p>
              <p className="mb-4">
                <strong>Submitted On:</strong>{" "}
                {formatDate(selectedRequest.requestMadeDate)}
              </p>

              {/* Display the comment if the request is rejected */}
              {selectedRequest.overallStatus === "REQUEST_REJECTED" && (
                <div className="mb-4">
                  <strong>Rejection Comment:</strong>
                  <p className="mt-1 p-2 bg-gray-100 rounded-lg">
                    {selectedRequest.details.find(
                      (detail) => detail.status === "REQUEST_REJECTED"
                    )?.comment || "No comment provided."}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {selectedRequest.details.map((detail, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-lg shadow-sm ${getStatusColor(
                      detail.status
                    )}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Level {detail.currentApproverLevel}
                        </p>
                        <p>Approver: {detail.approverName}</p>
                        <p>Status: {detail.status}</p>
                        <p>Date: {formatDate(detail.requestMadeDate)}</p>
                      </div>
                      <Avatar>
                        <AvatarImage
                          src={
                            detail.approverProfileImage
                              ? `data:image/jpeg;base64,${detail.approverProfileImage}`
                              : undefined
                          }
                        />
                        <AvatarFallback>
                          {detail.approverName
                            ? detail.approverName
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()
                            : "CN"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                Request ID: {selectedRequest.requestSubmissionID}
              </h2>
              <p className="mb-2">
                <strong>Request Name:</strong> {selectedRequest.requestName}
              </p>
              <p className="mb-2">
                <strong>Workflow:</strong>{" "}
                {selectedRequest.workflowIdentificationString}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {selectedRequest.overallStatus}
              </p>
              <p className="mb-4">
                <strong>Submitted On:</strong>{" "}
                {formatDate(selectedRequest.requestMadeDate)}
              </p>
              <div className="space-y-4">
                {selectedRequest.details.map((detail, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-lg shadow-sm ${getStatusColor(
                      detail.status
                    )}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Level {detail.currentApproverLevel}
                        </p>
                        <p>Approver: {detail.approverName}</p>
                        <p>Status: {detail.status}</p>
                        <p>Date: {formatDate(detail.requestMadeDate)}</p>
                      </div>
                      <Avatar>
                        <AvatarImage
                          src={
                            detail.approverProfileImage
                              ? `data:image/jpeg;base64,${detail.approverProfileImage}`
                              : undefined
                          }
                        />
                        <AvatarFallback>
                          {detail.approverName
                            ? detail.approverName
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()
                            : "CN"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )} */}
      </div>
    </LayOut>
  );
};

export default Progress;
