import { Card, CardContent } from "@/components/ui/card";
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

import ActiveUser from "../../../assets/icons/activeUser.png";
import Users from "../../../assets/icons/users.png";
import completed from "../../../assets/images/completed.png";
import pending from "../../../assets/images/pending.png";
import user1 from "../../../assets/images/user1.png";
import user2 from "../../../assets/images/user2.png";
import user3 from "../../../assets/images/user3.png";
import RadialChart from "../../../components/Charts/RadialChart";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;
const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Token not found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCount(response.data);
        console.log("User count:", response.data);
      } catch (error) {
        console.error("Error fetching user count:", error.message);
      }
    };

    fetchUserCount();
  }, []);
  return (
    <LayOut title="Dashboard">
      <div className="p-4 sm:ml-72 mt-28">
        {/*Users Overview */}
        <section className="section-1 flex justify-start space-x-24 items-start mx-4">
          <div className="users-overview">
            <h1 className="text-2xl font-medium mb-8">Users Overview</h1>
            {/* Total Users Card */}
            <Card className="w-[300px] rounded-2xl h-20 shadow-lg dark:bg-dark3">
              <CardContent className="w-full">
                <div className="flex items-center py-2 font-semibold text-lg">
                  <div className="text-center w-32">
                    <p className="text-text1 dark:text-light2">Total Users</p>
                    <p className="text-xl">{userCount}</p>
                  </div>
                  <div className="relative w-16 h-16 ml-24">
                    <div className="w-12 h-12 mt-1.5 ml-[0.9px] rounded-full bg-[#D9D9D9] dark:bg-[#9CF4FF]" />
                    <img
                      src={Users}
                      alt="users"
                      className="absolute inset-0 m-auto w-8 h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Active Users Card */}
            <Card className="w-[300px] rounded-2xl h-20 mt-8 shadow-lg dark:bg-dark3">
              <CardContent className="w-full">
                <div className="flex items-center py-2 font-semibold text-lg">
                  <div className="text-center w-40">
                    <p className="text-text1 dark:text-light2">Active Users</p>
                    <p className="text-xl">50</p>
                  </div>
                  <div className="relative w-16 h-16 ml-20">
                    <div className="w-12 h-12 mt-2 rounded-full bg-[#D9D9D9] dark:bg-[#9CF4FF]" />
                    <img
                      src={ActiveUser}
                      alt="active"
                      className="absolute inset-0 m-auto w-8 h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="recent-loggedIn">
            <h1 className="text-2xl font-medium mb-8">Recent Logged In</h1>
            <div className="bg-white dark:bg-dark3 w-[720px] rounded-xl shadow-lg">
              <Table className="w-full">
                <TableHeader className="font-medium text-lg text-text2 h-14">
                  <TableRow>
                    <TableHead className="w-[150px] text-center dark:text-light1">
                      Profile Img
                    </TableHead>
                    <TableHead className="dark:text-light1">Username</TableHead>
                    <TableHead className="dark:text-light1">Time</TableHead>
                    <TableHead className="dark:text-light1">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-medium">
                    <TableCell className="text-center">
                      <img
                        src={user1}
                        alt="user1"
                        className="w-12 h-12 rounded-full mx-auto"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-base dark:text-light2">
                      JohnDoe
                    </TableCell>
                    <TableCell className="font-normal">5 minutes ago</TableCell>
                    <TableCell className="font-normal">Admin</TableCell>
                  </TableRow>
                  <TableRow className="font-medium">
                    <TableCell className="text-center">
                      <img
                        src={user2}
                        alt="user2"
                        className="w-12 h-12 rounded-full mx-auto"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-base dark:text-light2">
                      JaneSmith
                    </TableCell>
                    <TableCell className="font-normal">
                      15 minutes ago
                    </TableCell>
                    <TableCell className="font-normal">CIO</TableCell>
                  </TableRow>
                  <TableRow className="font-medium">
                    <TableCell className="text-center">
                      <img
                        src={user3}
                        alt="user1"
                        className="w-12 h-12 rounded-full mx-auto"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-base dark:text-light2">
                      MikeBrown
                    </TableCell>
                    <TableCell className="font-normal">
                      10 minutes ago
                    </TableCell>
                    <TableCell className="font-normal">GM</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        {/* Requests Overview */}
        <section className="section-2 flex justify-start space-x-24 items-start mt-16 mx-4">
          <div className="requests-overview">
            <h1 className="text-2xl font-medium mb-8">Requests Overview</h1>
            <Card className="w-[290px] rounded-2xl h-20 shadow-lg dark:bg-dark3">
              <CardContent className="w-full">
                <div className="flex items-center font-semibold text-lg">
                  <div className="text-center w-40">
                    <p className="text-text1 dark:text-light2">Pending</p>
                    <p className="text-xl">50</p>
                  </div>
                  <div className="relative w-20 h-20 ml-24">
                    <div className="w-12 h-12 mt-4 rounded-full bg-[#D9D9D9] dark:bg-[#9CF4FF]" />
                    <img
                      src={pending}
                      alt="users"
                      className="absolute inset-0 m-auto w-8 h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Active Users Card */}
            <Card className="w-[290px] rounded-2xl h-20 mt-8 shadow-lg dark:bg-dark3">
              <CardContent className="w-full">
                <div className="flex items-center font-semibold text-lg">
                  <div className="text-center w-40">
                    <p className="text-text1 dark:text-light2">Completed</p>
                    <p className="text-xl">50</p>
                  </div>
                  <div className="relative w-20 h-20 ml-20">
                    <div className="w-12 h-12 mt-4 rounded-full bg-[#D9D9D9] dark:bg-[#9CF4FF]" />
                    <img
                      src={completed}
                      alt="active"
                      className="absolute inset-0 m-auto w-8 h-8 ml-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="request-analysis">
            <h1 className="text-2xl font-medium mb-8">Requests Analysis</h1>
            <RadialChart />
          </div>
        </section>

        {/* Recent Activities */}
        <section className="section-2 mt-16 ml-4 mr-16">
          <h1 className="text-2xl font-medium mb-12">Recent Activities</h1>
          <div className="bg-white dark:bg-dark3 rounded-xl shadow-xl">
            <Table className="w-full">
              <TableHeader className="font-medium text-lg text-text2  h-14">
                <TableRow>
                  <TableHead className="dark:text-light2">
                    Action Type
                  </TableHead>
                  <TableHead className="dark:text-light2">User</TableHead>
                  <TableHead className="dark:text-light2">Timestamp</TableHead>
                  <TableHead className="dark:text-light2">
                    Action details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="font-normal text-base">
                  <TableCell className="font-medium text-base">
                    User Created
                  </TableCell>
                  <TableCell>Admin John</TableCell>
                  <TableCell>15 minutes ago</TableCell>
                  <TableCell>Created user JaneDoe</TableCell>
                </TableRow>
                <TableRow className="font-normal text-base">
                  <TableCell className="font-medium text-base">
                    Request Submitted
                  </TableCell>
                  <TableCell>User Jane</TableCell>
                  <TableCell>10 minutes ago</TableCell>
                  <TableCell>
                    Submitted Loan Approval request (ID: 12345)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </LayOut>
  );
};

export default Dashboard;
