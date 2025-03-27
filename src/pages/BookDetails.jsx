import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineDownload, AiOutlineFilePdf } from "react-icons/ai";
import { MdOutlineImageNotSupported } from "react-icons/md";

const BookDetails = () => {
  const { id } = useParams(); // Extract 'id' directly for clarity
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const [bookDetails, setBookDetails] = useState(null);
  const [error, setError] = useState(null);

  const fetchBookDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not authorized to view this content.");
        return navigate("/login"); // Redirect to login if no token
      }

      const response = await axios.get(`${api_url}/api/books/singleBookDetail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      setBookDetails(response.data);

    } catch (error) {
      console.error("Error fetching book details:", error);
      setError("Failed to fetch book details. Please try again later.");
    }
  };

  useEffect(() => {
    fetchBookDetail();
  }, []); // Runs only once on component mount

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="book-details p-6">
      {bookDetails ? (
        <div className="flex flex-col items-center max-w-3xl mx-auto rounded-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">{bookDetails.title}</h1>
          <p className="text-gray-600 text-center">{bookDetails.description}</p>

          {/* Book Image */}
          {bookDetails.imageUrl ? (
            <div>
            <img
              className="w-40 rounded-lg shadow-md"
              src={bookDetails.imageUrl}
              alt={bookDetails.title}
            />
            <p>Book Name:<span>{bookDetails.title}</span></p>
            <p>Author: {bookDetails.author}</p>
            </div>

          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <MdOutlineImageNotSupported size={48} />
              <span>No Image Available</span>
            </div>
          )}

          {/* PDF Download */}
          {bookDetails.pdfUrl && (
            <a
              href={bookDetails.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              <AiOutlineDownload size={20} />
              <span>Download PDF</span>
            </a>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600">Loading book details...</p>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
