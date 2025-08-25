// Home.jsx
import Banner from "./Banner";
import PropertySearchBar from "./PropertySearchBar";

export default function Home() {
  const handleSearch = (query) => {
    // For now, just log the query
    console.log("Search query:", query);
    // Later: call backend API or filter local data
  };

  return (
    <div>
      <div className="relative">
        {/* Hero banner background */}
        <Banner />

        {/* Search bar placed over banner */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-4/5 md:w-3/4">
          <PropertySearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
}
