import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const Services = () => {
  const services = [
    {
      title: "AI Pattern Generation",
      description: "Create stunning marble patterns using advanced AI algorithms that understand natural marble formations and textures.",
  image: "/assets/marble/service-restoration.jpg",
      features: ["Smart Pattern AI", "Natural Texture Mapping", "Custom Color Schemes", "Real-time Preview"]
    },
    {
      title: "3D Visualization Studio", 
      description: "Experience your marble designs in immersive 3D environments with photorealistic rendering and lighting.",
  image: "/assets/marble/service-polishing.jpg",
      features: ["3D Room Visualization", "Photorealistic Rendering", "Multiple View Angles", "Interactive Design"]
    },
    {
      title: "Design Customization",
      description: "Personalize every aspect of your marble design with our comprehensive suite of editing and customization tools.",
  image: "/assets/marble/service-polishing.jpg",
      features: ["Color Palette Editor", "Pattern Intensity Control", "Texture Blending", "Style Variations"]
    }
  ];

  return (
    <section className="py-20  relative overflow-hidden">
      <div className="absolute  bg-cover bg-center pointer-events-none" />
      <div className="relative z-10">
  <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-marble-charcoal mb-4">
            AI-Powered Features
          </h2>
          <p className="text-xl text-marble-gray-dark max-w-2xl mx-auto">
            Comprehensive marble design tools powered by artificial intelligence to create 
            stunning visualizations and bring your marble dreams to life.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600 font-medium">Designs Created</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">200+</div>
            <div className="text-gray-600 font-medium">AI Pattern Styles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">25K+</div>
            <div className="text-gray-600 font-medium">Creative Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">4.9⭐</div>
            <div className="text-gray-600 font-medium">User Rating</div>
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