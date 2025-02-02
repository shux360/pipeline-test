// import React, { useEffect, useRef, useState } from "react";
// import { NavLink, useLocation,useNavigate } from "react-router-dom";
// import AlertsDark from "../assets/icons/AlertsDark.png";
// import AlertsDark2 from "../assets/icons/AlertsDark2.png";
// import Analysis1 from "../assets/icons/Analysis1.png";
// import AnalysisDark from "../assets/icons/AnalysisDark.png";
// import AnalysisDark2 from "../assets/icons/AnalysisDark2.png";
// import CreateRequestIcon from "../assets/icons/CreateRequest.png";
// import Dashboard from "../assets/icons/Dashboard1.png";
// import Dashbord2 from "../assets/icons/Dashboard2.png";
// import DashboardDark from "../assets/icons/DashboardDark.png";
// import DashboardDark2 from "../assets/icons/DashboardDark2.png";
// import Bell from "../assets/icons/Doorbell.png";
// import Doorbell1 from "../assets/icons/Doorbell1.png";
// import Expand from "../assets/icons/Expand.png";
// import Flipchart from "../assets/icons/Flipchart.png";
// import FlipChartDark2 from "../assets/icons/FlipChartDark2.png";
// import graph from "../assets/icons/graph.png";
// import HRRequestIcon from "../assets/icons/HRRequest.png";
// import ManageLeaveIcon from "../assets/icons/ManageLeaveIcon.png";
// import Settings from "../assets/icons/Settings.png";
// import Settings1 from "../assets/icons/Settings1.png";
// import SettingsDark from "../assets/icons/SettingsDark.png";
// import SettingsDark2 from "../assets/icons/SettingsDark2.png";
// import Logo from "../assets/logo/circula.png";

// const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;import axios from 'axios';

// const EmployeeSidebar = ({ darkMode }) => {
//   const sidebarRef = useRef(null);
//   const overlayRef = useRef(null);
//   const location = useLocation();

//   const [isCreateRequestOpen, setCreateRequestOpen] = useState(false);
//   const [isManageLeaveOpen, setManageLeaveOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [categorizedRequests, setCategorizedRequests] = useState({});
//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const headers = {
//     'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
//     'Content-Type': 'application/json',
//   };

//   const getUserRole = (userResponse) => {
//     const adminRoles = ["SUPER_ADMIN", "ADMIN"];
//     const userRoles = userResponse.user.roles;

//     const nonAdminRoles = userRoles.filter((role) => !adminRoles.includes(role));

//     if (nonAdminRoles.length > 0) {
//       return nonAdminRoles[0];
//     }

//   };

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userRole = getUserRole(user);
//   // console.log("User Role:", userRole);

//   const activeClass =
//     "flex items-center p-2 group bg-hover dark:bg-hoverDark bg-opacity-25 w-52 rounded-xl ";
//   const inactiveClass =
//     "flex items-center text-text dark:text-text6 p-2 group hover:text-black dark:hover:text-light1 hover:bg-hover dark:hover:bg-hoverDark hover:bg-opacity-25 rounded-xl text-base w-52";

//   const toggleDropdown = (dropdown) => {
//     switch (dropdown) {
//       case "createRequest":
//         setCreateRequestOpen((prev) => !prev);
//         break;
//       default:
//         break;
//     }
//   };

//   useEffect(() => {
//     const fetchCategorizedRequests = async () => {

//       if (!userRole) {
//         setError("User role not found in localStorage.");
//         return;
//       }

//       try {
//         const response = await axios.get(`${backendUrl}/requests/by-role`, {
//           params: { role: userRole },headers
//         });
//         console.log("Categorized requests:", response.data);
//         setCategorizedRequests(response.data);
//       } catch (error) {
//         console.error("Error fetching categorized requests:", error);
//         setError("Failed to fetch categorized requests. Please try again later.");
//       }
//     };

//     fetchCategorizedRequests();
//   }, [userRole]);

//   const handleCategoryClick = (category) => {
//     const requests = categorizedRequests[category];
//     navigate(`/requests/${category}`, { state: { requests } });
//   };

//   // Keep dropdowns open when navigating within their children
//   useEffect(() => {
//     if (
//       location.pathname.startsWith("/requests/:category")
//     ) {
//       setCreateRequestOpen(true);
//     }

//   }, [location.pathname]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     if (isMobileMenuOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isMobileMenuOpen]);

//   // const activeClass =
//   // "flex items-center p-2 group bg-hover dark:bg-hoverDark bg-opacity-25 w-52 rounded-xl ";
//   // const inactiveClass =
//   // "flex items-center text-text dark:text-text6 p-2 group hover:text-black dark:hover:text-light1 hover:bg-hover dark:hover:bg-hoverDark hover:bg-opacity-25 rounded-xl text-base w-52";

//   return (
//     <>
//       <div className="mt-24"></div>
//       <button
//         data-drawer-target="default-sidebar"
//         data-drawer-toggle="default-sidebar"
//         aria-controls="default-sidebar"
//         type="button"
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="ml-6 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//       >
//         <span className="sr-only">Open sidebar</span>
//         <svg
//           className="w-6 h-6"
//           aria-hidden="true"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             clipRule="evenodd"
//             fillRule="evenodd"
//             d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//           ></path>
//         </svg>
//       </button>

//       {isMobileMenuOpen && (
//         <div
//           ref={overlayRef}
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//         ></div>
//       )}
//       <aside
//         id="sidebar-multi-level-sidebar"
//         ref={sidebarRef}
//         className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } sm:translate-x-0 bg-white shadow-lg dark:bg-dark3`}
//       >
//         <div className="h-full px-3 py-4 overflow-y-auto bg-white shadow-lg dark:bg-dark3">
//           <img src={Logo} className="w-[399px] h-32" alt="Logo" />
//           <ul className="space-y-3 font-medium ml-3.5 mt-9">
//             <li>
//               <NavLink
//                 to="/employee-dashboard"
//                 className={({ isActive }) =>
//                   isActive ? activeClass : inactiveClass
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {isActive && (
//                       <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                     )}
//                     <img
//                       src={
//                         isActive
//                           ? darkMode
//                             ? DashboardDark
//                             : Dashboard
//                           : darkMode
//                           ? DashboardDark2
//                           : Dashbord2
//                       }
//                       alt="Dashboard"
//                       className="w-6 h-6"
//                     />
//                     <span className="ms-5">Dashboard</span>
//                   </>
//                 )}
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/all-requests"
//                 className={({ isActive }) =>
//                   isActive ? activeClass : inactiveClass
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {isActive && (
//                       <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                     )}
//                     <img
//                       src={darkMode ? FlipChartDark2 : Flipchart}
//                       alt="All Requests"
//                       className="w-6 h-6"
//                     />
//                     <span className="ms-5">All Requests</span>
//                   </>
//                 )}
//               </NavLink>
//             </li>

//             <li>
//               <button
//                 type="button"
//                 onClick={() => toggleDropdown("createRequest")}
//                 className={inactiveClass}
//               >
//                 <img
//                   src={CreateRequestIcon}
//                   alt="Create Request"
//                   className="w-6 h-6"
//                 />
//                 <span className="ms-5">Create a request</span>
//                 <img
//                   src={Expand}
//                   className={`w-6 h-6 ms-auto ${
//                     isCreateRequestOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>
//               {isCreateRequestOpen && (
//                 <ul className="py-2 space-y-2 ml-11">
//                   {Object.keys(categorizedRequests).map((category) => (
//                     <li key={category}>
//                       <button
//                         onClick={() => handleCategoryClick(category)}
//                         className="flex items-center p-2 text-text dark:text-text6 group hover:text-black dark:hover:text-light1 hover:bg-hover dark:hover:bg-hoverDark hover:bg-opacity-25 rounded-xl text-base w-44"
//                       >

//                         <span>{category}</span>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>

//             <li>
//               <NavLink
//                 to="/reports"
//                 className={({ isActive }) =>
//                   isActive ? activeClass : inactiveClass
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {isActive && (
//                       <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                     )}
//                     <img
//                       src={
//                         isActive
//                           ? darkMode
//                             ? AnalysisDark
//                             : Analysis1
//                           : darkMode
//                           ? AnalysisDark2
//                           : graph
//                       }
//                       alt="Reports"
//                       className="w-6 h-6"
//                     />
//                     <span className="ms-5">Reports</span>
//                   </>
//                 )}
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/employee-alerts"
//                 className={({ isActive }) =>
//                   isActive ? activeClass : inactiveClass
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {isActive && (
//                       <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                     )}
//                     <img
//                       src={
//                         isActive
//                           ? darkMode
//                             ? AlertsDark
//                             : Doorbell1
//                           : darkMode
//                           ? AlertsDark2
//                           : Bell
//                       }
//                       alt="Alerts"
//                       className="w-6 h-6"
//                     />
//                     <span className="ms-5">Alerts</span>
//                   </>
//                 )}
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/settings"
//                 className={({ isActive }) =>
//                   isActive ? activeClass : inactiveClass
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {isActive && (
//                       <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                     )}
//                     <img
//                       src={
//                         isActive
//                           ? darkMode
//                             ? SettingsDark
//                             : Settings1
//                           : darkMode
//                           ? SettingsDark2
//                           : Settings
//                       }
//                       alt="Settings"
//                       className="w-6 h-6"
//                     />
//                     <span className="ms-5">Settings</span>
//                   </>
//                 )}
//               </NavLink>
//             </li>
//           </ul>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default EmployeeSidebar;

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AlertsDark from "../assets/icons/AlertsDark.png";
import AlertsDark2 from "../assets/icons/AlertsDark2.png";
import Analysis1 from "../assets/icons/Analysis1.png"; // Reused for Progress
import AnalysisDark from "../assets/icons/AnalysisDark.png"; // Reused for Progress
import AnalysisDark2 from "../assets/icons/AnalysisDark2.png"; // Reused for Progress
import CreateRequestIcon from "../assets/icons/CreateRequest.png";
import Dashboard from "../assets/icons/Dashboard1.png";
import Dashbord2 from "../assets/icons/Dashboard2.png";
import DashboardDark from "../assets/icons/DashboardDark.png";
import DashboardDark2 from "../assets/icons/DashboardDark2.png";
import Bell from "../assets/icons/Doorbell.png";
import Doorbell1 from "../assets/icons/Doorbell1.png";
import Expand from "../assets/icons/Expand.png";
import Flipchart from "../assets/icons/Flipchart.png";
import FlipChartDark2 from "../assets/icons/FlipChartDark2.png";
import graph from "../assets/icons/graph.png";
import Settings from "../assets/icons/Settings.png";
import Settings1 from "../assets/icons/Settings1.png";
import SettingsDark from "../assets/icons/SettingsDark.png";
import SettingsDark2 from "../assets/icons/SettingsDark2.png";
import Logo from "../assets/logo/circula.png";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const EmployeeSidebar = ({ darkMode }) => {
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const location = useLocation();

  const [isCreateRequestOpen, setCreateRequestOpen] = useState(false);
  const [isManageLeaveOpen, setManageLeaveOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categorizedRequests, setCategorizedRequests] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  };

  const getUserRole = (userResponse) => {
    const adminRoles = ["SUPER_ADMIN", "ADMIN"];
    const userRoles = userResponse.user.roles;

    const nonAdminRoles = userRoles.filter(
      (role) => !adminRoles.includes(role)
    );

    if (nonAdminRoles.length > 0) {
      return nonAdminRoles[0];
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = getUserRole(user);

  const activeClass =
    "flex items-center p-2 group bg-hover dark:bg-hoverDark bg-opacity-25 w-52 rounded-xl ";
  const inactiveClass =
    "flex items-center text-text dark:text-text6 p-2 group hover:text-black dark:hover:text-light1 hover:bg-hover dark:hover:bg-hoverDark hover:bg-opacity-25 rounded-xl text-base w-52";

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case "createRequest":
        setCreateRequestOpen((prev) => !prev);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchCategorizedRequests = async () => {
      if (!userRole) {
        setError("User role not found in localStorage.");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/requests/by-role`, {
          params: { role: userRole },
          headers,
        });
        setCategorizedRequests(response.data);
      } catch (error) {
        console.error("Error fetching categorized requests:", error);
        setError(
          "Failed to fetch categorized requests. Please try again later."
        );
      }
    };

    fetchCategorizedRequests();
  }, [userRole]);

  const handleCategoryClick = (category) => {
    const requests = categorizedRequests[category];
    navigate(`/requests/${category}`, { state: { requests } });
  };

  useEffect(() => {
    if (location.pathname.startsWith("/requests/:category")) {
      setCreateRequestOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="mt-24"></div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="ml-6 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}
      <aside
        id="sidebar-multi-level-sidebar"
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-white shadow-lg dark:bg-dark3`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white shadow-lg dark:bg-dark3">
          <img src={Logo} className="w-[399px] h-32" alt="Logo" />
          <ul className="space-y-3 font-medium ml-3.5 mt-9">
            <li>
              <NavLink
                to="/employee-dashboard"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
                    )}
                    <img
                      src={
                        isActive
                          ? darkMode
                            ? DashboardDark
                            : Dashboard
                          : darkMode
                          ? DashboardDark2
                          : Dashbord2
                      }
                      alt="Dashboard"
                      className="w-6 h-6"
                    />
                    <span className="ms-5">Dashboard</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/all-requests"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
                    )}
                    <img
                      src={darkMode ? FlipChartDark2 : Flipchart}
                      alt="All Requests"
                      className="w-6 h-6"
                    />
                    <span className="ms-5">All Requests</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <button
                type="button"
                onClick={() => toggleDropdown("createRequest")}
                className={inactiveClass}
              >
                <img
                  src={CreateRequestIcon}
                  alt="Create Request"
                  className="w-6 h-6"
                />
                <span className="ms-5">Create a request</span>
                <img
                  src={Expand}
                  className={`w-6 h-6 ms-auto ${
                    isCreateRequestOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isCreateRequestOpen && (
                <ul className="py-2 space-y-2 ml-11">
                  {Object.keys(categorizedRequests).map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className="flex items-center p-2 text-text dark:text-text6 group hover:text-black dark:hover:text-light1 hover:bg-hover dark:hover:bg-hoverDark hover:bg-opacity-25 rounded-xl text-base w-44"
                      >
                        <span>{category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
                    )}
                    <img
                      src={
                        isActive
                          ? darkMode
                            ? AnalysisDark
                            : Analysis1
                          : darkMode
                          ? AnalysisDark2
                          : graph
                      }
                      alt="Reports"
                      className="w-6 h-6"
                    />
                    <span className="ms-5">Reports</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/employee-alerts"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
                    )}
                    <img
                      src={
                        isActive
                          ? darkMode
                            ? AlertsDark
                            : Doorbell1
                          : darkMode
                          ? AlertsDark2
                          : Bell
                      }
                      alt="Alerts"
                      className="w-6 h-6"
                    />
                    <span className="ms-5">Alerts</span>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
                    )}
                    <img
                      src={
                        isActive
                          ? darkMode
                            ? SettingsDark
                            : Settings1
                          : darkMode
                          ? SettingsDark2
                          : Settings
                      }
                      alt="Settings"
                      className="w-6 h-6"
                    />
                    <span className="ms-5">Settings</span>
                  </>
                )}
              </NavLink>
            </li>

            {/* New Progress Item */}
            <li>
              <NavLink
                to="/progress"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
                    )}
                    <img
                      src={
                        isActive
                          ? darkMode
                            ? AnalysisDark
                            : Analysis1
                          : darkMode
                          ? AnalysisDark2
                          : graph
                      }
                      alt="Progress"
                      className="w-6 h-6"
                    />
                    <span className="ms-5">Progress</span>
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;
