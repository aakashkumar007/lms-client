import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaSignOutAlt, FaBook, FaUser } from "react-icons/fa";
import { toast } from "sonner"; // Importing the toast library

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignedBookId, setAssignedBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [returnedBookId, setReturnedBookId] = useState("");
  const [userMembership, setUserMembership] = useState(null);
  const api_url = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the server
  const fetchUsers = async () => {
    
    try {
      const response = await axios.get(`${api_url}/api/auth/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch books based on the search query
  const fetchBooks = async (query) => {
    try {
      if (!query) return;
      const endpoint = `${api_url}/api/books/search?query=${query}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Handle search for books
  const handleSearch = async () => {
    fetchBooks(searchQuery);
    setSearchQuery("");
  };

  // Handle search for users
  const handleUserSearch = (e) => {
    setUserSearchQuery(e.target.value);
  };

  // Fetch membership details for the selected user
  const fetchUserMembership = async (userId) => {
    try {
      const response = await axios.get(
        `${api_url}/api/memberships/membership/${userId}`
      );
      setUserMembership(response.data); // Store the membership details
    } catch (error) {
      console.error("Error fetching user membership:", error);
      setUserMembership(null); // If no membership, set as null
    }
  };

  // Handle assigning a book to the selected user
  const handleAssignBook = async () => {
    if (!selectedUser || !assignedBookId || !dueDate) {
      toast.error("Please select a user, a book, and a due date to assign.");
      return;
    }

    // Check if the selected user has an active membership
    if (!userMembership || new Date(userMembership.endDate) < new Date()) {
      toast.error("User does not have an active membership.");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    if (dueDate < currentDate) {
      toast.error("Due date cannot be in the past.");
      return;
    }

    // Check if due date is within the membership period
    if (new Date(dueDate) > new Date(userMembership.endDate)) {
      toast.error("Due date cannot exceed the user's membership end date.");
      return;
    }

    try {
      await axios.post(
        `${api_url}/api/books/assign`,
        { userId: selectedUser._id, bookId: assignedBookId, dueDate: dueDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Book assigned successfully!");
      setAssignedBookId("");
      setDueDate("");
      setBooks([]);
    } catch (error) {
      console.error("Error assigning book:", error);
      toast.error("Error assigning book. Please try again.");
    }
  };

  // Handle returning a book
  const handleReturnBook = async () => {
    if (!selectedUser || !returnedBookId) {
      toast.error("Please select a user and a book to return.");
      return;
    }
    try {
      const response = await axios.post(
        `${api_url}/api/books/unassign`,
        { bookId: returnedBookId, userId: selectedUser._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.status === 200) {
        toast.success("Book returned successfully!");
        setReturnedBookId("");
        setBooks([]);
      }
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("User doesn't have this book.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Handle clearing selections
  const handleClearSelections = () => {
    setAssignedBookId("");
    setReturnedBookId("");
    setSelectedUser(null);
    setUserMembership(null);
    toast.success("Selections cleared.");
  };

  // Filter users based on the search query
  const filteredUsers = userSearchQuery
    ? users.filter(
        (user) =>
          user.role === 0 &&
          user.username.toLowerCase().includes(userSearchQuery.toLowerCase())
      )
    : [];

  // Handle selecting a user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchUserMembership(user._id); // Fetch membership when a user is selected
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </header>
      

      <nav className="flex flex-col items-center sm:items-end gap-2 mb-6"> 
        <Link to="/membership" className="underline text-xl font-medium text-blue-600 hover:text-blue-700">
          Membership Page
        </Link>
        <Link to="/createuser" className="underline text-xl font-medium text-blue-600 hover:text-blue-700">
          Manage User
        </Link>
        <Link to="/books" className="underline text-xl font-medium text-blue-600 hover:text-blue-700">
          Manage Books
        </Link>
      </nav>

      

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search Books</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Search Books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
          >
            <FaSearch />
          </button>
        </div>
      </section>

      <section >
        <button
          onClick={handleClearSelections}
          className="bg-slate-400 p-2 rounded text-white"
        >
          Clear Selections
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Books List</h2>
        {books.length > 0 ? (
          <ul className="space-y-4">
            {books.map((book) => (
              <li
                key={book._id}
                className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-md shadow hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <FaBook className="text-gray-600" />
                  <span className="text-lg font-medium">
                    {book.title} by {book.author}
                  </span>
                  <span className="text-sm text-gray-500 font-bold">Copies available: {book.noOfCopies}</span>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setReturnedBookId(book._id)}
                    className={`${
                      returnedBookId === book._id ? "opacity-50 cursor-not-allowed" : ""
                    } bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition duration-300`}
                    disabled={returnedBookId === book._id}
                  >
                    Select for Return
                  </button>

                  <button
                    onClick={() => setAssignedBookId(book._id)}
                    className={`${
                      assignedBookId === book._id ? "opacity-50 cursor-not-allowed" : ""
                    } bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition duration-300`}
                    disabled={assignedBookId === book._id}
                  >
                    Select for Assign
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No books found.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search Users</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Search Users"
            value={userSearchQuery}
            onChange={handleUserSearch}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Users List</h2>
        {filteredUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`cursor-pointer bg-white p-4 rounded-md shadow hover:shadow-lg transition duration-300 ${
                  selectedUser && selectedUser._id === user._id ? "bg-gray-200" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <FaUser className="text-gray-600" />
                  <span className="text-lg font-medium">{user.username}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No users found.</p>
        )}
      </section>

      {selectedUser && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-4">Due Date:</span>
              <input
                type="date"
                className="border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button
              onClick={handleAssignBook}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Assign Book
            </button>
            <button
              onClick={handleReturnBook}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
            >
              Return Book
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
