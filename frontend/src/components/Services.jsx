// Services.jsx
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    name: "Apartments",
    image: "https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg"
  },
  {
    name: "Independent Builder Floor",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
  },
  {
    name: "Residential Land",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
  },
  {
    name: "Independent House/Villa",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
  },
  {
    name: "Farm House",
    image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg"
  },
  {
    name: "1BHK / Studio Apartment",
    image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg"
  },
  {
    name: "Service Apartments",
    image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
  },
  {
  name: "Penthouse",
  image: "https://images.pexels.com/photos/33561824/pexels-photo-33561824.jpeg",
  },
];

export default function Services() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Explore Properties</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {services.map((service, idx) => (
          <Card
            key={idx}
            className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
          >
            <img
              src={service.image}
              alt={service.name}
              className="h-28 w-full object-cover"
            />
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">{service.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
