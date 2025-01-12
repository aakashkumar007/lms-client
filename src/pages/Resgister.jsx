import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHourglassTop } from "react-icons/bi";
import { TbFaceIdError } from "react-icons/tb";
import { toast } from "sonner";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const api_url = import.meta.env.VITE_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Password validation logic
    if (password.length < 8) {
      setMessage("Password should be greater than 8 characters");
      setIsLoading(false);
      return;
    }
  
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (!hasUppercase) {
      setMessage("Password should include at least one uppercase letter");
      setIsLoading(false);
      return;
    }
  
    if (!hasLowercase) {
      setMessage("Password should include at least one lowercase letter");
      setIsLoading(false);
      return;
    }
  
    if (!hasNumber) {
      setMessage("Password should include at least one number");
      setIsLoading(false);
      return;
    }
  
    if (!hasSpecialChar) {
      setMessage("Password should include at least one special character");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(`${api_url}/api/auth/register`, {
        username,
        password,
        role: 0, // default role
      });
      setMessage(response.data.message);
      setUsername("");
      setPassword("");
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-pink-200">
      <div className="border-2 rounded-tl-3xl rounded-br-3xl border-black p-4 shadow-lg w-full sm:w-96 m-4 bg-white">
        {/* GIF Section */}
       <div className="flex justify-center mb-4">
       <img
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmpiYW92emU4dGYxMWx2M3pxbnpkNGw3bDNndW1jeGFsa2FnY3pqdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZrlYxeVZ0zqkU/giphy.webp"
          alt="Registration Animation"
          className="w-32" // Adjusted height and object-contain to keep the aspect ratio
        />
       </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        {message && (
          <p className="text-red-800 font-bold mb-2 text-center border-2 border-red-700 rounded p-1 flex gap-4 justify-center">
            {message}
            <span>
              <TbFaceIdError className="text-red-700 font-bold text-2xl" />
            </span>
          </p>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              className="mt-2 block w-full px-4 py-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              className="mt-2 block w-full px-4 py-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter your password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-lg font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <p className="cursor-none flex justify-center">
                  <BiSolidHourglassTop className="animate-spin text-2xl font-bold text-white" />
                </p>
              ) : (
                <p>Register</p>
              )}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
