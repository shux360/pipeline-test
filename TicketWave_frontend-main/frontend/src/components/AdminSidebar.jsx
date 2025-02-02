// import React, { useEffect, useRef, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import AdminLogsIcon from "../assets/icons/AdminLogs.png";
// // import AdminLogsDarkIcon from "../assets/icons/AdminLogsDark.png";
// import AlertsDark from "../assets/icons/AlertsDark.png";
// import AlertsDark2 from "../assets/icons/AlertsDark2.png";
// import Analysis1 from "../assets/icons/Analysis1.png";
// import AnalysisDark from "../assets/icons/AnalysisDark.png";
// import AnalysisDark2 from "../assets/icons/AnalysisDark2.png";
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
// import Settings from "../assets/icons/Settings.png";
// import Settings1 from "../assets/icons/Settings1.png";
// import SettingsDark from "../assets/icons/SettingsDark.png";
// import SettingsDark2 from "../assets/icons/SettingsDark2.png";
// import user from "../assets/icons/user.png";
// import UserDark2 from "../assets/icons/UserDark2.png";
// import Workflow from "../assets/icons/Workflow.png";
// import WorkflowDark2 from "../assets/icons/WorkflowDark2.png";
// import Logo from "../assets/logo/circula.png";

// const AdminSidebar = ({ darkMode }) => {
//   const isAdmin = true;

//   const sidebarRef = useRef(null);
//   const overlayRef = useRef(null);

//   const location = useLocation();

//   const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [isRequestDropdownOpen, setRequestDropdownOpen] = useState(false);
//   const [isWorkflowDropdownOpen, setWorkflowDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const activeClass =
//     "flex items-center p-2 group bg-hover dark:bg-hoverDark bg-opacity-25 w-52 rounded-xl ";
//   const inactiveClass =
//     "flex items-center text-text dark:text-text6 p-2 group hover:text-black dark:hover:text-light1 hover:bg-hover dark:hover:bg-hoverDark hover:bg-opacity-25 rounded-xl text-base w-52";

//   const toggleDropdown = (dropdown) => {
//     switch (dropdown) {
//       case "user":
//         setUserDropdownOpen((prev) => !prev);
//         break;
//       case "request":
//         setRequestDropdownOpen((prev) => !prev);
//         break;
//       case "workflow":
//         setWorkflowDropdownOpen((prev) => !prev);
//         break;
//       default:
//         break;
//     }
//   };

//   useEffect(() => {
//     if (
//       location.pathname.startsWith("/new-user") ||
//       location.pathname.startsWith("/existing-users")
//     ) {
//       setUserDropdownOpen(true);
//     }
//     if (
//       location.pathname.startsWith("/new-request-type") ||
//       location.pathname.startsWith("/existing-request-types") ||
//       location.pathname.startsWith("/assign-workflows")
//     ) {
//       setRequestDropdownOpen(true);
//     }
//     if (
//       location.pathname.startsWith("/new-workflow") ||
//       location.pathname.startsWith("/existing-workflows")
//     ) {
//       setWorkflowDropdownOpen(true);
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
//           <img src={Logo} className="w-[399px] h-32" />
//           {isAdmin && (
//             <ul className="space-y-3 font-medium ml-3.5 mt-9">
//               <li>
//                 <NavLink
//                   to="/admin-dashboard"
//                   className={({ isActive }) =>
//                     isActive ? activeClass : inactiveClass
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {isActive && (
//                         <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                       )}
//                       <img
//                         src={
//                           isActive
//                             ? darkMode
//                               ? DashboardDark
//                               : Dashboard
//                             : darkMode
//                             ? DashboardDark2
//                             : Dashbord2
//                         }
//                         alt="Dashboard"
//                         className="w-6 h-6"
//                       />
//                       <span className="ms-5">Dashboard</span>
//                     </>
//                   )}
//                 </NavLink>
//               </li>
//               <li>
//                 <button
//                   type="button"
//                   onClick={() => toggleDropdown("user")}
//                   className={inactiveClass}
//                 >
//                   <img
//                     src={darkMode ? UserDark2 : user}
//                     alt="User"
//                     className="w-6 h-6"
//                   />
//                   <span className="ms-5">User</span>
//                   <img
//                     src={Expand}
//                     className={`w-6 h-6 ms-auto ${
//                       isUserDropdownOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//                 {isUserDropdownOpen && (
//                   <ul className="py-2 space-y-2 ml-8">
//                     <li>
//                       <NavLink
//                         to="/new-user"
//                         className={({ isActive }) =>
//                           isActive
//                             ? activeClass.replace("w-52", "w-44")
//                             : inactiveClass.replace("w-52", "w-44 pl-6")
//                         }
//                       >
//                         Create New User
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink
//                         to="/existing-users"
//                         className={({ isActive }) =>
//                           isActive
//                             ? activeClass.replace("w-52", "w-44")
//                             : inactiveClass.replace("w-52", "w-44 pl-6")
//                         }
//                       >
//                         Existing Users
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>
//               <li>
//                 <button
//                   type="button"
//                   onClick={() => toggleDropdown("request")}
//                   className={inactiveClass}
//                 >
//                   <img
//                     src={darkMode ? FlipChartDark2 : Flipchart}
//                     alt="Request Type"
//                     className="w-6 h-6"
//                   />
//                   <span className="ms-5">Request Type</span>
//                   <img
//                     src={Expand}
//                     className={`w-6 h-6 ms-auto ${
//                       isRequestDropdownOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//                 {isRequestDropdownOpen && (
//                   <ul className="py-2 space-y-2 ml-8">
//                     <li>
//                       <NavLink
//                         to="/new-request-type"
//                         className={({ isActive }) =>
//                           isActive
//                             ? activeClass.replace("w-52", "w-44")
//                             : inactiveClass.replace("w-52", "w-44 pl-6")
//                         }
//                       >
//                         New Request Type
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink
//                         to="/existing-request-types"
//                         className={({ isActive }) =>
//                           isActive
//                             ? activeClass.replace("w-52", "w-44")
//                             : inactiveClass.replace("w-52", "w-44 pl-6")
//                         }
//                       >
//                         Existing Request Types
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink
//                         to="/assign-workflows"
//                         className={({ isActive }) =>
//                           isActive
//                             ? activeClass.replace("w-52", "w-auto")
//                             : inactiveClass.replace("w-52", "w-auto pl-6")
//                         }
//                       >
//                         {({ isActive }) => (
//                           <>
//                             {isActive && (
//                               <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-2" />
//                             )}
//                             <span>Assign Workflows</span>
//                           </>
//                         )}
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>

//               <li>
//                 <button
//                   type="button"
//                   onClick={() => toggleDropdown("workflow")}
//                   className={inactiveClass}
//                 >
//                   <img
//                     src={darkMode ? WorkflowDark2 : Workflow}
//                     alt="Workflow"
//                     className="w-6 h-6"
//                   />
//                   <span className="ms-5">Workflow</span>
//                   <img
//                     src={Expand}
//                     className={`w-6 h-6 ms-auto ${
//                       isWorkflowDropdownOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//                 {isWorkflowDropdownOpen && (
//                   <ul className="py-2 space-y-2 ml-8">
//                     <li>
//                       <NavLink
//                         to="/new-workflow"
//                         className={({ isActive }) =>
//                           isActive
//                             ? activeClass.replace("w-52", "w-44")
//                             : inactiveClass.replace("w-52", "w-44 pl-6")
//                         }
//                       >
//                         Create New Workflow
//                       </NavLink>
//                     </li>
//                     <li>
//                       <NavLink
//                         to="/existing-workflows"
//                         className={({ isActive }) =>
//                           isActive
//                             ? activeClass.replace("w-52", "w-44")
//                             : inactiveClass.replace("w-52", "w-44 pl-6")
//                         }
//                       >
//                         Existing Workflows
//                       </NavLink>
//                     </li>
//                   </ul>
//                 )}
//               </li>

//               <li>
//                 <NavLink
//                   to="/analytics"
//                   className={({ isActive }) =>
//                     isActive ? activeClass : inactiveClass
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {isActive && (
//                         <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                       )}
//                       <img
//                         src={
//                           isActive
//                             ? darkMode
//                               ? AnalysisDark
//                               : Analysis1
//                             : darkMode
//                             ? AnalysisDark2
//                             : graph
//                         }
//                         alt="Analytics"
//                         className="w-6 h-6"
//                       />
//                       <span className="ms-5 whitespace-nowrap">Analytics</span>
//                     </>
//                   )}
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/alerts"
//                   className={({ isActive }) =>
//                     isActive ? activeClass : inactiveClass
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {isActive && (
//                         <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                       )}
//                       <img
//                         src={
//                           isActive
//                             ? darkMode
//                               ? AlertsDark
//                               : Doorbell1
//                             : darkMode
//                             ? AlertsDark2
//                             : Bell
//                         }
//                         alt="Alerts"
//                         className="w-6 h-6"
//                       />
//                       <span className="ms-5 whitespace-nowrap">Alerts</span>
//                     </>
//                   )}
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink
//                   to="/settings"
//                   className={({ isActive }) =>
//                     isActive ? activeClass : inactiveClass
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {isActive && (
//                         <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                       )}
//                       <img
//                         src={
//                           isActive
//                             ? darkMode
//                               ? SettingsDark
//                               : Settings1
//                             : darkMode
//                             ? SettingsDark2
//                             : Settings
//                         }
//                         alt="Settings"
//                         className="w-6 h-6"
//                       />
//                       <span className="ms-5 whitespace-nowrap">Settings</span>
//                     </>
//                   )}
//                 </NavLink>
//               </li>

//               {/* New Admin Logs Item */}
//               <li>
//                 <NavLink
//                   to="/admin-logs"
//                   className={({ isActive }) =>
//                     isActive ? activeClass : inactiveClass
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {isActive && (
//                         <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-1" />
//                       )}
//                       <img
//                         src={
//                           isActive
//                             ? darkMode
//                               ? AdminLogsIcon
//                               : AdminLogsIcon
//                             : darkMode
//                             ? AdminLogIcon
//                             : AdminLogsIcon
//                         }
//                         alt="Admin Logs"
//                         className="w-6 h-6"
//                       />
//                       <span className="ms-5 whitespace-nowrap">Admin Logs</span>
//                     </>
//                   )}
//                 </NavLink>
//               </li>
//             </ul>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// };

// export default AdminSidebar;

import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import AdminLogIcon from "../assets/icons/AdminLogs.png";
import AlertsDark from "../assets/icons/AlertsDark.png";
import AlertsDark2 from "../assets/icons/AlertsDark2.png";
import Analysis1 from "../assets/icons/Analysis1.png";
import AnalysisDark from "../assets/icons/AnalysisDark.png";
import AnalysisDark2 from "../assets/icons/AnalysisDark2.png";
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
import user from "../assets/icons/user.png";
import UserDark2 from "../assets/icons/UserDark2.png";
import Workflow from "../assets/icons/Workflow.png";
import WorkflowDark2 from "../assets/icons/WorkflowDark2.png";
import Logo from "../assets/logo/circula.png";

const AdminSidebar = ({ darkMode }) => {
  const isAdmin = true;

  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  const location = useLocation();

  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isRequestDropdownOpen, setRequestDropdownOpen] = useState(false);
  const [isWorkflowDropdownOpen, setWorkflowDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeClass =
    "flex items-center p-2 group bg-hover dark:bg-hoverDark bg-opacity-25 w-52 rounded-xl ";
  const inactiveClass =
    "flex items-center text-text dark:text-text6 p-2 group hover:text-black dark:hover:text-light1 hover:bg-hover dark:hover:bg-hoverDark hover:bg-opacity-25 rounded-xl text-base w-52";

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case "user":
        setUserDropdownOpen((prev) => !prev);
        break;
      case "request":
        setRequestDropdownOpen((prev) => !prev);
        break;
      case "workflow":
        setWorkflowDropdownOpen((prev) => !prev);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (
      location.pathname.startsWith("/new-user") ||
      location.pathname.startsWith("/existing-users")
    ) {
      setUserDropdownOpen(true);
    }
    if (
      location.pathname.startsWith("/new-request-type") ||
      location.pathname.startsWith("/existing-request-types") ||
      location.pathname.startsWith("/assign-workflows")
    ) {
      setRequestDropdownOpen(true);
    }
    if (
      location.pathname.startsWith("/new-workflow") ||
      location.pathname.startsWith("/existing-workflows")
    ) {
      setWorkflowDropdownOpen(true);
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
          <img src={Logo} className="w-[399px] h-32" />
          {isAdmin && (
            <ul className="space-y-3 font-medium ml-3.5 mt-9">
              <li>
                <NavLink
                  to="/admin-dashboard"
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
                <button
                  type="button"
                  onClick={() => toggleDropdown("user")}
                  className={inactiveClass}
                >
                  <img
                    src={darkMode ? UserDark2 : user}
                    alt="User"
                    className="w-6 h-6"
                  />
                  <span className="ms-5">User</span>
                  <img
                    src={Expand}
                    className={`w-6 h-6 ms-auto ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isUserDropdownOpen && (
                  <ul className="py-2 space-y-2 ml-8">
                    <li>
                      <NavLink
                        to="/new-user"
                        className={({ isActive }) =>
                          isActive
                            ? activeClass.replace("w-52", "w-44")
                            : inactiveClass.replace("w-52", "w-44 pl-6")
                        }
                      >
                        Create New User
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/existing-users"
                        className={({ isActive }) =>
                          isActive
                            ? activeClass.replace("w-52", "w-44")
                            : inactiveClass.replace("w-52", "w-44 pl-6")
                        }
                      >
                        Existing Users
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => toggleDropdown("request")}
                  className={inactiveClass}
                >
                  <img
                    src={darkMode ? FlipChartDark2 : Flipchart}
                    alt="Request Type"
                    className="w-6 h-6"
                  />
                  <span className="ms-5">Request Type</span>
                  <img
                    src={Expand}
                    className={`w-6 h-6 ms-auto ${
                      isRequestDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isRequestDropdownOpen && (
                  <ul className="py-2 space-y-2 ml-8">
                    <li>
                      <NavLink
                        to="/new-request-type"
                        className={({ isActive }) =>
                          isActive
                            ? activeClass.replace("w-52", "w-44")
                            : inactiveClass.replace("w-52", "w-44 pl-6")
                        }
                      >
                        New Request Type
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/existing-request-types"
                        className={({ isActive }) =>
                          isActive
                            ? activeClass.replace("w-52", "w-44")
                            : inactiveClass.replace("w-52", "w-44 pl-6")
                        }
                      >
                        Existing Request Types
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/assign-workflows"
                        className={({ isActive }) =>
                          isActive
                            ? activeClass.replace("w-52", "w-auto")
                            : inactiveClass.replace("w-52", "w-auto pl-6")
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="w-1 h-5 bg-hover dark:bg-smallDark rounded-lg mr-2" />
                            )}
                            <span>Assign Workflows</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => toggleDropdown("workflow")}
                  className={inactiveClass}
                >
                  <img
                    src={darkMode ? WorkflowDark2 : Workflow}
                    alt="Workflow"
                    className="w-6 h-6"
                  />
                  <span className="ms-5">Workflow</span>
                  <img
                    src={Expand}
                    className={`w-6 h-6 ms-auto ${
                      isWorkflowDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isWorkflowDropdownOpen && (
                  <ul className="py-2 space-y-2 ml-8">
                    <li>
                      <NavLink
                        to="/new-workflow"
                        className={({ isActive }) =>
                          isActive
                            ? activeClass.replace("w-52", "w-44")
                            : inactiveClass.replace("w-52", "w-44 pl-6")
                        }
                      >
                        Create New Workflow
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/existing-workflows"
                        className={({ isActive }) =>
                          isActive
                            ? activeClass.replace("w-52", "w-44")
                            : inactiveClass.replace("w-52", "w-44 pl-6")
                        }
                      >
                        Existing Workflows
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <NavLink
                  to="/analytics"
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
                        alt="Analytics"
                        className="w-6 h-6"
                      />
                      <span className="ms-5 whitespace-nowrap">Analytics</span>
                    </>
                  )}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/alerts"
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
                      <span className="ms-5 whitespace-nowrap">Alerts</span>
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
                      <span className="ms-5 whitespace-nowrap">Settings</span>
                    </>
                  )}
                </NavLink>
              </li>

              {/* New Admin Logs Item */}
              <li>
                <NavLink
                  to="/admin-logs"
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
                              ? AdminLogIcon
                              : AdminLogIcon
                            : darkMode
                            ? AdminLogIcon
                            : AdminLogIcon
                        }
                        alt="Admin Logs"
                        className="w-6 h-6"
                      />
                      <span className="ms-5 whitespace-nowrap">Admin Logs</span>
                    </>
                  )}
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
