import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import LayOut from '@/components/LayOut';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Client } from '@stomp/stompjs'; 
import SockJS from "sockjs-client";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const backendUrl = import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:8080";

const Alerts = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({ markAsRead: {} });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [notificationType, setNotificationType] = useState("");
  const [selectedProfile, setSelectedProfile] = useState({
    Username: '',
    UserId: '',
    AddressLine1: '',
    AddressLine2: '',
    Email: '',
    Name: '',
    PhoneNumber: '',
    Branch: '',
    Grade: '',
    JoinedDate: '',
    Designation: '',
    Department: '',
    NextReportingPerson: '',
    Role: ''	
  });
  const [comment, setComment] = useState("");
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  };

const userId = JSON.parse(localStorage.getItem('user')).user.userProfile.userId;




const handleViewProfile = async (userId, notificationId, notificationType) => {
  try {
    console.log('Fetching user profile:', userId);
    console.log('Notification ID:', notificationId);
   
    setLoadingStates((prevState) => ({ ...prevState, [notificationId]: true }));
    
    const response = await axios.get(`${backendUrl}/user-profile/${userId}`, { headers });
    console.log('Selected user:', response.data);
    setSelectedProfile(response.data);
    setSelectedUserId(response.data.userId);
    setSelectedNotificationId(notificationId); 
    setNotificationType(notificationType);
    setOpenDialog(true);
  } catch (error) {
    console.error("Error fetching user profile", error);
  } finally {
   
    setLoadingStates((prevState) => ({ ...prevState, [notificationId]: false }));
  }
};


const handleApproveUser = async (userId, notificationId) => {
  try {
    
    setLoadingStates((prevState)=> ({ ...prevState, approve: true}));
    await axios.post(`${backendUrl}/${userId}/approve?notificationId=${notificationId}`,{
      requestId: selectedUserId
    },{headers});
    setPendingUsers((prev) => prev.filter((user) => user.userId !== userId));
    setOpenDialog(false);
    console.log("User Approved Successfully");
    toast.success("User Approved Successfully");

  } catch (error) {

    console.error("Error approving user", error);
    toast.error("Error approving user");

  } finally{
    setLoadingStates((prevState)=> ({ ...prevState, approve: false}));
  }
};




const handleSendBack = async (userId, notificationId) => {
  
  try {
    setLoadingStates((prevState) => ({ ...prevState, sendBack: true }));
    if(comment === ""){
      toast.error("Please enter a comment");
      return;
    }
    await axios.post(`${backendUrl}/${userId}/reject?comment=${comment}&notificationId=${notificationId}`, {
      requestId: selectedUserId
    }, { headers });
    setPendingUsers((prev) => prev.filter((user) => user.userId !== userId));
    setOpenDialog(false);
    toast.success("User sent back successfully");
    console.log(comment);
  } catch (error) {
    console.error("Error sending back user profile", error);
    toast.error("Error sending back user profile");
  }finally{
    setLoadingStates((prevState) => ({ ...prevState, sendBack: false }));
  }
  };
  

  const handleSendEmail = async (userId) => {
    setLoadingStates(prev => ({ ...prev, sendEmail: true }));
    try {
        const response = await axios.post(`${backendUrl}/send-email/${userId}`, {}, { headers });
        toast.success("Email sent successfully");
    } catch (error) {
        toast.error("Error sending email: " + error.message);
    } finally {
        setLoadingStates(prev => ({ ...prev, sendEmail: false }));
    }
  };

  const handleUpdateUser = async (userId, notificationId) => {
    try {
      // setLoadingStates((prevState) => ({ ...prevState, update: true }));
      // await axios.post(`${backendUrl}/${userId}/update?notificationId=${notificationId}`, {
      //   requestId: selectedUserId
      // }, { headers });
      // setPendingUsers((prev) => prev.filter((user) => user.userId !== userId));
      // setOpenDialog(false);
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user profile", error);
      toast.error("Error updating user profile");
    } finally {
      setLoadingStates((prevState) => ({ ...prevState, update: false }));
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${backendUrl}/notifications/${userId}`, { headers });
        setNotifications(response.data);
        console.log('Response from backend:', response.data);
        
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // const socket = new Client({
    //   webSocketFactory: () => new SockJS(`${backendUrl}/ws-notifications`), 
    //   connectHeaders: {
    //     Authorization: `Bearer ${localStorage.getItem('jwt')}`, 
    //   },
    //   debug: (str) => console.log(str),
    //   onConnect: () => {
    //     console.log("WebSocket connected");
    //     socket.subscribe(`/user/${userId}/queue/notifications`, (message) => {
    //       try {
    //         const notification = JSON.parse(message.body);
    //         console.log("Received notification:", notification);
    //         setNotifications((prev) => [notification, ...prev]);
            
    //       } catch (err) {
    //         console.error("Failed to parse message body:", err);
    //       }
    //     },);
    //   },
    //   onWebSocketClose: (event) => {
    //     console.warn("WebSocket closed:", event);
    //   },
    //   onWebSocketError: (error) => {
    //     console.error("WebSocket error details:", error);
    //   },
    // });

    
    

    // socket.activate();

    // return () => {
    //   socket.deactivate();
    // };
  }, [userId]);

  // useEffect(() => {
  //   const displayedNotificationIds = new Set(
  //     JSON.parse(localStorage.getItem("displayedNotifications") || "[]")
  //   );
  
  //   const requestNotificationPermission = async () => {
  //     if (Notification.permission === "default") {
  //       await Notification.requestPermission();
  //     }
  //   };
  
  //   requestNotificationPermission();
  
  //   notifications.forEach((notification) => {
  //     if (!notification.read && !displayedNotificationIds.has(notification.notificationId)) {
  //       if (Notification.permission === "granted") {
  //         new Notification(notification.notificationType || "Notification", {
  //           body: notification.message,
  //           icon: "/path-to-icon.png",
  //         });
  //         displayedNotificationIds.add(notification.notificationId);
  //       } else {
  //         console.warn("Notification permission not granted.");
  //       }
  //     }
  //   });
  
  //   localStorage.setItem(
  //     "displayedNotifications",
  //     JSON.stringify(Array.from(displayedNotificationIds))
  //   );
  // }, [notifications]);

  const markAsRead = async (notificationDetailId) => {
    try {
      setLoadingStates((prevState) => ({
        ...prevState,
        markAsRead: {
          ...prevState.markAsRead,
          [notificationDetailId]: true,
        },
      }));
      await axios.post(`${backendUrl}/notifications/mark-as-read`, [notificationDetailId], { headers });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.
      notificationDetailId === notificationDetailId
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }finally{
      setLoadingStates((prevState) => ({...prevState, markAsRead: false }));
    } 
  };
  

  const parseTimestamp = (timestamp) => {
    if (!timestamp) return null;
    try {
      const isoString = timestamp.replace(' ', 'T').split('.')[0] + 'Z';
      return new Date(isoString);
    } catch (error) {
      console.error('Failed to parse timestamp:', timestamp, error);
      return null;
    }
  };

  const userNotifications = notifications.filter((n) => n.notificationType === 'CREATEUSER');
  const requestNotifications = notifications.filter((n) => n.notificationType === 'CREATEREQUEST');


  return (
    <LayOut title="Alerts">
      <div className="p-4 sm:ml-72 mt-28 mr-8">
        <div className="bg-white dark:bg-dark3 rounded-xl w-full h-auto shadow-lg px-8 py-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="space-x-12 bg-transparent">
            <TabsTrigger value="all" className='outline-none dark:bg-transparent text-base bg-transparent text-text4 dark:text-text6 data-[state=active]:text-hover dark:data-[state=active]:text-tabText data-[state=active]:text-lg data-[state=active]:border-hover dark:data-[state=active]:border-tabText data-[state=active]:border-b-4'>All</TabsTrigger>
              <TabsTrigger value="users" className='outline-none dark:bg-transparent text-base bg-transparent text-text4 dark:text-text6 data-[state=active]:text-hover dark:data-[state=active]:text-tabText data-[state=active]:text-lg data-[state=active]:border-hover dark:data-[state=active]:border-tabText data-[state=active]:border-b-4'>Users</TabsTrigger>
              <TabsTrigger value="requests" className='outline-none dark:bg-transparent text-base bg-transparent text-text4 dark:text-text6 data-[state=active]:text-hover dark:data-[state=active]:text-tabText data-[state=active]:text-lg data-[state=active]:border-hover dark:data-[state=active]:border-tabText data-[state=active]:border-b-4'>Requests</TabsTrigger>
            </TabsList>
            <div className="ml-1 w-full mb-5 h-[1px] bg-tabBorder dark:bg-dark4"></div>
            <TabsContent value="all">
              {loading ? (
                <p>Loading notifications...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Card key={notification.notificationDetailId} className="w-full rounded-2xl h-44 mt-8 shadow-lg border-2 border-sky-600 dark:border-alertBorder dark:bg-dark3">
                    <CardHeader className="pt-0 mt-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">
                          {notification.notificationType === "USERAPPROVED" 
                            ? "User Approved" 
                            : notification.notificationType === "USERREJECTED" 
                            ? "User Rejected" 
                            : "User Created"}
                        </CardTitle>
                        <p className="text-text4 text-sm dark:text-text6">
                          {`${notification.timestamp[0]}/${notification.timestamp[1]}/${notification.timestamp[2]} at ${
                            notification.timestamp[3] === 0
                              ? 12
                              : notification.timestamp[3] > 12
                              ? notification.timestamp[3] - 12
                              : notification.timestamp[3]
                          }:${notification.timestamp[4]} ${
                            notification.timestamp[3] >= 12 ? 'PM' : 'AM'
                          }`}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="w-full">
                      <p className="text-lg font-normal text-text3 dark:text-light2">{notification.message}</p>
                      <div className="flex justify-end space-x-4">
                        {!notification.read && ( 
                          <>
                          <Button
                              className="rounded-lg shadow-lg outline-none dark:text-light1"
                              onClick={() => handleViewProfile(notification.requestId, notification.notificationId,notification.notificationType)}
                              disabled={loadingStates[notification.notificationId]} 
                            >
                              {loadingStates[notification.notificationId] ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                "View Profile"
                              )}
                            </Button>
                          <Button
                            className="border-2 border-hover bg-transparent text-hover hover:bg-hover hover:text-white"
                            onClick={() => markAsRead(notification.notificationDetailId
                              )} 
                          >
                            {
                              loadingStates.markAsRead[notification.notificationDetailId] ?(
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ): (
                                "Mark as Read"
                              )
                            }
                            
                          </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                ))
              ) : (
                <p>No notifications available</p>
              )}
              {selectedProfile && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto p-8 dark:bg-dark1">
                <DialogHeader>
                  <DialogTitle>User Profile Details</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
        
                  <div className="space-y-2">
                    <Label htmlFor="Username">Username</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Username"
                      value={selectedProfile.email || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="UserId">User ID</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="UserId"
                      value={selectedProfile.userId || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="AddressLine1">Address Line 1</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="AddressLine1"
                      value={selectedProfile.address || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="AddressCreatedBy">Created By</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="AddressCreatedBy"
                      value={selectedProfile.createdBy || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Email"
                      value={selectedProfile.email || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Name">Name</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Name"
                      value={selectedProfile.name || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="PhoneNumber">Phone Number</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="PhoneNumber"
                      value={selectedProfile.userPhoneNumber || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Branch">Branch</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Branch"
                      value={selectedProfile.branchId || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Grade">Grade</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Grade"
                      value={selectedProfile.grade || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="JoinedDate">Joined Date</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="JoinedDate"
                      value={selectedProfile.joinedDate || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Designation">Designation</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Designation"
                      value={selectedProfile.designation || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Department">Department</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Department"
                      value={selectedProfile.departmentId || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="NextReportingPerson">Next Reporting Person</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="NextReportingPerson"
                      value={selectedProfile.nextReportingPerson || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="maritalStatus"
                      value={selectedProfile.maritalStatus || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Role">Role</Label>
                    <div className="bg-gray-300 dark:bg-dark2 p-2 rounded-lg">
                    {selectedProfile.roles && selectedProfile.roles.map((role) => role.roleName).join(', ')}
                    </div>
                  </div>
                    </div>
                    {notificationType === "CREATEUSER" ? (
                    <div>
                    <div className="mt-4">
                      <label>Comment (Sending Back):</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg dark:bg-dark2 mt-4"
                      />
                    </div>
                    <div className="flex mt-3 space-x-4">
                      <Button onClick={() => handleApproveUser(selectedProfile.userId,selectedNotificationId)} className="bg-green-600 text-white">
                      {loadingStates.approve ? (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                  ) : (
                                    "Approve"
                                  )}
                      </Button>
                      <Button onClick={() => handleSendBack(selectedProfile.userId,selectedNotificationId)} className="bg-red-600 text-white">
                        {loadingStates.sendBack ? (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                  ) : (
                                    "Send Back"
                                  )}
                      </Button>
                          </div>
                      </div>
                    ) : notificationType === "USERAPPROVED" ? (
                    <Button onClick={() => handleSendEmail(selectedProfile.userId)} className=" text-white">
                    {loadingStates.sendBack ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                "Send Email"
                              )}
                      </Button>):<Button onClick={() => handleUpdateUser(selectedProfile.userId,selectedNotificationId)} className=" text-white">
                    {loadingStates.sendBack ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                "Update and Send Email"
                              )}
                      </Button>
                    }
              </DialogContent>
            </Dialog>
          )}
            </TabsContent>

            <TabsContent value="users">
              {loading ? (
                <p>Loading notifications...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : userNotifications.length > 0 ? (
                userNotifications.map((notification) => (
                  <Card key={notification.notificationId} className="w-full rounded-2xl h-44 mt-8 shadow-lg border-2 border-sky-600 dark:border-alertBorder dark:bg-dark3">
                    <CardHeader className="pt-0 mt-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">{notification.notificationType}</CardTitle>
                        <p className="text-text4 text-sm dark:text-text6">
                          {`${notification.timestamp[0]}/${notification.timestamp[1]}/${notification.timestamp[2]} at ${
                            notification.timestamp[3] === 0
                              ? 12
                              : notification.timestamp[3] > 12
                              ? notification.timestamp[3] - 12
                              : notification.timestamp[3]
                          }:${notification.timestamp[4]} ${
                            notification.timestamp[3] >= 12 ? 'PM' : 'AM'
                          }`}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="w-full">
                      <p className="text-lg">{notification.message}</p>
                      <div className="flex justify-end space-x-4">
                        {!notification.read && ( 
                          <>
                          <Button
                              className="rounded-lg shadow-lg outline-none dark:text-light1"
                              onClick={() => handleViewProfile(notification.requestId, notification.notificationId)}
                              disabled={loadingStates[notification.notificationId]} 
                            >
                              {loadingStates[notification.notificationId] ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                              ) : (
                                "View Profile"
                              )}
                            </Button>
                          <Button
                            className="border-2 border-hover bg-transparent text-hover hover:bg-hover hover:text-white"
                            onClick={() => markAsRead(notification.notificationId)} 
                          >
                            Mark as Read
                          </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No notifications available</p>
              )}
               

            {selectedProfile && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-y-auto p-8 dark:bg-dark1">
                <DialogHeader>
                  <DialogTitle>User Profile Details</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2">
        
                  <div className="space-y-2">
                    <Label htmlFor="Username">Username</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Username"
                      value={selectedProfile.email || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="UserId">User ID</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="UserId"
                      value={selectedProfile.userId || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="AddressLine1">Address Line 1</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="AddressLine1"
                      value={selectedProfile.address || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="AddressCreatedBy">Created By</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="AddressCreatedBy"
                      value={selectedProfile.createdBy || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Email"
                      value={selectedProfile.email || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Name">Name</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Name"
                      value={selectedProfile.name || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="PhoneNumber">Phone Number</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="PhoneNumber"
                      value={selectedProfile.userPhoneNumber || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Branch">Branch</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Branch"
                      value={selectedProfile.branchId || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Grade">Grade</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Grade"
                      value={selectedProfile.grade || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="JoinedDate">Joined Date</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="JoinedDate"
                      value={selectedProfile.joinedDate || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Designation">Designation</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Designation"
                      value={selectedProfile.designation || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Department">Department</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Department"
                      value={selectedProfile.departmentId || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="NextReportingPerson">Next Reporting Person</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="NextReportingPerson"
                      value={selectedProfile.nextReportingPerson || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="maritalStatus"
                      value={selectedProfile.maritalStatus || ''}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Role">Role</Label>
                    <Input
                      className="bg-gray-300 dark:bg-dark2"
                      id="Role"
                      value={selectedProfile.role || ''}
                      readOnly
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label>Comment (Sending Back):</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-dark2 mt-4"
                  />
                </div>
                <div className="flex mt-3 space-x-4">
                  <Button onClick={() => handleApproveUser(selectedProfile.userId,selectedNotificationId)} className="bg-green-600 text-white">
                    Approve
                  </Button>
                  <Button onClick={() => handleSendBack(selectedProfile.userId,selectedNotificationId)} className="bg-red-600 text-white">
                    Send Back
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
            </TabsContent>
            
            <TabsContent value="requests">
              {loading ? (
                <p>Loading notifications...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : requestNotifications.length > 0 ? (
                requestNotifications.map((notification) => (
                  <Card key={notification.notificationId} className="w-full rounded-2xl h-auto mt-8 shadow-lg">
                    <CardHeader className="pt-0 mt-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">{notification.notificationType}</CardTitle>
                        <p className="text-text4 text-sm dark:text-text6">
                          {notification.createdAt
                            ? formatDistanceToNow(parseTimestamp(notification.createdAt), { addSuffix: true })
                            : 'Date not available'}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="w-full">
                      <p className="text-lg">{notification.message}</p>
                      <div className="flex justify-end">
                        {!notification.read && ( 
                          <Button
                            className="rounded-lg shadow-lg outline-none text-lg dark:text-light1"
                            onClick={() => markAsRead(notification.notificationId)} 
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No notifications available</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </LayOut>
  );
};

export default Alerts;





