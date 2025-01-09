import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaCalendar, FaCalendarAlt, FaUserShield, FaBook, FaPlus } from 'react-icons/fa';

const AdminUserDashboard = () => {
    const [assignedBooks, setAssignedBooks] = useState([]);
    const [user, setUser] = useState(null);
    const [membership, setMembership] = useState(null);
    const [membershipError, setMembershipError] = useState('');
    const { userId } = useParams(); // Get userId from route params
    const navigate = useNavigate();
    const api_url = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchUserDetails();
        fetchAssignedBooks();
        fetchUserMembership();
    }, [userId]); // Dependency on userId so it updates when the route changes

    // Fetch user details by userId
    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${api_url}/api/auth/user-details/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    // Fetch assigned books for the user by userId
    const fetchAssignedBooks = async () => {
        try {
            const response = await axios.get(`${api_url}/api/books/assigned-books/${userId}`);
            setAssignedBooks(response.data);
        } catch (error) {
            console.error("Error fetching assigned books:", error);
        }
    };

    // Fetch membership details for the user by userId
    const fetchUserMembership = async () => {
        try {
            const response = await axios.get(`${api_url}/api/memberships/membership/${userId}`);
            setMembership(response.data);
            setMembershipError(''); // Clear any previous error
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMembershipError('No active membership found for this user.');
            } else {
                console.error("Error fetching membership details:", error);
            }
        }
    };

    // Format date to be in dd/mm/yyyy format
    const formatDate = (date) => {
        const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-GB', options);
    };

    // Function to handle book assignment, check if user has active membership
    const handleAssignBook = async (bookId) => {
        if (!membership) {
            setMembershipError('User does not have an active membership. Cannot assign book.');
            return;
        }

        try {
            // Proceed with book assignment if the user has an active membership
            const response = await axios.post(
                `${api_url}/api/books/assign`,
                { userId, bookId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setAssignedBooks((prevBooks) => [...prevBooks, response.data]);
            toast.success('Book assigned successfully');
        } catch (error) {
            console.error("Error assigning book:", error);
            toast.error('Error assigning book');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">User Dashboard (Admin View)</h1>

            {user && (
                <div className="bg-slate-200 shadow-lg rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
                            <div className="w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                                <FaUser className="text-blue-500" />
                                <span>{user.username}</span>
                            </h2>
                            
                        </div>

                        {membership ? (
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
                        ) : (
                            <div className="text-red-500 font-semibold">
                                {membershipError || 'Loading membership details...'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Assigned Books</h2>
            <ul className="w-full max-w-md bg-slate-100 shadow-md rounded-lg p-4 space-y-3">
                {assignedBooks.length > 0 ? (
                    assignedBooks.map((book) => (
                        <li key={book._id} className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition duration-200">
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

export default AdminUserDashboard;
