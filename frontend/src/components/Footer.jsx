import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 - About */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
          <p className="text-sm leading-relaxed">
            We are a trusted real estate platform helping people buy, sell, rent,
            and invest in properties with ease and transparency.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/blog" className="hover:text-white">Blog</a></li>
            <li><a href="mailto:careers@company.com" className="hover:text-white">Careers</a></li>
            <li><a href="mailto:feedback@company.com" className="hover:text-white">Feedback</a></li>
            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Column 3 - Services */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Our Services</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/prime" className="hover:text-white">Prime</a></li>
            <li><a href="/vr" className="hover:text-white">VR</a></li>
            <li><a href="/agent" className="hover:text-white">My Agent</a></li>
            <li><a href="/valuation" className="hover:text-white">Valuation</a></li>
            <li><a href="/interiors" className="hover:text-white">Interiors</a></li>
            <li><a href="/venture" className="hover:text-white">Venture Invest</a></li>
            <li><a href="/reit" className="hover:text-white">REIT</a></li>
            <li><a href="/facility" className="hover:text-white">Facility Management</a></li>
          </ul>
        </div>

        {/* Column 4 - Contact & Social */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center gap-2 text-sm">
            <Phone size={16} /> +91 98765 43210
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Mail size={16} /> support@company.com
          </p>

          {/* Social Media */}
          <div className="flex gap-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="hover:text-white" size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="hover:text-white" size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="hover:text-white" size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <Youtube className="hover:text-white" size={20} />
            </a>
          </div>

          {/* App Downloads */}
          <div className="mt-6">
            <h4 className="text-white text-sm mb-2">Download App</h4>
            <div className="flex gap-3">
              <a
                href="https://play.google.com"
                className="bg-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-700"
              >
                Play Store
              </a>
              <a
                href="https://apple.com/app-store"
                className="bg-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-700"
              >
                App Store
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} RealEstate Co. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
