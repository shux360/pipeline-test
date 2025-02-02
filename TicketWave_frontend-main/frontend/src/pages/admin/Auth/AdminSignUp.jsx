

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// // import eyeOff from '../assets/icons/hide.png';
// // import eye from '../assets/icons/view.png';
// import womanImage from '../../../assets/images/woman2.png';



// const SignUp = ()=>{
//     const [isPassword, setIsPassword] = useState(true);
//     const [isConfirmPassword, setIsConfirmPassword] = useState(true);
//     return(
//         <div className="flex h-screen">
//             <div className="w-1/2 p-5 bg-white flex items-center justify-center">
//                 <Card className="border-transparent w-1/2 h-3/4">
//                     <CardHeader>
//                         <CardTitle mt-8>Sign Up</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <form className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700" htmlFor="name">Username</label>
//                                 <Input 
//                                 id="name" 
//                                 type="name" 
//                                 placeholder="Enter your Username" 
//                                 className="bg-gray-100 mb-6 mt-2"
//                                 />

//                                 <label className="block text-sm font-medium text-gray-700" htmlFor="id">UserID</label>
//                                 <Input 
//                                     id="id" 
//                                     type="text" 
//                                     placeholder="Enter your ID" 
//                                     className="bg-gray-100 mb-6 mt-2"
//                                 />


//                                 <div className="relative">
//                                     <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
//                                     <Input 
//                                     id="password" 
//                                     type={isPassword ? 'password' : 'text'}
//                                     placeholder="Enter your Password" 
//                                     className="bg-gray-100 mb-6 mt-2"
//                                     />
//                                     <div className="absolute top-10 right-2">
//                                         {/* <img src={isPassword ? eye : eyeOff} alt="eye" className="w-4 h-4 cursor-pointer" onClick={()=>setIsPassword(!isPassword)}/> */}
//                                     </div>
//                                 </div>

//                                 <div className="relative">
//                                     <label className="block text-sm font-medium text-gray-700" htmlFor="password">Confirm Password</label>
//                                     <Input 
//                                     id="c_passowrd" 
//                                     type={isConfirmPassword ? "password" : "text"} 
//                                     placeholder="Confirm your Password" 
//                                     className="bg-gray-100 mb-6 mt-2"
//                                     />
//                                     <div className="absolute top-10 right-2">
//                                         {/* <img src={isConfirmPassword ? eye : eyeOff} alt="eye" className="w-4 h-4 cursor-pointer" onClick={()=>setIsConfirmPassword(!isConfirmPassword)}/> */}
//                                     </div>
//                                 </div>
//                             </div>
                            

//                             <div className="flex justify-start"> 
//                                 <div className="mr-3">
//                                     <Checkbox className="border-black bg-[#0097A9]"/>
//                                 </div>
//                                 <div className="text-sm">
//                                 <p>Remember me</p>
                                
//                                 </div>
//                             </div>
//                             <Button className="w-full bg-[#0097A9] hover:bg-[#3d7278]" type="submit">
//                                 Sign Up
//                             </Button>


//                         </form>

//                         <div className="flex justify-center mt-5"> 
//                             <div className="mr-3 text-sm">
//                                 <p>Already have an account?</p>
//                             </div>
//                             <div className="text-sm">
//                                 <Link to="/admin-sign-in" className="text-teal-500 text-sm">Sign in</Link>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//         <div className="relative flex items-center justify-center w-1/2 bg-[#0097A9]">
//             <div className="relative text-left text-3xl font-bold mb-5 px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-[645px]">
//                 <h2 className="mb-2">Unlock new</h2>
//                 <h2 className="mb-2">Possibilities with us! </h2>
//                 <h2 className="mb-2">Sign Up now!</h2>
//                 <div className="absolute bottom-0 left-0 w-full">
               
//             </div>
           
//         </div>
//         <img
//               src={womanImage}
//               alt="Welcome"
//               className="w-[700px] h-auto mt-40 absolute top-50 right-40"
              
//             />
//     </div>
            


//         </div>
//     )
// };

// export default SignUp;






import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import womanImage from '../../../assets/images/woman2.png';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_SERVER_DOMAIN;

const SignUp = () => {
    const [formData, setFormData] = useState({
        userId: '',
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
    });
    const [isPassword, setIsPassword] = useState(true);
    const [isConfirmPassword, setIsConfirmPassword] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/signup`, {
                userId: formData.userId,
                username: formData.username,
                password: formData.password
            });
            console.log(response.data); // Handle success (e.g., redirect to login page)
            toast.success('Account created successfully');
            navigate('/admin-sign-in'); 
            
        } catch (error) {
            console.error("Error signing up", error);
            toast.error('Error signing up');
        }
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/2 p-5 bg-white flex items-center justify-center">
                <Card className="border-transparent w-1/2 h-3/4">
                    <CardHeader>
                        <CardTitle mt-8>Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error && <p className="text-red-500">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter your Username"
                                    className="bg-gray-100 mb-6 mt-2"
                                    value={formData.username}
                                    onChange={handleChange}
                                />

                                <label className="block text-sm font-medium text-gray-700" htmlFor="userId">User ID</label>
                                <Input
                                    id="userId"
                                    name="userId"
                                    type="text"
                                    placeholder="Enter your ID"
                                    className="bg-gray-100 mb-6 mt-2"
                                    value={formData.userId}
                                    onChange={handleChange}
                                />

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={isPassword ? 'password' : 'text'}
                                        placeholder="Enter your Password"
                                        className="bg-gray-100 mb-6 mt-2"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute top-10 right-2">
                                        {/* Toggle visibility logic */}
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={isConfirmPassword ? 'password' : 'text'}
                                        placeholder="Confirm your Password"
                                        className="bg-gray-100 mb-6 mt-2"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute top-10 right-2">
                                        {/* Toggle visibility logic */}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <div className="mr-3">
                                    <Checkbox
                                        className="border-black bg-[#0097A9]"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="text-sm">
                                    <p>Remember me</p>
                                </div>
                            </div>
                            <Button className="w-full bg-[#0097A9] hover:bg-[#3d7278]" type="submit" onClick={handleSubmit}>
                            Sign Up
                            </Button>
                        </form>

                        <div className="flex justify-center mt-5">
                            <div className="mr-3 text-sm">
                                <p>Already have an account?</p>
                            </div>
                            <div className="text-sm">
                                <Link to="/admin-sign-in" className="text-teal-500 text-sm">Sign in</Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="relative flex items-center justify-center w-1/2 bg-[#0097A9]">
                <div className="relative text-left text-3xl font-bold mb-12 px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-[645px]">
                    <h2 className="mb-2">Unlock new</h2>
                    <h2 className="mb-2">Possibilities with us!</h2>
                    <h2 className="mb-2">Sign Up now!</h2>
                    <div className="absolute bottom-0 left-0 w-full"></div>
                </div>
                <img
                    src={womanImage}
                    alt="Welcome"
                    className="w-[700px] h-auto mt-40 absolute top-50 right-40"
                />
            </div>
        </div>
    );
};

export default SignUp;
