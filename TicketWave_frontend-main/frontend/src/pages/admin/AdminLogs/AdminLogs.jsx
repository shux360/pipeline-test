import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LayOut from "../../../components/LayOut";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const AdminLogs = () => {
  const [username, setUsername] = useState("");
  const [userActivities, setUserActivities] = useState([]);
  const [recentlyDeletedUsers, setRecentlyDeletedUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user activities (last login times)--
  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const response = await fetch(`${backendUrl}/user-activities`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserActivities(data);
      } catch (error) {
        console.error("Error fetching user activities:", error);
        setError("Failed to fetch user activities. Please try again.");
      }
    };

    fetchUserActivities();
  }, []);

  // Fetch deleted users from the backend
  const fetchDeletedUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/deleted-users`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      setRecentlyDeletedUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching deleted users:", error);
      setError("Failed to fetch deleted users. Please try again.");
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  // Fetch user details from the backend--for searching

  const fetchUserDetails = async (username) => {
    try {
      const response = await axios.get(
        `${backendUrl}/user-details/${username}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.data) {
        const userActivity = userActivities.find(
          (activity) => activity.username === username
        );

        const userDetails = {
          ...response.data,
          lastLoginTime: userActivity ? userActivity.lastLoginTime : "N/A",
          sentRequests: response.data.sentRequests || [
            { id: 1, type: "Request A", date: "2023-10-01" },
            { id: 2, type: "Request B", date: "2023-10-02" },
          ],
          receivedRequests: response.data.receivedRequests || [
            { id: 3, type: "Request C", date: "2023-10-03" },
            { id: 4, type: "Request D", date: "2023-10-04" },
          ],
        };

        setUserDetails(userDetails);
        setError("");
      } else {
        setUserDetails(null);
        setError("No user found with this username.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetails(null);
      setError("Failed to fetch user details. Please try again.");
    }
  };

  const handleSearch = () => {
    if (username.trim()) {
      fetchUserDetails(username);
    } else {
      setError("Please enter a username.");
    }
  };

  // Filter deleted users for seaarching
  const filteredDeletedUsers = recentlyDeletedUsers.filter((user) =>
    user.deletedUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to extract roleName from the role string
  const getRoleName = (roleString) => {
    if (!roleString) return "N/A";

    try {
      const roleNameMatch = roleString.match(/roleName=([^)]+)/);
      if (roleNameMatch && roleNameMatch[1]) {
        return roleNameMatch[1];
      }
      return "N/A";
    } catch (error) {
      console.error("Error parsing role string:", error);
      return "N/A";
    }
  };

  return (
    <LayOut title="User Logs">
      <div className="md:w-9/12 w-11/12 min-h-screen my-40 md:ml-80 mx-auto p-6 bg-white dark:bg-dark3 rounded-lg shadow-md">
        {/* User Activities Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Activities</CardTitle>
            <CardDescription>
              A list of user activities including last login times.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Last Login Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivities.map((activity) => (
                    <TableRow key={activity.userId}>
                      <TableCell>{activity.username}</TableCell>
                      <TableCell>
                        {new Date(activity.lastLoginTime).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recently Deleted Users Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recently Deleted Users</CardTitle>
            <CardDescription>A list of recently deleted users.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar for Deleted Users */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search by username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead>Deletion Date</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeletedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.deletedUsername}</TableCell>
                      <TableCell>{user.deletedByUsername}</TableCell>
                      <TableCell>
                        {new Date(user.deletionTimestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{getRoleName(user.role)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* User Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>
              Search for a user to view their details and requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search for User Details */}
            <div className="mb-8">
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>

            {/* Display User Details */}
            {userDetails && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Details for {userDetails.username}
                </h2>
                <div className="space-y-4">
                  {/* User Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Last Login:</strong>{" "}
                          {userDetails.lastLoginTime === "N/A"
                            ? "N/A"
                            : new Date(
                                userDetails.lastLoginTime
                              ).toLocaleString()}
                        </p>
                        <p>
                          <strong>Created By:</strong> {userDetails.createdBy}
                        </p>
                        {userDetails.isDeleted && (
                          <p>
                            <strong>Deleted By:</strong> {userDetails.deletedBy}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sent Requests */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sent Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails.sentRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.type}</TableCell>
                              <TableCell>{request.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Received Requests */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Received Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails.receivedRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.type}</TableCell>
                              <TableCell>{request.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LayOut>
  );
};

export default AdminLogs;
