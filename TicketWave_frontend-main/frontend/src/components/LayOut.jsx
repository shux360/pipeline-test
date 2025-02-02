
import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSideBar";
import Header from "./Header";

const LayOut = ({ children, title }) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );

  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem("isAdmin"))
  );
  const isAdminToggle = JSON.parse(localStorage.getItem("adminToggle"));

  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem("user"));
  //   console.log("Stored data from local storage:", storedData);

  //   if (storedData && storedData.user && storedData.user.roles) {
  //     const hasAdminRole =
  //       storedData.user.roles.includes("ADMIN") ||
  //       storedData.user.roles.includes("SUPER_ADMIN");
  //     console.log("User has admin role:", hasAdminRole);
  //     setIsAdmin(hasAdminRole);
  //     localStorage.setItem("isAdmin", hasAdminRole);
  //     localStorage.setItem("adminToggle", hasAdminRole);
  //   } else {
  //     console.log("User or roles not found in local storage");
  //     setIsAdmin(false);
  //     localStorage.setItem("isAdmin", false);
  //     localStorage.setItem("adminToggle", false);
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChangeRole = () => {
    const newIsAdmin = !isAdmin;
    setIsAdmin(newIsAdmin);
    localStorage.setItem("isAdmin", newIsAdmin);
  };

  return (
    <div>
      <Header
        title={title}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdminToggle={isAdminToggle}
        // handleChangeRole={handleChangeRole}
      />

      {isAdminToggle ? (
        <AdminSidebar darkMode={darkMode} />
      ) : (
        <>
          <EmployeeSidebar darkMode={darkMode} />
          {/* {console.log("Rendering Employee Sidebar")} */}
        </>
      )}

      <div>{children}</div>
    </div>
  );
};

export default LayOut;
