import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${api_url}/api/auth/login`, {
                username,
                password,
            });

            console.log(response.data.message)

            setMessage('Login successful!');

            // Store the token and role in local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);

            // Redirect to the protected route, where navigation will be handled based on role
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-lg font-bold mb-4">Login</h2>
                {message && <p className="text-red-500 mb-2">{message}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded w-full py-2 px-3"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    No account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
