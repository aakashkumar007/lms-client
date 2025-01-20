import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BiCheckCircle, BiErrorCircle, BiSolidHourglassTop } from "react-icons/bi";
import { toast } from "sonner";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [validationRules, setValidationRules] = useState([
    { message: "At least 8 characters", isValid: false, test: (pw) => pw.length >= 8 },
    { message: "At least one uppercase letter", isValid: false, test: (pw) => /[A-Z]/.test(pw) },
    { message: "At least one lowercase letter", isValid: false, test: (pw) => /[a-z]/.test(pw) },
    { message: "At least one number", isValid: false, test: (pw) => /[0-9]/.test(pw) },
    { message: "At least one special character", isValid: false, test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const api_url = import.meta.env.VITE_API_URL;

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Update validation rules based on current password
    setValidationRules((prevRules) =>
      prevRules.map((rule) => ({
        ...rule,
        isValid: rule.test(newPassword),
      }))
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure all validation rules are passed
    if (!validationRules.every((rule) => rule.isValid)) {
      toast.error("Please meet all password requirements.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${api_url}/api/auth/register`, {
        username,
        password,
        role: 0, // default role
      });
      toast.success(response.data.message);
      setUsername("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-200 ">
      <div className="border-2 rounded-tl-3xl rounded-br-3xl border-black p-4 shadow-lg w-full sm:w-96 m-4 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        <div className="flex justify-center mb-4">
          <img
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmpiYW92emU4dGYxMWx2M3pxbnpkNGw3bDNndW1jeGFsa2FnY3pqdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZrlYxeVZ0zqkU/giphy.webp"
            alt="Registration Animation"
            className="w-32"
          />
        </div>
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
              onChange={handlePasswordChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={()=>{setIsPasswordFocused(false)}}
              className="mt-2 block w-full px-4 py-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter your password"
            />
            {isPasswordFocused && (
              <ul className="mt-2">
                {validationRules.map((rule, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 ${
                      rule.isValid ? "text-green-600 font-bold" : "text-red-800 font-bold"
                    }`}
                  >
                    {rule.isValid ? <BiCheckCircle /> : <BiErrorCircle />}
                    {rule.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={!validationRules.every((rule) => rule.isValid)}
              className={`w-full py-3 mt-4 ${
                validationRules.every((rule) => rule.isValid)
                  ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              } text-lg font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}
            >
              {isLoading ? (
                <p className="cursor-none flex justify-center gap-2 items-center">
                Hold On! Server is Waking
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
