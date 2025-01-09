import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendar,
  FaCalendarAlt,
  FaUserShield,
  FaBook,
} from "react-icons/fa";


const UserDashboard = () => {
  const [assignedBooks, setAssignedBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [membershipError, setMembershipError] = useState("");
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL
  

  useEffect(() => {
    fetchUserDetails();
    fetchAssignedBooks();
    fetchUserMembership();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${api_url}/api/auth/users/me`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchAssignedBooks = async () => {
    try {
      const response = await axios.get(
        `${api_url}/api/books/assigned`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data[0].pdfLink);

      setAssignedBooks(response.data);
    } catch (error) {
      console.error("Error fetching assigned books:", error);
    }
  };

  const fetchUserMembership = async () => {
    try {
      const response = await axios.get(
        `${api_url}/api/memberships/me`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMembership(response.data);
      setMembershipError(""); // Clear any previous error
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMembershipError(
          "No active membership found. Contact the library to buy membership details."
        );
      } else {
        console.error("Error fetching membership details:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const formatDate = (date) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-300 via-emerald-400 to-pink-200 p-8">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
        User Dashboard
      </h1>

      <button
        onClick={handleLogout}
        className="mb-6 bg-red-700 font-bold text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-300 shadow-lg border-white border-2"
      >
        Logout
      </button>

      {user && (
        <div className="bg-white shadow-xl rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
              <div className="w-32 h-32 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-6">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3">
                <FaUser className="text-blue-500" />
                <span>{user.username}</span>
              </h2>
              <p className="text-gray-600 flex items-center space-x-3">
                <FaUserShield className="text-blue-500" />
                <span>{user.role === 0 ? "Member" : "Admin"}</span>
              </p>
            </div>

            {membership ? (
              <div className="mt-6 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-3">
                  <FaCalendar className="text-blue-500" />
                  <span>Membership Details</span>
                </h3>
                <p className="flex items-center space-x-2 text-gray-600">
                  <FaCalendar className="text-blue-500" />
                  <span>
                    <strong>Start Date:</strong>{" "}
                    {formatDate(membership.startDate)}
                  </span>
                </p>
                <p className="flex items-center space-x-2 text-gray-600">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>
                    <strong>End Date:</strong> {formatDate(membership.endDate)}
                  </span>
                </p>
                <p className="flex items-center space-x-2 text-gray-600">
                  <FaUserShield className="text-blue-500" />
                  <span>
                    <strong>Duration:</strong> {membership.durationInMonths}{" "}
                    months
                  </span>
                </p>
              </div>
            ) : (
              <div className="text-red-500 font-semibold">
                {membershipError || "Loading membership details..."}
              </div>
            )}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-white mb-4">Assigned Books</h2>
      <ul className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
        {assignedBooks.length > 0 ? (
          assignedBooks.map((book) => (
            <li
              key={book._id}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-200"
            >
              <div className="flex items-center space-x-4">
                <FaBook className="text-blue-500" />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {book.title}
                  </p>
                  <p className="text-gray-600">by {book.author}</p>
                  <p className="text-gray-600">
                    Due Date:{" "}
                    {book.dueDate ? formatDate(book.dueDate) : "Not set"}
                  </p>

                  {/* Display the book image if available */}
                  {book.image && (
                    <div className="mt-2">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}

                  {/* Display the PDF link if available */}
                  {book.pdfLink && (
                    <div className="mt-2">
                      <a
                        href={book.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View PDF
                      </a>
                    </div>
                  )}
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
