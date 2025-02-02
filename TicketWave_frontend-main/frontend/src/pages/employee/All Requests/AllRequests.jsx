import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import LayOut from "@/components/LayOut";
import ComboboxUser from "@/components/Combobox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const AllRequests = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formDetail, setFormDetail] = useState(null);
  const [formData, setFormData] = useState([]);
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setApproveDialogOpen] = useState(false);
  const [nextApproverLevel, setNextApproverLevel] = useState(null);
  const [approverUsers, setApproverUsers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [secondApprover, setSecondApprover] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectButton, setIsRejectButton] = useState(false);
  const [isByPassed, setIsByPassed] = useState(false);
  const [byPassedUsers, setByPassedUsers] = useState([]);
  const [selectedByPassedUser, setSelectedByPassedUser] = useState(null);
  const [byPassedReason, setByPassedReason] = useState("");

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  };

  // Fetch bypassed users
  useEffect(() => {
    const fetchByPassedUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user-ids-and-names`, { headers });
        setByPassedUsers(response.data);
        console.log("Bypassed users:", response.data);
      } catch (error) {
        console.error("Error fetching bypassed users:", error);
      }
    };

    fetchByPassedUsers();
  }, []);

  // Fetch all requests
  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const currentUserID = currentUser.user.userProfile.userId;
        console.log("Current user ID:", currentUserID);

        const response = await axios.get(`${backendUrl}/request-submissions/curent-approver/all`, {
          params: { currentUserID },
          headers,
        });

        console.log("All requests:", response.data);

        // Filter requests based on the status in the details array
        const filteredRequests = response.data.map((request) => {
          const userDetails = request.details.find((detail) => detail.currentApproverID === currentUserID);
          return {
            ...request,
            currentStatus: userDetails ? userDetails.status : null,
          };
        });

        setAllRequests(filteredRequests);
      } catch (error) {
        console.error("Error fetching all requests:", error);
      }
    };

    fetchAllRequests();
  }, []);

  const handleRequestClick = async (requestSubmissionID) => {
    try {
      const selectedRequest = allRequests.find(
        (request) => request.requestSubmissionID === requestSubmissionID
      );
      console.log("Selected request:", selectedRequest);

      if (!selectedRequest.details || selectedRequest.details.length === 0) {
        throw new Error("No details found for the selected request.");
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserID = currentUser.user.userProfile.userId;

      const userDetails = selectedRequest.details.find(
        (detail) => detail.currentApproverID === currentUserID
      );

      if (!userDetails) {
        throw new Error("No details found for the current user.");
      }

      const [formResponse, workflowResponse] = await Promise.all([
        axios.get(`${backendUrl}/forms/${selectedRequest.requestID}`, { headers }),
        axios.get(`${backendUrl}/workflows/${selectedRequest.workflowID}`, { headers }),
      ]);

      setSelectedRequest(selectedRequest);
      setFormDetail(formResponse.data);
      setFormData(selectedRequest.formData);
      setSelectedWorkflow(workflowResponse.data);

      const nextApproverLevel = workflowResponse.data.workflowLevels.find(
        (level) => level.id === userDetails.nextApproverLevelID
      );

      setNextApproverLevel(nextApproverLevel);

      if (nextApproverLevel.allowBypass) {
        setIsByPassed(true);
      }

      await fetchApproverData(nextApproverLevel);
    } catch (error) {
      console.error("Error fetching form and data:", error);
    }
  };

  const fetchApproverData = async (nextApproverLevel) => {
    if (!nextApproverLevel) return;

    try {
      let approverData = [];

      if (nextApproverLevel.levelType === "SECOND_REPORTING_PERSON") {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const secondReportingPersonID = currentUser.user.userProfile.nextReportingPerson;
        const response = await axios.get(`${backendUrl}/user-id-name/${secondReportingPersonID}`, { headers });
        setSecondApprover(response.data);
      } else if (nextApproverLevel.levelType === "DESIGNATION") {
        const response = await axios.get(`${backendUrl}/users-by-designation/${nextApproverLevel.authPerson}`, { headers });
        approverData = response.data;
        setApproverUsers(approverData);
      } else if (nextApproverLevel.levelType === "GRADE") {
        const response = await axios.get(`${backendUrl}/users-by-grade/${nextApproverLevel.authPerson}`, { headers });
        approverData = response.data;
        setApproverUsers(approverData);
      } else if (nextApproverLevel.levelType === "STATIC") {
        approverData = [{ name: nextApproverLevel.authPerson }];
        setApproverUsers(approverData);
      }
    } catch (error) {
      console.error("Error fetching approver data:", error);
    }
  };

  const handleApproverSelect = (selectedUserId) => {
    const selectedApprover = approverUsers.find((user) => user.userId.toString() === selectedUserId);
    setSelectedApprover(selectedApprover);
  };

  const handleApprove = async () => {
    try {
      if (!selectedRequest || !selectedWorkflow) {
        toast.error("No request or workflow selected.");
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserID = currentUser.user.userProfile.userId;

      const userDetails = selectedRequest.details.find(
        (detail) => detail.currentApproverID === currentUserID
      );

      if (!userDetails) {
        toast.error("No details found for the current user.");
        return;
      }

      const selectedApproverId = selectedApprover ? selectedApprover.userId : secondApprover ? secondApprover.userId : null;

      if (!selectedApproverId) {
        toast.error("No approver selected.");
        return;
      }

      const currentWorkflowLevelNumber = userDetails.currentWorkflowLevelNumber;
      const workflowLength = selectedWorkflow.workflowLevels.length;

      let nextApproverLevelId = null;
      if (workflowLength - (currentWorkflowLevelNumber + 1) > 0) {
        nextApproverLevelId = selectedWorkflow.workflowLevels[currentWorkflowLevelNumber + 1].id;
      }

      const currentApproverLevel = nextApproverLevel.approvalLevel;

      const response = await axios.post(
        `${backendUrl}/request-submissions/approve`,
        null,
        {
          params: {
            submissionDetailsID: userDetails.submissionDetailsID,
            requestSubmissionId: selectedRequest.requestSubmissionID,
            currentApproverId: selectedApproverId,
            nextApproverLevelId: nextApproverLevelId,
            currentWorkflowLevelNumber: currentWorkflowLevelNumber + 1,
            currentApproverLevel: currentApproverLevel,
          },
          headers,
        }
      );

      toast.success("Request approved successfully!");
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Error approving request: " + error.message);
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async () => {
    try {
      if (!rejectionReason) {
        toast.error("Please provide a reason for rejection.");
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserID = currentUser.user.userProfile.userId;

      const userDetails = selectedRequest.details.find(
        (detail) => detail.currentApproverID === currentUserID
      );

      if (!userDetails) {
        toast.error("No details found for the current user.");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/request-submissions/reject`,
        null,
        {
          params: {
            submissionDetailsID: userDetails.submissionDetailsID,
            requestSubmissionId: selectedRequest.requestSubmissionID,
            currentApproverId: currentUserID,
            comment: rejectionReason,
          },
          headers,
        }
      );

      if (response.status === 200) {
        toast.success("Request rejected successfully!");
        setSelectedRequest(null);
        setRejectionReason("");
        setIsRejectButton(false);
      } else {
        toast.error(`Error rejecting request: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error rejecting request: " + (error.response?.data?.message || error.message));
    }
  };

  const handleByPass = async () => {
    try {
      if (!selectedByPassedUser) {
        toast.error("Please select a user to bypass.");
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const byPassedBy = currentUser.user.userProfile.userId;
      const latestDetails = selectedRequest.details[selectedRequest.details.length - 1];

      const response = await axios.post(
        `${backendUrl}/request-submissions/bypass`,
        null,
        {
          params: {
            submissionDetailsID: latestDetails.submissionDetailsID,
            requestSubmissionId: selectedRequest.requestSubmissionID,
            currentApproverId: selectedByPassedUser.userId,
            currentWorkflowLevelNumber: latestDetails.currentWorkflowLevelNumber,
            currentApproverLevelId: null,
            nextApproverLevelId: null,
            currentApproverLevel: "ByPassed Approver",
            byPassedBy: byPassedBy,
            comment: byPassedReason || null,
          },
          headers,
        }
      );

      if (response.status === 200) {
        toast.success("Request bypassed successfully!");
        setSelectedRequest(null);
        setSelectedByPassedUser(null);
        setByPassedReason("");
      } else {
        toast.error(`Error bypassing request: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error bypassing request: " + (error.response?.data?.message || error.message));
    }
  };

  const handleByPassedUserSelect = (selectedUserId) => {
    const selectedUser = byPassedUsers.find((user) => user.userId.toString() === selectedUserId);
    setSelectedByPassedUser(selectedUser);
  };

  const parseAndFormatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 7) return "Invalid Date";

    const [year, month, day, hour, minute, second, milliseconds] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second, milliseconds);
    return date.toLocaleString();
  };

  const filterRequestsByStatus = (status) => {
    return allRequests.filter((request) => request.currentStatus === status);
  };

  return (
    <LayOut title="All Requests">
      <div className="p-4 sm:ml-72 mt-28 flex justify-center px-10">
        <div className="w-full max-w-6xl">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">All Requests</h1>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="bypassed">Bypassed</TabsTrigger>
              <TabsTrigger value="escalated">Escalated</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <RequestTable
                requests={filterRequestsByStatus("REQUEST_PENDING")}
                handleRequestClick={handleRequestClick}
                parseAndFormatDate={parseAndFormatDate}
              />
            </TabsContent>
            <TabsContent value="approved">
              <RequestTable
                requests={filterRequestsByStatus("REQUEST_APPROVED")}
                handleRequestClick={handleRequestClick}
                parseAndFormatDate={parseAndFormatDate}
              />
            </TabsContent>
            <TabsContent value="rejected">
              <RequestTable
                requests={filterRequestsByStatus("REQUEST_REJECTED")}
                handleRequestClick={handleRequestClick}
                parseAndFormatDate={parseAndFormatDate}
              />
            </TabsContent>
            <TabsContent value="bypassed">
              <RequestTable
                requests={filterRequestsByStatus("REQUEST_BYPASSED")}
                handleRequestClick={handleRequestClick}
                parseAndFormatDate={parseAndFormatDate}
              />
            </TabsContent>
            <TabsContent value="escalated">
              <RequestTable
                requests={filterRequestsByStatus("REQUEST_ESCALATED")}
                handleRequestClick={handleRequestClick}
                parseAndFormatDate={parseAndFormatDate}
              />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)} modal={false}>
          <DialogContent className="max-w-4xl bg-white rounded-lg shadow-xl backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="max-h-[80vh] overflow-y-auto space-y-6 p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-md text-gray-500">Request ID</p>
                    <p className="text-md font-medium text-gray-900">{selectedRequest.requestSubmissionID}</p>
                  </div>
                  <div>
                    <p className="text-md text-gray-500">Requester</p>
                    <p className="text-md font-medium text-gray-900">{selectedRequest.requesterID}</p>
                  </div>
                  <div>
                    <p className="text-md text-gray-500">Status</p>
                    <p className="text-md font-medium text-gray-900">{selectedRequest.currentStatus}</p>
                  </div>
                  <div>
                    <p className="text-md text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {parseAndFormatDate(
                        selectedRequest.details.find(
                          (detail) => detail.currentApproverID === JSON.parse(localStorage.getItem("user")).user.userProfile.userId
                        ).requestMadeDate
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-800">Form Data</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {formDetail.elements.map((element) => {
                      const data = formData.find((d) => d.elementId === element.id.toString());
                      return (
                        <div key={element.id} className="space-y-2">
                          <p className="text-md font-bold text-gray-700">{element.label}</p>
                          <p className="text-sm text-gray-900 bg-white p-2 rounded-md border border-gray-200">
                            {data ? data.value : "No data"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-indigo-900 dark:text-white mb-4">Selected Workflow</h2>
                  <div className="mt-4">{selectedWorkflow.identificationString}</div>
                </div>

                {nextApproverLevel && (
                  <div className="space-y-4" style={{ pointerEvents: "auto" }}>
                    <h2 className="text-lg font-bold text-indigo-900 dark:text-white mb-4">
                      {nextApproverLevel.approvalLevel}
                    </h2>
                    {approverUsers.length > 0 && (
                      <div className="mt-4" style={{ pointerEvents: "auto" }}>
                        <ComboboxUser users={approverUsers} onSelect={handleApproverSelect} />
                      </div>
                    )}
                  </div>
                )}

                {isRejectButton && (
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows="4"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your reason here..."
                  />
                )}

                {isByPassed && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-indigo-900 mb-4">Bypassed Users</h2>
                    {byPassedUsers.length > 0 ? (
                      <ComboboxUser users={byPassedUsers} multiple={true} onSelect={handleByPassedUserSelect} />
                    ) : (
                      <p className="text-sm text-gray-500">No bypassed users available.</p>
                    )}
                  </div>
                )}

                {isByPassed && (
                  <textarea
                    value={byPassedReason}
                    onChange={(e) => setByPassedReason(e.target.value)}
                    rows="4"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your bypassed reason here..."
                  />
                )}

                <div className="flex justify-end space-x-4 pt-6">
                  {isByPassed && <Button onClick={handleByPass}>Forward</Button>}
                  <Button
                    variant="outline"
                    className="bg-red-100 text-red-800 hover:bg-red-200"
                    onClick={() => {
                      if (!isRejectButton) {
                        setIsRejectButton(true);
                      } else {
                        handleReject();
                      }
                    }}
                  >
                    {isRejectButton ? "Submit Rejection" : "Reject"}
                  </Button>
                  <Button
                    className="bg-green-100 text-green-800 hover:bg-green-200"
                    onClick={() => {
                      setApproveDialogOpen(true);
                      handleApprove();
                    }}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LayOut>
  );
};

const RequestTable = ({ requests, handleRequestClick, parseAndFormatDate }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-cyan-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Request ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Requester ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((request) => {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const currentUserID = currentUser.user.userProfile.userId;
            const userDetails = request.details.find((detail) => detail.currentApproverID === currentUserID);

            return (
              <tr
                key={request.requestSubmissionID}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRequestClick(request.requestSubmissionID)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.requestSubmissionID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.requesterID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {parseAndFormatDate(userDetails.requestMadeDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                    {userDetails.status === "REQUEST_PENDING"
                      ? "Pending"
                      : userDetails.status === "REQUEST_APPROVED"
                      ? "Approved"
                      : userDetails.status === "REQUEST_REJECTED"
                      ? "Rejected"
                      : userDetails.status === "REQUEST_BYPASSED"
                      ? "Bypassed"
                      : userDetails.status === "REQUEST_ESCALATED"
                      ? "Escalated"
                      : "Unknown"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllRequests;