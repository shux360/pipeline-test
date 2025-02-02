import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import resetImage from "../../../assets/images/reset.png";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

// function ResetPwdAPage() {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleChangePassword = () => {
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//     } else {
//       setError("");

//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 p-8">
//         <h1 className="text-3xl font-bold mb-6">Change Password</h1>

//         {/* New Password Input */}
//         <div className="w-full max-w-sm mb-4">
//           <label className="block text-sm font-medium text-gray-700">New Password</label>
//           <Input
//             type="password"
//             placeholder="Enter your password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             className="mt-1 block w-full"
//           />
//         </div>

//         {/* Confirm Password Input */}
//         <div className="w-full max-w-sm mb-2">
//           <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//           <Input
//             type="password"
//             placeholder="Enter your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="mt-1 block w-full"
//           />
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         {/* Change Password Button */}
//         <Button
//           className="w-full mt-5 max-w-sm bg-[#0097A9] hover:bg-[#3d7278] mb-4"
//           onClick={handleChangePassword}
//         >
//           Change Password
//         </Button>
//       </div>

//       {/* Right Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 p-8 bg-[#0097A9]">
//         <div className="text-left text-3xl font-bold px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-5/6">
//           <h2 className="mb-2">Thank you. Password</h2>
//           <h2 className="mb-2">Must be at least 8</h2>
//           <h2 className="mb-5">Characters</h2>
//           <div className="flex align-bottom">
//             <img
//               src={resetImage}
//               alt="Welcome"
//               className="w-full object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResetPwdAPage;

function ResetPwdAPage() {
  const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(
    new URLSearchParams(window.location.search).get("token")
  );

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      console.log(
        "Sending request to /new-password with token:",
        token,
        "and newPassword:",
        newPassword
      );
      const response = await axios.post(`${backendUrl}/new-password`, {
        token,
        newPassword,
      });

      console.log("Response:", response);
      if (response.status === 200) {
        window.location.href = "/";
        toast.success("Password reset successfully.");
      } else {
        alert("Failed to reset password.");
      }
    } catch (error) {
      console.error("Error:", error);
      console.error("Error Response:", error.response);
      toast.error("Failed to reset password. Please try again later.");
    }
  };
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-6">Change Password</h1>

        {/* New Password Input */}
        <div className="w-full max-w-sm mb-4">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="w-full max-w-sm mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Change Password Button */}
        <Button
          className="w-full mt-5 max-w-sm bg-[#0097A9] hover:bg-[#3d7278] mb-4"
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8 bg-[#0097A9]">
        <div className="text-left text-3xl font-bold px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-5/6">
          <h2 className="mb-2">Thank you. Password</h2>
          <h2 className="mb-2">Must be at least 8</h2>
          <h2 className="mb-5">Characters</h2>
          <div className="flex align-bottom">
            <img
              src={resetImage}
              alt="Welcome"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPwdAPage;
