import React from "react";
import { FaBook, FaUserAlt, FaCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {/* CTA (Call to Action) */}
      <div className="text-end mt-12 mx-8">
        <button
          onClick={handleLogin}
          className="px-8 py-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Login to Start
        </button>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center justify-start p-4">
        {/* Heading Section */}
        <section className="text-center mb-10 w-full">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 animate-fadeInDown">
            Welcome to the Library Management System
          </h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto animate-fadeInUp">
            Discover a world of knowledge, manage your library account efficiently, and track your book assignments, due dates, and more, all in one place.
          </p>
        </section>

        {/* Main Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mb-20">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <FaBook className="text-blue-600 text-5xl mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Books Management</h2>
            <p className="text-gray-600">
              Easily browse, assign, and manage books. Track their availability, checkouts, and keep your library organized with ease.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <FaUserAlt className="text-green-600 text-5xl mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">User Accounts</h2>
            <p className="text-gray-600">
              Manage users, track assigned books, and securely store user information. An intuitive dashboard for admins and members alike.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <FaCalendarCheck className="text-orange-500 text-5xl mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Due Dates Tracking</h2>
            <p className="text-gray-600">
              Stay on top of upcoming due dates for assigned books to avoid late fees. Set reminders and get alerts to keep you organized.
            </p>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="bg-white p-10 rounded-lg shadow-lg mb-16 w-full max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Explore More Features</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Our system offers more functionality to help you manage your library seamlessly. Take a deeper dive into your library's operations and user management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="w-1/2 flex justify-center">
                <img
                  src="https://img.freepik.com/free-vector/man-desk-with-laptop_23-2148484791.jpg?t=st=1731014076~exp=1731017676~hmac=95074a8f091c09bbeba4aad9b019e8ccb1aae70b7aef4d0ac69a636c0b2650f4&w=996"
                  alt="Library Illustration"
                  className="max-w-full rounded-lg shadow-md"
                />
              </div>
              <div className="w-1/2 text-left pl-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Detailed Book Management</h3>
                <p className="text-gray-600">
                  Get detailed reports on all library books, including availability, overdue books, and current assignments. Manage the entire lifecycle of your library's collection.
                </p>
              </div>
            </div>

            <div className="flex items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="w-1/2 flex justify-center">
                <img
                  src="https://img.freepik.com/free-vector/marketing-students-create-corporate-identity-personal-branding-course-strategic-self-marketing-education-personal-branding-online-courses-concept_335657-82.jpg?t=st=1731014122~exp=1731017722~hmac=cdbc31332f8b6407daa73ecdb3827bec953754804f5c554377e238380acb3708&w=996"
                  alt="User Management Illustration"
                  className="max-w-full rounded-lg shadow-md"
                />
              </div>
              <div className="w-1/2 text-left pl-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Comprehensive User Management</h3>
                <p className="text-gray-600">
                  View detailed user profiles, track their assigned books, manage roles, and ensure security and accessibility for all users in your library.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
