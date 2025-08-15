import React from 'react'
import ComparisonTable from './components/property/ComparisonTable'
import PropertyCard from './components/property/PropertyCard'
import PropertyGraph from './components/property/PropertyGraph'
import SearchSection from './components/property/SearchSection'
import PropertyComparator from './pages/PropertyCompare'
import propertyData from "./data/Property.json";

const App = () => {
  // Ensure properties is always an array
  const [properties, setProperties] = React.useState(
    Array.isArray(propertyData) ? propertyData : [propertyData]
  );

  return (
    <div>
      {/* Comparison Table */}
      <ComparisonTable
        properties={properties}
        onRemoveProperty={(id) =>
          setProperties((prev) => prev.filter((p) => p.id !== id))
        }
        onClose={() => setProperties([])}
      />

      {/* Property Cards */}
      {properties.map((property) => (
        <PropertyCard key={property.id || property.title} property={property} />
      ))}

      {/* Example: Pass the first property to the graph */}
      {properties[0] && (
        <PropertyGraph
          rentalYield={properties[0].rental_yield}
          fairValue={properties[0].fair_value}
        />
      )}

      {/* Search Section */}
      {/* <SearchSection /> */}

      {/* Comparator Page */}
      <PropertyComparator />
    </div>
  );
}

export default App;
