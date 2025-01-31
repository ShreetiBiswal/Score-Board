import { motion } from "framer-motion"; // Import Framer Motion for animations
import authService from "../appwrite/auth.js";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";
import { Link, useNavigate } from "react-router-dom";
import appwriteServices from "../appwrite/services.js";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage loading animation
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    redirectPage();
  }, []);

  const redirectPage = async () => {
    try {
      if (user) {
        alert(`${user.name}, you are already logged in. Please log out to log in with a new account.`);
        navigate("/");
      }
    } catch (error) {
      const a = [error.message];
      a.push("ok");
    }
  };

  const login = async (data) => {
    setError("");
    setIsSubmitting(true); // Start loading animation
    try {
      const session = await authService.login(data);
      if (session) {
        const user = await authService.getCurrentUser();
        const userDetails = await appwriteServices.getUserDetails(user.$id);

        if (user && userDetails) {
          dispatch(authLogin({ user, userDetails }));
          navigate("/");
        } else {
          await authService.logout();
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false); // Stop loading animation
    }
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-96"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} // Smooth fade-in animation
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(login)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
            whileHover={{ scale: 1.05 }} // Hover animation
            whileTap={{ scale: 0.95 }} // Tap animation
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                className="loader"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ border: "2px solid white", borderTop: "2px solid blue", borderRadius: "50%", width: "20px", height: "20px" }}
              />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <p className="mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
