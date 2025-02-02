import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { React, useState } from "react";
import { toast } from "react-toastify";
import forgetImage from "../../../assets/images/Forget.png";

// function ForgetPwdAPage() {
//   return (
//     <div className="flex h-screen">
//       {/* Left Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 p-8">
//         <h1 className="  text-3xl font-bold mb-20">Forgot Password</h1>

//         {/* Email Input */}
//         <div className="w-full max-w-sm mb-10">
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <Input
//             type="email"
//             placeholder="Enter your email"
//             className="mt-1 block w-full"
//           />
//         </div>

//         {/* Sign In Button */}
//         <Button className="w-full max-w-sm bg-[#0097A9] hover:bg-[#3d7278] mb-4">
//           <Link to="/admin-reset-pwd" className="text-white">
//             Reset Password
//           </Link>
//         </Button>

//       </div>

//       {/* Right Section */}

//     {/* <div className="relative flex items-center justify-center w-1/2 bg-[#00A944]">
//     <div className="relative text-left text-3xl font-bold mb-2 px-5 pt-5 rounded-lg bg-[#17a89a] text-white max-w-md w-3/4 h-3/4">
//         <h2>Welcome back!</h2>
//         <h2>Access your dashboard</h2>
//         <h2>with a quick Sign in!</h2>
//         <div className="absolute bottom-0 left-0 w-full">
//         <img
//             src={womanImage}
//             alt="Welcome"
//             className="w-full h-auto object-contain"
//         />
//         </div>
//     </div>
//     </div> */}

//     <div className="relative flex items-center justify-center w-1/2 bg-[#0097A9]">
//         <div className="relative text-left text-3xl font-bold mb-5 px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-5/6">
//             <h2 className="mb-2">Don't Worry</h2>
//             <h2 className="mb-2">We've got you! </h2>
//             <h2 className="mb-2">Reset your password </h2>
//             <h2 className="mb-2">Here</h2>
//             <img
//                 src={forgetImage}
//                 alt="Welcome"
//                 className="w-full mb-10 object-cover"
//                 style={{ maxHeight: '150%' }}
//             />
//         </div>
//     </div>

//     </div>
//   );
// }

// export default ForgetPwdAPage;

function ForgetPwdAPage() {
  const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

  const [username, setUsername] = useState("");

  const handleResetPassword = async () => {
    try {
      console.log("Sending request to reset password for username:", username);

      // Use axios to send the request
      const response = await axios.post(
        `${backendUrl}/forgot-password?username=${username}`
      );

      console.log("Response from server:", response);

      if (response.status === 200) {
        // alert("Password reset link sent to your email.");
        toast.success("Password reset link sent to your email.");
      } else {
        // alert("Failed to send reset link.");
        toast.error("Failed to send reset link.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Server responded with status:", error.response.status);
        console.error("Response data:", error.response.data);
        toast.error("Server error. Please try again later.");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        toast.error("Error setting up request. Please try again later.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-20">Password Assistance</h1>

        {/* Username Input */}
        <div className="w-full max-w-sm mb-10">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        {/* Reset Password Button */}
        <Button
          className="w-full max-w-sm bg-[#0097A9] hover:bg-[#3d7278] mb-4"
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center justify-center w-1/2 bg-[#0097A9]">
        <div className="relative text-left text-3xl font-bold mb-5 px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-5/6">
          <h2 className="mb-2">Don't Worry</h2>
          <h2 className="mb-2">We've got you! </h2>
          <h2 className="mb-2">Reset your password </h2>
          <h2 className="mb-2">Here</h2>
          <img
            src={forgetImage}
            alt="Welcome"
            className="w-full mb-10 object-cover"
            style={{ maxHeight: "150%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ForgetPwdAPage;
