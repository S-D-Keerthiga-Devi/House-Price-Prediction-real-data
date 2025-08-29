// Home.jsx
import Banner from "./Banner";
import PropertySearchBar from "./PropertySearchBar";
import Services from "./Services";

export default function Home() {
  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

  return (
    <div>
      <div className="relative">
        {/* Hero banner background */}
        <Banner />

        {/* Search bar placed over banner */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-4/5 md:w-3/4">
          {/* <PropertySearchBar onSearch={handleSearch} /> */}
        </div>
      </div>

      {/* Services Section */}
      <Services />
    </div>
  );
}
