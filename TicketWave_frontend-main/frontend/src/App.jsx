import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { NotificationProvider } from "./context/NotificationContext";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <div className="App">
      <NotificationProvider>
        <AllRoutes />

        <ToastContainer />
      </NotificationProvider>
    </div>
  );
}

export default App;
