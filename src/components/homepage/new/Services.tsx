import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const Services = () => {
  const services = [
    {
      title: "Marble Restoration",
      description: "Complete restoration of damaged marble surfaces, removing scratches, stains, and restoring original luster.",
  image: "/assets/marble/service-restoration.jpg",
      features: ["Scratch Removal", "Stain Treatment", "Surface Leveling", "Color Enhancement"]
    },
    {
      title: "Professional Polishing", 
      description: "Diamond polishing techniques that bring out the natural beauty and shine of your marble surfaces.",
  image: "/assets/marble/service-polishing.jpg",
      features: ["Diamond Polishing", "High Gloss Finish", "Surface Protection", "Long-lasting Results"]
    },
    {
      title: "Sealing & Protection",
      description: "Advanced sealing solutions that protect your marble from future damage and maintain its beauty.",
  image: "/assets/marble/service-polishing.jpg",
      features: ["Premium Sealants", "Stain Prevention", "Water Protection", "Extended Durability"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-200 via-white to-yellow-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/assets/marble/service-polishing.jpg')] bg-cover bg-center pointer-events-none" />
      <div className="relative z-10">
  <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-marble-charcoal mb-4">
            Our Expert Services
          </h2>
          <p className="text-xl text-marble-gray-dark max-w-2xl mx-auto">
            Comprehensive marble renovation solutions tailored to restore and enhance 
            the natural beauty of your surfaces.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">2K+</div>
            <div className="text-gray-600 font-medium">Marble Restorations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">150+</div>
            <div className="text-gray-600 font-medium">Marble Types</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">50K</div>
            <div className="text-gray-600 font-medium">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">4.9⭐</div>
            <div className="text-gray-600 font-medium">Customer Rating</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-marble transition-all duration-300 border-marble-gray-light">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-marble-charcoal">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-marble-gray-dark">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-marble-gray-dark">
                      <div className="w-2 h-2 bg-marble-gold rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default Services;