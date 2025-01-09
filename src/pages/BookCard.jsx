import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BookCard = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${api_url}/api/books/withImages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Error fetching books");
    }
  };

  const goBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Books</h1>

      <div className="mb-4">
        <button
          onClick={goBackToHome}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          Go Back to Home
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white shadow-md rounded-md overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="relative w-full h-48 bg-gray-200">
              <img
                src={book.imageUrl || "https://via.placeholder.com/150"}
                alt={book.title}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="p-2">
              <h2 className="text-md font-semibold text-gray-800 truncate">{book.title}</h2>
              <p className="text-xs text-gray-500">by {book.author}</p>
            </div>
            <div className="flex justify-around p-2 bg-gray-100">
              <button
                onClick={() => alert("Viewing book details")}
                className="bg-blue-500 text-white px-2 py-1 text-xs rounded-md hover:bg-blue-600 transition duration-300"
              >
                Details
              </button>
              <button
                onClick={() => alert("Requesting book")}
                className="bg-green-600 text-white px-2 py-1 text-xs rounded-md hover:opacity-85 transition duration-300"
              >
                Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCard;
