import { useDispatch } from "react-redux";
import authService from "../appwrite/auth.js";
import { logout as authLogout } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  // State to handle the mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
    dispatch(authLogout());
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white mb-3 shadow-lg">
      <div className="flex items-center">
        <img 
          src="https://res.cloudinary.com/dxa1zkub6/image/upload/v1742454234/n9be50sy1b8oyabhy2yl.png" 
          alt="Logo" 
          className="h-16 w-16 sm:h-14 sm:w-14 rounded-full shadow-lg mb-3" 
        />
      </div>

      {/* Toggle button for small screens */}
      <div className="sm:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white focus:outline-none"
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop/Tablet view */}
      <div className="hidden sm:flex items-center space-x-4 sm:space-x-6">
        <button
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out focus:ring-4 focus:ring-blue-300"
        >
          Log Out
        </button>

        <div className="flex flex-col items-center">
          <FaUserCircle className="h-12 w-12 text-gray-300 hover:text-white transition-transform duration-300 hover:scale-110" />
          <span className="text-sm sm:text-base mt-2 font-semibold text-gray-100 tracking-wide">
            {user?.name || "Guest"}
          </span>
        </div>
      </div>

      {/* Mobile view menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-gray-700 max-w-fit text-white rounded-lg shadow-lg p-4 sm:hidden w-48 z-10">
          {/* User Profile at the top */}
          <div className="flex flex-col items-center mb-4">
            <FaUserCircle className="h-12 w-12 text-gray-300 mb-2" />
            <span className="text-sm sm:text-base font-semibold text-gray-100 tracking-wide">
              {user?.name || "Guest"}
            </span>
          </div>

          {/* Log Out button below */}
          <div className="w-full flex justify-center">
            <button
              onClick={handleLogout}
              className="block w-8/12 text-center min-w-fit py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
