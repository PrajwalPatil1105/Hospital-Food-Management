import React from "react";
import { Link } from "react-router-dom";
import { ChefHat, Utensils, Clock, Activity } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between py-4 sm:py-0 sm:h-16 items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-blue-600">HFM</span>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <Link
                to="/ManagerStafflogin"
                className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300 w-full sm:w-auto"
              >
                Manager Login
              </Link>
              <Link
                to="/PantryStafflogin"
                className="inline-flex items-center justify-center px-4 py-2 border border-green-600 text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-colors duration-300 w-full sm:w-auto"
              >
                Pantry Staff Login
              </Link>
              <Link
                to="/DeliveryStafflogin"
                className="inline-flex items-center justify-center px-4 py-2 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 transition-colors duration-300 w-full sm:w-auto"
              >
                Delivery Staff Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Hospital Food Management System
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
            Efficient food service management for better patient care
          </p>
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 lg:px-8">
          <div className="relative group">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform transition duration-500 hover:scale-105 h-full">
              <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-blue-500 text-white mx-auto">
                <Utensils className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900 text-center">
                Food Management
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
                Streamlined food preparation and delivery process with quality
                assurance
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform transition duration-500 hover:scale-105 h-full">
              <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-green-500 text-white mx-auto">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900 text-center">
                Diet Planning
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
                Personalized meal plans tailored to patient dietary requirements
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform transition duration-500 hover:scale-105 h-full">
              <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-purple-500 text-white mx-auto">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-900 text-center">
                Real-time Tracking
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
                Monitor food preparation and delivery status in real-time
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
