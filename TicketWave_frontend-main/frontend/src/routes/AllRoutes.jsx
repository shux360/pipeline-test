import { Route, Routes } from "react-router-dom";
import AdminLogs from "../pages/admin/AdminLogs/AdminLogs";
import Alerts from "../pages/admin/Alerts/Alerts";
import Analytics from "../pages/admin/Analytics/Analytics";
import AdminFPwd from "../pages/admin/Auth/AdminFPwd";
import ResetPwdAPage from "../pages/admin/Auth/AdminRPwd";
import AdminSignIn from "../pages/admin/Auth/AdminSignIn";
import AdminSignUp from "../pages/admin/Auth/AdminSignUp";
import LandingPage from "../pages/admin/Auth/Landing";
import Dashboard from "../pages/admin/Dashboard/Dashboard";

import AssignWorkflows from "../pages/admin/RequestType/AsssignWorkflows/AssignWorkflows";
import SelectWorkflows from "../pages/admin/RequestType/AsssignWorkflows/SelectWorkflows";
import ExistingRequestTypes from "../pages/admin/RequestType/ExistingRequestTypes";
import RequestType from "../pages/admin/RequestType/NewRequestType";
import Settings from "../pages/admin/Settings/Settings";
import CreateNewUser from "../pages/admin/User/CreateNewUser";
import ExistingUsers from "../pages/admin/User/ExistingUsers";
import AssignEmployee from "../pages/admin/Workflow/AssignEmployee";
import ExistingWorkflows from "../pages/admin/Workflow/ExistingWorkflows";
import NewWorkflow from "../pages/admin/Workflow/NewWorkflow";
import WorkFlowForms from "../pages/admin/Workflow/WorkflowForms";
import WorkFlowLevels from "../pages/admin/Workflow/WorkflowLevels";
import EAlerts from "../pages/employee/Alerts/Alerts";
import AllRequests from "../pages/employee/All Requests/AllRequests";
import FormSubmit from "../pages/employee/CreateRequest/FormSubmit";
import RequestsPage from "../pages/employee/CreateRequest/RequestsPage";
import EmployeeDashboard from "../pages/employee/Dashboard/Dashboard";
import Progress from "../pages/employee/Progress/Progress";
import Reports from "../pages/employee/Reports/Reports";
import EmployeeSettings from "../pages/employee/Settings/Settings";
// import AllRequests from '../pages/employee/All Requests/AllRequests';
// import Reports from '../pages/employee/Reports/Reports';

const AllRoutes = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin-dashboard" element={<Dashboard />} />
      <Route path="/new-user" element={<CreateNewUser />} />
      <Route path="/existing-users" element={<ExistingUsers />} />
      <Route path="/new-request-type" element={<RequestType />} />
      <Route path="/new-request-type/:urlRequestId" element={<RequestType />} />
      <Route path="/new-request-type/:requestId" element={<RequestType />} />
      <Route
        path="/existing-request-types"
        element={<ExistingRequestTypes />}
      />
      <Route path="/assign-workflows" element={<AssignWorkflows />} />
      <Route
        path="/assign-workflows/select-workflows"
        element={<SelectWorkflows />}
      />
      <Route path="/new-workflow" element={<NewWorkflow />} />
      <Route path="/new-workflow/:workflowId" element={<NewWorkflow />} />
      <Route path="/existing-workflows" element={<ExistingWorkflows />} />
      <Route path="/Workflow-levels/:workflowId" element={<WorkFlowLevels />} />
      <Route path="/edit-user/:userId" element={<CreateNewUser />} />
      <Route path="/Assign-employee" element={<AssignEmployee />} />
      <Route path="/Workflow-forms" element={<WorkFlowForms />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin-sign-in" element={<AdminSignIn />} />
      <Route path="/admin-sign-up" element={<AdminSignUp />} />
      <Route path="/admin-forget-pwd" element={<AdminFPwd />} />
      <Route path="/reset-password" element={<ResetPwdAPage />} />

      {/* Employee Routes */}
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/all-requests" element={<AllRequests />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/employee-settings" element={<EmployeeSettings />} />
      <Route path="/employee-alerts" element={<EAlerts />} />
      <Route path="/admin-logs" element={<AdminLogs />} />
      <Route path="/requests/:category" element={<RequestsPage />} />
      <Route path="/forms/:requestId" element={<FormSubmit />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  );
};

export default AllRoutes;
