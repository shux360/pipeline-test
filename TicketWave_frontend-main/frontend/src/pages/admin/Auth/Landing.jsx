import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom"; // Import Link for navigation
import womanImage from '../../../assets/images/woman2.png';

function LandingPage() {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-5xl font-bold mb-6 text-[#0097A9]">Welcome to TICKETWAVE</h1>
          <p className="text-lg text-gray-700 mb-8">
            Start your journey with us today  with just one click!
          </p>
          
          {/* Login Button */}
          <Link to="/admin-sign-in">
            <Button className="w-full max-w-sm bg-[#0097A9] hover:bg-[#3d7278] mb-4">
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center justify-center w-1/2 bg-[#0097A9]">
        <div className="relative text-left text-3xl font-bold mb-5 px-10 pt-10 rounded-[30px] bg-[#58b7c2] text-white max-w-md w-7/12 h-[685px]">
          <h2 className="mb-5">Join us now!</h2>
          <h2 className="mb-3">Streamline your workflow with </h2>
          <h2 >TICKETWAVE</h2>
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

export default LandingPage;
