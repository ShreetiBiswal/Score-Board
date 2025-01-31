import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Error = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-lg text-center">
        {/* Error Illustration */}
        <div className="mb-8 animate-bounce">
          <svg
            className="w-32 h-32 text-gray-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 animate__animated animate__fadeIn">
          Oops! Something Went Wrong
        </h1>
        <p className="text-gray-600 mb-6 text-lg animate__animated animate__fadeIn animate__delay-1s">
          We encountered an issue while processing your request. Please try again later or return to the home page.
        </p>

        {/* Navigation Button */}
        <button
          onClick={handleGoHome}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-md text-lg transition-all duration-300 transform hover:scale-105"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default Error;
