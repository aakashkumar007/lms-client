import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaSignOutAlt, FaBook, FaUser } from "react-icons/fa";
import { toast } from "sonner"; // Importing the toast library

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newBook, setNewBook] = useState({ title: "", author: "", noOfCopies: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignedBookId, setAssignedBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [returnedBookId, setReturnedBookId] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchBooks = async (query = "") => {
    try {
      const endpoint = query
        ? `http://localhost:5000/api/books/search?query=${query}`
        : "http://localhost:5000/api/books/listbook";
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = async () => {
    fetchBooks(searchQuery);
    setSearchQuery('');
  };

  const handleCreateBook = async () => {
    try {
      await axios.post("http://localhost:5000/api/books", newBook, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNewBook({ title: "", author: "", noOfCopies: 1 });
      fetchBooks(); // Refresh the books list after creating a new book
      toast.success("Book created successfully!"); // Show success toast
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Error creating book"); // Show error toast
    }
  };

  const handleAssignBook = async () => {
    if (!selectedUser || !assignedBookId || !dueDate) {
      toast.error("Please select a user, a book, and a due date to assign.");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    if (dueDate < currentDate) {
      toast.error("Due date cannot be in the past.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/books/assign`,
        {
          userId: selectedUser._id,
          bookId: assignedBookId,
          dueDate: dueDate,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Book assigned successfully!"); // Show success toast
      setAssignedBookId("");
      setDueDate("");
      fetchBooks(); // Refresh the books list after assigning a book
    } catch (error) {
      console.error("Error assigning book:", error);
      toast.error("Error assigning book. Please try again."); // Show error toast
    }
  };

  const handleReturnBook = async () => {
    if (!selectedUser || !returnedBookId) {
      toast.error("Please select a user and a book to return.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/books/unassign",
        { bookId: returnedBookId, userId: selectedUser._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        toast.success("Book returned successfully!"); // Show success toast
        setReturnedBookId("");
        fetchBooks(); // Refresh the books list after returning a book
      }
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Error returning book. Please try again."); // Show error toast
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const filteredUsers = users.filter((user) => user.role === 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mb-4 flex items-center text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-300"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>

      <div className="text-end">
        <Link to="/membership"><h1 className="cursor-pointer underline my-4 text-xl font-medium">Go to Membership Page</h1></Link>
      </div>

      <div className="text-end">
        <Link to="/createuser"><h1 className="cursor-pointer underline my-4 text-xl font-medium">Manage User</h1></Link>
      </div>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Books</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-l transition duration-300 focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Search Books"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition duration-300"
          >
            <FaSearch />
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Book</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-l transition duration-300 focus:outline-none focus:ring focus:ring-green-500"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-l transition duration-300 focus:outline-none focus:ring focus:ring-green-500"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
          <input
            type="number"
            className="flex-1 border border-gray-300 p-2 rounded-l transition duration-300 focus:outline-none focus:ring focus:ring-green-500"
            placeholder="No. Of Copies"
            value={newBook.noOfCopies}
            onChange={(e) =>
              setNewBook({ ...newBook, noOfCopies: e.target.value })
            }
          />
          <button
            onClick={handleCreateBook}
            className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 transition duration-300"
          >
            <FaPlus />
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Books List</h2>
        <ul className="space-y-2">
          {books.map((book) => (
            <li
              key={book._id}
              className="flex justify-between items-center bg-white p-4 rounded shadow hover:shadow-md transition duration-300"
            >
              <div className="flex items-center">
                <FaBook className="mr-2 text-gray-600" />
                <span>
                  {book.title} by {book.author}
                </span>
                <span className="m-8">
                  <p className="font-bold">Copies available: {book.noOfCopies}</p>
                </span>
              </div>

              <button
                onClick={() => setReturnedBookId(book._id)}
                className={`${
                  returnedBookId === book._id ? "opacity-50 cursor-not-allowed" : ""
                } bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition duration-300`}
                disabled={returnedBookId === book._id}
              >
                {returnedBookId === book._id ? "Selected for Return" : "Select for Return"}
              </button>

              <button
                onClick={() => setAssignedBookId(book._id)}
                className={`${
                  assignedBookId === book._id ? "opacity-50 cursor-not-allowed" : ""
                } bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-300`}
                disabled={assignedBookId === book._id}
              >
                {assignedBookId === book._id ? "Selected for Assign" : "Select for Assign"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Users List</h2>
        <ul className="space-y-2">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center bg-white p-4 rounded shadow hover:shadow-md transition duration-300"
            >
              <FaUser className="mr-2 text-gray-600" />
              <input
                type="radio"
                checked={selectedUser?._id === user._id}
                name="user"
                className="mr-2"
                onChange={() => setSelectedUser(user)}
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Assign Book</h2>
        <input
          type="date"
          className="border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring focus:ring-indigo-500"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          onClick={handleAssignBook}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Assign Book
        </button>
        {selectedUser && assignedBookId && dueDate && (
          <p className="mt-4 text-gray-700">
            Assigning book to <strong>{selectedUser.username}</strong> with due date <strong>{dueDate}</strong>
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Return Book</h2>
        <button
          onClick={handleReturnBook}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
        >
          Return Book
        </button>
        {selectedUser && returnedBookId && (
          <p className="mt-4 text-gray-700">
            Returning book for <strong>{selectedUser.username}</strong>
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
