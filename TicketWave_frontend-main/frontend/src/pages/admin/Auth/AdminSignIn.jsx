// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import womanImage from '../../../assets/images/woman2.png';
// import { toast } from 'react-toastify';
// import eye from '../../../assets/icons/eye.png';
// import hide from '../../../assets/icons/hide.png';
// import { setCredentials } from '../../../slices/authSlice';
// import { useDispatch } from "react-redux";
// import spinner from '../../../assets/icons/spinner.svg';
// import '../../../components/Spinner.css'
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

// function SignInPage() {
//   const [isPassword, setIsPassword] = useState(true);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleSignIn = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: username,
//           password: password,
//         }),
//       });

//       const data = await response.json();
//       console.log("user", data);

//       if (data.token) {
//         localStorage.setItem("jwt", data.token);
//         toast.success("Login Successful!");
//         dispatch(setCredentials(data));
//         const roles = data.user.roles;
//         if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) {
//           navigate("/admin-dashboard");
//         } else {
//           navigate("/employee-dashboard");
//         }
//       } else {
//         toast.error("Login failed. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred. Please try again.");
//       console.log(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Left Section */}
//       <div className="flex flex-col justify-center items-center w-1/2 p-8">
//         <h1 className="text-3xl font-bold mb-6 text-dark1">Sign In</h1>

//         {/* Show error message if login fails */}
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         {/* Username Input */}
//         <div className="w-full max-w-sm mb-4">
//           <label className="block text-sm font-medium text-gray-700">Username</label>
//           <Input
//             type="text"
//             placeholder="Enter your username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="mt-1 block w-full bg-gray-100 focus:border-none focus:outline-none text-dark2"
//           />
//         </div>

//         {/* Password Input */}
//         <div className="w-full max-w-sm mb-2 relative">
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <Input
//             type={isPassword ? 'password' : 'text'}
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full outline-none bg-gray-100 focus:border-none focus:outline-none text-dark2"
//           />
//           <img
//             src={isPassword ? eye : hide}
//             className="w-4 h-4 absolute cursor-pointer right-2 bottom-3"
//             onClick={() => setIsPassword(!isPassword)}
//             alt="Toggle password visibility"
//           />
//         </div>

//         {/* Forgot Password Link */}
//         <div className="w-full max-w-sm text-right mb-6">
//           <a href="/admin-forget-pwd" className="text-sm text-[#0097A9]">Forgot Password</a>
//         </div>

//         {/* Sign In Button */}
//         <Button className="w-full max-w-sm bg-[#0097A9] hover:bg-[#3d7278] mb-4 text-light1 text-base" onClick={handleSignIn}>
//           {isLoading ? <img src={spinner} className="spinner-animation w-4 h-4" alt="spinner" /> : "Sign in"}
//         </Button>

//         <p className="text-sm text-dark1">
//           Do not have an account? <Link to="/admin-sign-up" className="text-[#0097A9]">Sign Up</Link>
//         </p>
//       </div>

//       {/* Right Section */}
//       <div className="relative flex items-center justify-center w-1/2 bg-[#0097A9]">
//         <div className="relative text-left text-3xl font-bold mb-5 px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-[685px]">
//           <h2 className="mb-5">Welcome back!</h2>
//           <h2 className="mb-3">Access your dashboard with a quick Sign in!</h2>
//         </div>
//       </div>

//       <img
//         src={womanImage}
//         alt="Welcome"
//         className="w-[700px] h-auto mt-40 absolute bottom-10 right-40"
//       />
//     </div>
//   );
// }

// export default SignInPage;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import eye from "../../../assets/icons/eye.png";
import hide from "../../../assets/icons/hide.png";
import spinner from "../../../assets/icons/spinner.svg";
import womanImage from "../../../assets/images/woman2.png";
import "../../../components/Spinner.css";
import { setCredentials } from "../../../slices/authSlice";

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

function SignInPage() {
  const [isPassword, setIsPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("user", data);

      if (data.passwordReset == false) {
        navigate("/admin-forget-pwd");
        return;
      }

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        toast.success("Login Successful!");
        dispatch(setCredentials(data));
        const roles = data.user.roles;
        if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) {
          localStorage.setItem("isAdmin", true);
          localStorage.setItem("adminToggle", true);
          navigate("/admin-dashboard");
        } else {
          localStorage.setItem("isAdmin", false);
          localStorage.setItem("adminToggle", false);
          navigate("/employee-dashboard");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-6 text-dark1">Sign In</h1>

        {/* Show error message if login fails */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Username Input */}
        <div className="w-full max-w-sm mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full bg-gray-100 focus:border-none focus:outline-none text-dark2"
          />
        </div>

        {/* Password Input */}
        <div className="w-full max-w-sm mb-2 relative">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            type={isPassword ? "password" : "text"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full outline-none bg-gray-100 focus:border-none focus:outline-none text-dark2"
          />
          <img
            src={isPassword ? eye : hide}
            className="w-4 h-4 absolute cursor-pointer right-2 bottom-3"
            onClick={() => setIsPassword(!isPassword)}
            alt="Toggle password visibility"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="w-full max-w-sm text-right mb-6">
          <a href="/admin-forget-pwd" className="text-sm text-[#0097A9]">
            Forgot Password
          </a>
        </div>

        {/* Sign In Button */}
        <Button
          className="w-full max-w-sm bg-[#0097A9] hover:bg-[#3d7278] mb-4 text-light1 text-base"
          onClick={handleSignIn}
        >
          {isLoading ? (
            <img
              src={spinner}
              className="spinner-animation w-4 h-4"
              alt="spinner"
            />
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="text-sm text-dark1">
          Do not have an account?{" "}
          <Link to="/admin-sign-up" className="text-[#0097A9]">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center justify-center w-1/2 bg-[#0097A9]">
        <div className="relative text-left text-3xl font-bold mb-5 px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-[685px]">
          <h2 className="mb-5">Welcome back!</h2>
          <h2 className="mb-3">Access your dashboard with a quick Sign in!</h2>
        </div>
      </div>

      <img
        src={womanImage}
        alt="Welcome"
        className="w-[700px] h-auto mt-40 absolute bottom-10 right-40"
      />
    </div>
  );
}

export default SignInPage;
