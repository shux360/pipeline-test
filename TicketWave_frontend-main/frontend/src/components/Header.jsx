

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import dropdown from "../assets/icons/dropdown.png";
import ExpandDark from "../assets/icons/ExpandDark.png";
import logout from "../assets/icons/Logout.png";
import LogOutDark from "../assets/icons/LogoutDark.png";
import moon from "../assets/icons/Moon Symbol.png";
import user from "../assets/icons/profile.png";
import Sun from "../assets/icons/Sun.png";
import UserDark from "../assets/icons/UserDark.png";
import profile from "../assets/images/person_1.jpg";
import { useNotifications } from "../context/NotificationContext";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const Header = ({ title, darkMode, setDarkMode, isAdminToggle }) => {
  // const isAdmin =
  //   JSON.parse(localStorage.getItem("user.user.roles"))?.includes("ADMIN") ||
  //   JSON.parse(localStorage.getItem("user.user.roles"))?.includes(
  //     "SUPER_ADMIN"
  //   ) ||
  //   JSON.parse(localStorage.getItem("isAdmin"));
  // const [adminToggle, setAdminToggle] = useState(
  //   JSON.parse(localStorage.getItem("adminToggle")) || true
  // );
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(profile);
  const [firstName, setFirstName] = useState("User");
  const {
    notifications,
    setNotifications,
    hasNewNotification,
    setHasNewNotification,
  } = useNotifications();
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  };

  const userId = JSON.parse(localStorage.getItem("user")).user.userProfile
    .userId;
  const navigate = useNavigate();

  // Fetch current user details
  const fetchCurrentUser = async () => {
    try {
      const response = localStorage.getItem("user");
      const user = JSON.parse(response);
      const data = user.user;

      if (data.userProfile) {
        const name = data.userProfile.name || "";
        const [first] = name.split(" ");
        setFirstName(first);
        console.log(`User: ${first}`);
      }

      if (data.userProfile.profileImage) {
        const base64Image = `data:image/jpeg;base64,${data.userProfile.profileImage}`;
        setImagePreview(base64Image);
      } else {
        console.log("No profile picture available.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/notifications/${userId}`,
          { headers }
        );
        setNotifications(response.data);
        console.log("Response from backend:", response.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    const socket = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/ws-notifications`),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("WebSocket connected");
        socket.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log("Received notification:", notification);
            setNotifications((prev) => [notification, ...prev]);
            setHasNewNotification(true);
          } catch (err) {
            console.error("Failed to parse message body:", err);
          }
        });
      },
      onWebSocketClose: (event) => {
        console.warn("WebSocket closed:", event);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error details:", error);
      },
    });

    socket.activate();

    return () => {
      socket.deactivate();
    };
  }, [userId, setNotifications, setHasNewNotification]);

  // Handle notifications
  useEffect(() => {
    const displayedNotificationIds = new Set(
      JSON.parse(localStorage.getItem("displayedNotifications") || "[]")
    );

    const requestNotificationPermission = async () => {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    };

    requestNotificationPermission();

    notifications.forEach((notification) => {
      if (
        !notification.read &&
        !displayedNotificationIds.has(notification.notificationDetailId)
      ) {
        if (Notification.permission === "granted") {
          new Notification(notification.notificationType || "Notification", {
            body: notification.message,
            icon: "/path-to-icon.png",
          });
          displayedNotificationIds.add(notification.notificationDetailId);
        } else {
          console.warn("Notification permission not granted.");
        }
      }
    });

    localStorage.setItem(
      "displayedNotifications",
      JSON.stringify(Array.from(displayedNotificationIds))
    );
  }, [notifications]);

  // Handle notification click
  const handleNotificationClick = () => {
    setHasNewNotification(false);
    navigate("/alerts");
  };

  // Fetch user details on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Toggle between admin and user roles
  const handleChangeRole = () => {
    const newToggle = !isAdminToggle;
    // setAdminToggle(newToggle);
    localStorage.setItem("adminToggle", JSON.stringify(newToggle));

    // Navigate based on the new toggle state
    if (newToggle) {
      navigate("/admin-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminToggle");
    navigate("/admin-sign-in");
  };

  return (
    <>
      <nav className="fixed top-0 z-40 w-full h-20 bg-white dark:bg-dark3 shadow-md flex items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Title */}
        <div className="w-full sm:w-1/2 text-left flex justify-center sm:justify-start ml-0 sm:ml-64">
          <h1 className="font-semibold text-2xl lg:text-3xl text-text3 dark:text-light1">
            {title}
          </h1>
        </div>

        {/* Right-side icons */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Dark Mode Toggle */}
          <div className="w-10 h-10 rounded-full bg-icon-color dark:bg-dark4 flex justify-center items-center cursor-pointer">
            <img
              src={darkMode ? Sun : moon}
              onClick={() => setDarkMode(!darkMode)}
              className="w-6 h-6 transform rotate-y-180"
              alt="Toggle Dark Mode"
            />
          </div>

          {/* Notifications */}
          <div
            className="relative w-10 h-10 rounded-full bg-icon-color dark:bg-dark4 flex justify-center items-center cursor-pointer"
            onClick={handleNotificationClick}
          >
            <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-red-500" />
            {notifications.length > 0 && (
              <div className="absolute top-0.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex justify-center items-center z-10">
                <p className="text-xs text-white font-bold">
                  {notifications.length || 0}
                </p>
              </div>
            )}
            {hasNewNotification && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </div>

          {/* User Dropdown */}
          <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
            <DropdownMenuTrigger>
              <div className="flex items-center space-x-4 cursor-pointer">
                <img
                  src={imagePreview}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  alt="User Profile"
                />
                <div className="hidden sm:block text-sm font-medium text-gray-600 dark:text-white">
                  <h1 className="text-xl font-semibold">{firstName}</h1>
                  <p className="text-primary">
                    {isAdminToggle ? "Admin" : "User"}
                  </p>
                </div>
                <img
                  src={
                    isDropdownOpen
                      ? darkMode
                        ? ExpandDark
                        : dropdown
                      : dropdown
                  }
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  alt="Dropdown Icon"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 sm:w-52 dark:bg-dark4 rounded-xl">
              {/* Switch Role Button (Only for Admins) */}
              {isAdmin && (
                <div className="flex justify-center items-center w-full my-4">
                  <div
                    onClick={handleChangeRole}
                    className="text-sm cursor-pointer text-text1 dark:text-light2 border border-text2 px-4 py-2 rounded-lg hover:bg-hover hover:text-white hover:dark:bg-hoverDark"
                  >
                    Switch to {isAdminToggle ? "User" : "Admin"}
                  </div>
                </div>
              )}

              {/* Profile Link */}
              <DropdownMenuItem>
                <div className="flex items-center space-x-4">
                  <img
                    src={darkMode ? UserDark : user}
                    className="w-6 h-6"
                    alt="Profile Icon"
                  />
                  <Link
                    to={isAdminToggle ? "/settings" : "/employee-settings"}
                    className="text-sm font-medium text-text1 dark:text-light2"
                  >
                    Profile
                  </Link>
                </div>
              </DropdownMenuItem>

              {/* Logout Button */}
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center space-x-4 ">
                  <img
                    src={darkMode ? LogOutDark : logout}
                    className="w-6 h-6"
                    alt="Logout Icon"
                  />
                  <p
                    onClick={handleLogout}
                    className="text-sm font-medium text-text1 dark:text-light2 cursor-pointer"
                  >
                    Sign Out
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
};

export default Header;
