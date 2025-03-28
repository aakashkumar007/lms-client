import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaBook, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BookCard from "./BookCard";

const Book = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const api_url = import.meta.env.VITE_API_URL
  
 
  

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newBook, setNewBook] = useState({ title: "", author: "", noOfCopies: 0 });
  const [editingBookId, setEditingBookId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // For delete confirmation
  const [photo, setPhoto] = useState(null); // For storing the selected image file
  const [pdf, setPdf] = useState(null); // For storing the selected PDF file
  const [loading, setLoading] = useState(false); // Loader state


  useEffect(() => {
    fetchBooks();
  }, []);


  if (role !== "1") {
    toast.error("No permission");
    navigate("/login");
    return null;
  }

  

  const fetchBooks = async (query = "") => {
    try {
      setLoading(true); // Start loading
      const endpoint = query
        ? `${api_url}/api/books/search?query=${query}`
        : `${api_url}/api/books/listbook`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(response.data);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false); // Stop loading
    }
  };


  const handleSearch = () => {
    fetchBooks(searchQuery);
    setSearchQuery("");
  };

  const handleSaveBook = async () => {
    try {
      setLoading(true); // Start loading
      let bookResponse;
      if (editingBookId) {
        bookResponse = await axios.put(`${api_url}/api/books/${editingBookId}`, newBook, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Book updated successfully!");
        setEditingBookId(null);
      } else {
        bookResponse = await axios.post(`${api_url}/api/books`, newBook, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Book created successfully!");
      }

      if (photo && pdf) {
        await handleUploadFiles(bookResponse.data._id);
      }

      setNewBook({ title: "", author: "", noOfCopies: 1 });
      setPhoto(null); // Reset the photo input
      setPdf(null);  // Reset the PDF input
      fetchBooks();
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error creating or updating book:", error);
      toast.error("Error creating or updating book");
      setLoading(false); // Stop loading
    }
  };

  const handleUploadFiles = async (bookId) => {
    try {
      const formData = new FormData();

      if (photo) {
        formData.append("image", photo);
      }

      if (pdf) {
        formData.append("pdf", pdf);
      }

      await axios.post(`${api_url}/api/books/${bookId}/uploadFiles`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    }
  };

  const handleEditBook = (book) => {
    setNewBook({ title: book.title, author: book.author, noOfCopies: book.noOfCopies });
    setEditingBookId(book._id);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setLoading(true); // Start loading
      // Confirm delete action
      await axios.delete(`${api_url}/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      fetchBooks(); // Refresh the books list
      toast.success("Book deleted successfully!");
      setConfirmDelete(null); // Close the confirmation modal
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Error deleting book");
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Book Management</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center sm:text-start">Books</h2>
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

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center sm:text-start">
          {editingBookId ? "Edit Book" : "Add New Book"}
        </h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
          <input
            type="number"
            className="flex-1 border border-gray-300 p-2 rounded-md"
            placeholder="No. Of Copies"
            value={newBook.noOfCopies}
            onChange={(e) => setNewBook({ ...newBook, noOfCopies: parseInt(e.target.value) })}
          />

          {/* Add Image Button */}
          <div className="flex items-center">
            <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
              Add Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Add PDF Button */}
          <div className="flex items-center gap-2">
            <label htmlFor="pdf-upload" className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
              Add PDF
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              className="hidden"
            />
            <button
            onClick={handleSaveBook}
            className={`text-white p-3 rounded-md ${editingBookId ? "bg-yellow-500" : "bg-green-500"} hover:opacity-90`}
          >
            {editingBookId ? <span>Update</span> : <FaPlus />}
          </button>
          </div>

          
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl text-center sm:text-start font-semibold mb-4">Books List</h2>
        <ul className="space-y-4">
          {books.map((book) => (
            <li
              key={book._id}
              className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded shadow hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <FaBook className="text-blue-500" />
                <div>
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleEditBook(book)}
                  className="text-blue-500 hover:text-blue-600 transition duration-300"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => setConfirmDelete(book._id)}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                >
                  <FaTrash />
                </button>
              </div>

              {confirmDelete === book._id && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                    <p className="mb-6">Are you sure you want to delete <strong>{book.title}</strong>?</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="spinner-border animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      <div>
      <BookCard/>
      </div>
    </div>
  );
};

export default Book;
