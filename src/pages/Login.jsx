import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BiSolidHourglassTop } from "react-icons/bi";
import { TbFaceIdError } from "react-icons/tb";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${api_url}/api/auth/login`, {
        username,
        password,
      });

      toast.success("Login Successful!")

      // Store the token and role in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      // Redirect to the protected route, where navigation will be handled based on role
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-10 pb-10 pl-4 pr-4 flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-pink-200">
      <div className="bg-white p-8 shadow-lg w-full border-2 border-black rounded-tl-3xl rounded-br-3xl sm:w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {/* GIF Image */}
        <div className="relative mb-6">
          <img
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmFoNXhydnBiZzVnaXZmeHloa2QxdDgwbG5iYmpydjR3Z2o2eTB0eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1J9urAfGd3grKV6E/giphy.webp"
            alt="Animated GIF"
            className={`w-full h-auto rounded-xl`}
          />
        </div>

       {message && <p className="text-red-800 font-bold mb-2 text-center border-2 border-red-700 rounded p-1 flex gap-4 justify-center">{message}
                       <span><TbFaceIdError className='text-red-700 font-bold text-2xl'/></span></p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
             id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              placeholder="Enter your password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <p className="cursor-none flex justify-center"><BiSolidHourglassTop className="animate-spin text-2xl font-bold text-white" /></p>
              ) : (
                <p>Login</p>
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
