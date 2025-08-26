import React from "react";
import { Link } from "react-router-dom";

const SubHeader = () => {
  return (
    <nav className="bg-gray-100 shadow-md px-6 py-3 mt-[72px] sticky top-[64px] z-40">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto">
        {/* Left Menu */}
        <ul className="flex flex-wrap gap-6 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/buy">Buy</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/rent">Rent</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/services">Services</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/projects">New Projects</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/invest">Invest</Link>
          </li>
        </ul>

        {/* Right Side: Callback + Phone */}
        <div className="flex items-center gap-6">
          <Link
            to="/callback"
            className="text-blue-600 font-semibold hover:underline"
          >
            Request a Callback
          </Link>
          <span className="font-semibold text-green-600">
            📞 +91-1234567890
          </span>
        </div>
      </div>
    </nav>
  );
};

export default SubHeader;
