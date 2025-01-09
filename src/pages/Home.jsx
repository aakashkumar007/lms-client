import React from "react";
import { FaBook, FaUserAlt, FaCalendarCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Typing from "react-typing-effect";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Header Section with Logo, Text, and Login Button */}
      <div className="flex items-center justify-between p-4 md:px-8">
        {/* Logo and Library Name */}
        <div className="flex items-center space-x-4">
          <img
            src="https://cdn-icons-png.freepik.com/256/17488/17488570.png?ga=GA1.1.582501195.1731014039&semt=ais_hybrid"
            alt="Logo"
            className="h-12 cursor-pointer hover:scale-125 transition duration-300"
          />

          <div className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Aakash's Library
          </div>
        </div>
        {/* Login Button */}

        <div className="mr-16">
          <Link
            to="/books-card"
            className="inline-block px-6 py-3 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
          >
            Show Book List
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-sm md:text-base"
        >
          Login to Start
        </button>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center justify-start p-4">
        {/* Heading Section with Typing Effect */}
        <section className="text-center mb-10 w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-6 animate-fadeInDown">
            <div>Welcome to </div>
            <Typing text="Aakash's Library" speed={100} eraseDelay={2000} />
          </h1>
          <h3 className="text-base md:text-lg text-gray-700 mb-10 max-w-3xl mx-auto animate-fadeInUp">
            Discover a world of knowledge, manage your library account
            efficiently, and track your book assignments, due dates, and more,
            all in one place.
          </h3>
        </section>

        {/* GIF Image with Text on Both Sides */}
        <section className="text-center mb-10 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl relative">
          {/* Left Text */}
          <div className="flex-1 md:pl-10 mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-blue-700">
              A World of Knowledge
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-4 max-w-sm mx-auto md:mx-0">
              Explore our vast collection and find the books that inspire you.
            </p>
          </div>

          {/* GIF Image */}
          <img
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2Jsbm1qcmcxdjNvYXltbzVraW51eWFueXh3N2pmZjl5cWJ4NWhjeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/w0Fy3hcQuZxxQgo0KR/giphy.webp"
            alt="Animated Girl"
            className="h-48 md:h-64 max-w-full rounded-lg animate-fadeIn mb-6 md:mb-0"
          />

          {/* Right Text */}
          <div className="flex-1 md:pr-10 text-center md:text-right">
            <h2 className="text-3xl md:text-4xl font-semibold text-orange-600">
              Manage Your Library
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-4 max-w-sm mx-auto md:mx-0">
              Keep track of your assignments and due dates seamlessly with our
              library system.
            </p>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center max-w-5xl mb-20">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <FaBook className="text-blue-600 text-5xl mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
              Books Management
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Easily browse, assign, and manage books. Track their availability,
              checkouts, and keep your library organized with ease.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <FaUserAlt className="text-green-600 text-5xl mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
              User Accounts
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Manage users, track assigned books, and securely store user
              information. An intuitive dashboard for admins and members alike.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105">
            <FaCalendarCheck className="text-orange-500 text-5xl mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">
              Due Dates Tracking
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Stay on top of upcoming due dates for assigned books to avoid late
              fees. Set reminders and get alerts to keep you organized.
            </p>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="bg-white p-6 md:p-10 rounded-lg shadow-lg mb-16 w-full max-w-5xl">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-4">
              Explore More Features
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
              Our system offers more functionality to help you manage your
              library seamlessly. Take a deeper dive into your library's
              operations and user management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
                <img
                  src="https://img.freepik.com/free-vector/man-desk-with-laptop_23-2148484791.jpg?t=st=1731014076~exp=1731017676~hmac=95074a8f091c09bbeba4aad9b019e8ccb1aae70b7aef4d0ac69a636c0b2650f4&w=996"
                  alt="Library Illustration"
                  className="max-w-full rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left md:pl-6">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                  Detailed Book Management
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Get detailed reports on all library books, including
                  availability, overdue books, and current assignments. Manage
                  the entire lifecycle of your library's collection.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
                <img
                  src="https://img.freepik.com/free-vector/marketing-students-create-corporate-identity-personal-branding-course-strategic-self-marketing-education-personal-branding-online-courses-concept_335657-82.jpg?t=st=1731014122~exp=1731017722~hmac=cdbc31332f8b6407daa73ecdb3827bec953754804f5f8b9b7211b4eaa2ccab1f&w=996"
                  alt="Team Collaboration Illustration"
                  className="max-w-full rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left md:pl-6">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                  User Analytics and Reports
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Track user activities, borrowing trends, and generate
                  analytics to improve the library's services. Make data-driven
                  decisions for a better user experience.
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
