import { useSelector } from "react-redux";
import { User, Home, FileText, Layers, Wrench, Users, Heart, UserCheck, PlusCircle, Megaphone, Menu, FileSignature, UserCircle } from "lucide-react";

const menuItems = [
  { id: "UserProfile", label: "User Profile", icon: <User size={18} /> },
  { id: "Listings", label: "Listings", icon: <Home size={18} /> },
  { id: "RentAgreements", label: "Rent Agreements", icon: <FileSignature size={18} /> },
  { id: "Plan", label: "Plan", icon: <FileText size={18} /> },
  { id: "Services", label: "Services", icon: <Wrench size={18} /> },
  { id: "Leads", label: "Leads", icon: <Users size={18} /> },
  { id: "Wishlist", label: "Wishlist", icon: <Heart size={18} /> },
  { id: "MyAgent", label: "My Agent", icon: <UserCheck size={18} /> },
  { id: "PostProperty", label: "Post Property", icon: <PlusCircle size={18} /> },
  { id: "AdCampaigns", label: "Ad Campaigns", icon: <Megaphone size={18} /> },
];

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const userData = useSelector((state) => state.auth.userData);
  const displayName = userData?.name || "Guest";

  return (
    <aside className="w-64 bg-white border-r shadow-md p-4">
      <div className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <Menu size={20} /> Dashboard
      </div>
      <div className="mb-6 flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <UserCircle size={22} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-blue-600">
            Hello
          </span>
          <span className="text-sm font-semibold text-blue-900 truncate">
            {displayName}
          </span>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              activeMenu === item.id
                ? "bg-blue-800 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
