import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendar, FaCalendarAlt, FaUserShield, FaBook } from 'react-icons/fa'; // Import additional icons

const UserDashboard = () => {
    const [assignedBooks, setAssignedBooks] = useState([]);
    const [user, setUser] = useState(null);
    const [membership, setMembership] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
        fetchAssignedBooks();
        fetchUserMembership(); // Fetch membership details
    }, []);

    // Fetch user details from the backend
    const fetchUserDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/users/me', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(response.data);
            
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    // Fetch assigned books for the logged-in user
    const fetchAssignedBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/books/assigned', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAssignedBooks(response.data);
            
        } catch (error) {
            console.error("Error fetching assigned books:", error);
        }
    };

    // Fetch user's membership details
    const fetchUserMembership = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/memberships/me', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMembership(response.data); // Set membership details to state
            
        } catch (error) {
            console.error("Error fetching membership details:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    // Helper function to format dates as dd/mm/yy
    const formatDate = (date) => {
        const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' for dd/mm/yy format
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">User Dashboard</h1>

            {/* Logout button */}
            <button
                onClick={handleLogout}
                className="mb-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
                Logout
            </button>

            {/* User and Membership Information Section */}
            {user && membership && (
                <div className="bg-slate-200 shadow-lg rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 mb-8 transition transform hover:scale-105 duration-300">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                        {/* User Info Section */}
                        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
                            <div className="w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                                <FaUser className="text-blue-500" />
                                <span>{user.username}</span>
                            </h2>
                            <p className="text-gray-600 flex items-center space-x-2">
                                <FaUserShield className="text-blue-500" />
                                <span>{user.role === 0 ? 'Member' : 'Admin'}</span>
                            </p>
                            
                        </div>

                        {/* Membership Info Section */}
                        <div className="mt-4 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left space-y-2">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                                <FaCalendar className="text-blue-500" />
                                <span>Membership Details</span>
                            </h3>
                            <p className="flex items-center space-x-2">
                                <FaCalendar className="text-blue-500" />
                                <span><strong>Start Date:</strong> {formatDate(membership.startDate)}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span><strong>End Date:</strong> {formatDate(membership.endDate)}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <FaUserShield className="text-blue-500" />
                                <span><strong>Duration:</strong> {membership.durationInMonths} months</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Assigned Books Section */}
            <h2 className="text-2xl  font-semibold text-gray-700 mb-4">Assigned Books</h2>
            <ul className="w-full max-w-md bg-slate-100 shadow-md rounded-lg p-4 space-y-3 transition transform hover:scale-105 duration-300">
                {assignedBooks.length > 0 ? (
                    assignedBooks.map((book) => (
                        <li key={book._id} className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition duration-200 ease-in-out">
                            <div className="flex items-center space-x-3">
                                <FaBook className="text-blue-500" />
                                <div>
                                    <p className="text-lg font-medium text-gray-800">{book.title}</p>
                                    <p className="text-gray-600">by {book.author}</p>
                                    <p className="text-gray-600">Due Date: {book.dueDate ? formatDate(book.dueDate) : 'Not set'}</p>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">No assigned books yet.</p>
                )}
            </ul>
        </div>
    );
};

export default UserDashboard;
