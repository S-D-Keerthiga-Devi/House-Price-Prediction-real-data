import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";

import UserProfile from "../components/dashboard/UserProfile";
import Listings from "../components/dashboard/Listings";
import Plan from "../components/dashboard/Plan";
import Services from "../components/dashboard/Services";
import Leads from "../components/dashboard/Leads";
import Wishlist from "../components/dashboard/Wishlist";
import MyAgent from "../components/dashboard/MyAgent";
import PostProperty from "../components/dashboard/PostProperty";
import AdCampaigns from "../components/dashboard/AdCampaigns";
import RentAgreements from "../components/dashboard/RentAgreements";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("UserProfile");

  const renderContent = () => {
    switch (activeMenu) {
      case "UserProfile":
        return <UserProfile />;
      case "Listings":
        return <Listings />;
      case "Plan":
        return <Plan />;
      case "Services":
        return <Services />;
      case "Leads":
        return <Leads />;
      case "Wishlist":
        return <Wishlist />;
      case "MyAgent":
        return <MyAgent />;
      case "PostProperty":
        return <PostProperty />;
      case "AdCampaigns":
        return <AdCampaigns />;
      case "RentAgreements":
        return <RentAgreements />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 mt-20">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
