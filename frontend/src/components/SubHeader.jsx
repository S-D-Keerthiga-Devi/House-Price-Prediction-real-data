import React from "react";
import { Link } from "react-router-dom";

const SubHeader = () => {
  return (
    <nav className="bg-gray-100 shadow-md px-6 py-3">
      <ul className="flex flex-wrap gap-6 text-gray-700 font-medium">
        
        {/* Buy */}
        <li className="relative group">
          <span className="cursor-pointer">Buy</span>
          <ul className="absolute hidden group-hover:block bg-white shadow-md mt-2 rounded-md w-40">
            <li><Link to="/buy/residential" className="block px-4 py-2 hover:bg-gray-100">Residential</Link></li>
            <li><Link to="/buy/flats/2bhk" className="block px-4 py-2 hover:bg-gray-100">2 BHK Flats</Link></li>
            <li><Link to="/buy/flats/3bhk" className="block px-4 py-2 hover:bg-gray-100">3 BHK Flats</Link></li>
            <li><Link to="/buy/commercial" className="block px-4 py-2 hover:bg-gray-100">Commercial</Link></li>
          </ul>
        </li>

        {/* Rent */}
        <li className="relative group">
          <span className="cursor-pointer">Rent</span>
          <ul className="absolute hidden group-hover:block bg-white shadow-md mt-2 rounded-md w-44">
            <li><Link to="/rent/pg" className="block px-4 py-2 hover:bg-gray-100">PG / Co-Living</Link></li>
            <li><Link to="/rent/1bhk" className="block px-4 py-2 hover:bg-gray-100">1 BHK</Link></li>
            <li><Link to="/rent/2bhk" className="block px-4 py-2 hover:bg-gray-100">2 BHK</Link></li>
          </ul>
        </li>

        {/* Services */}
        <li className="relative group">
          <span className="cursor-pointer">Services</span>
          <ul className="absolute hidden group-hover:block bg-white shadow-md mt-2 rounded-md w-52">
            <li><Link to="/services/builders" className="block px-4 py-2 hover:bg-gray-100">For Builders / Dealers</Link></li>
            <li><Link to="/services/buyers" className="block px-4 py-2 hover:bg-gray-100">For Buyers</Link></li>
          </ul>
        </li>

        {/* New Projects */}
        <li className="relative group">
          <span className="cursor-pointer">New Projects</span>
          <ul className="absolute hidden group-hover:block bg-white shadow-md mt-2 rounded-md w-44">
            <li><Link to="/projects/gurgaon" className="block px-4 py-2 hover:bg-gray-100">Gurgaon</Link></li>
            <li><Link to="/projects/delhi" className="block px-4 py-2 hover:bg-gray-100">Delhi</Link></li>
            <li><Link to="/projects/noida" className="block px-4 py-2 hover:bg-gray-100">Noida</Link></li>
          </ul>
        </li>

        {/* Invest */}
        <li className="relative group">
          <span className="cursor-pointer">Invest</span>
          <ul className="absolute hidden group-hover:block bg-white shadow-md mt-2 rounded-md w-48">
            <li><Link to="/invest/builders" className="block px-4 py-2 hover:bg-gray-100">Invest with Builders</Link></li>
            <li><Link to="/invest/collaboration" className="block px-4 py-2 hover:bg-gray-100">Collaboration</Link></li>
            <li><Link to="/invest/shops" className="block px-4 py-2 hover:bg-gray-100">Shops</Link></li>
            <li><Link to="/invest/lands" className="block px-4 py-2 hover:bg-gray-100">Lands</Link></li>
            <li><Link to="/invest/offices" className="block px-4 py-2 hover:bg-gray-100">Offices</Link></li>
          </ul>
        </li>

        {/* Request a Callback */}
        <li>
          <Link to="/callback" className="text-blue-600 hover:underline">Request a Callback</Link>
        </li>

        {/* Phone Number */}
        <li>
          <span className="font-semibold text-green-600">📞 +91-1234567890</span>
        </li>

      </ul>
    </nav>
  );
};

export default SubHeader;
