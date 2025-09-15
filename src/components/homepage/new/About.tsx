
const About = () => {
  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "1000+", label: "Projects Completed" },
    { number: "100%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  const features = [
    {
      title: "Master Craftsmen",
      description: "Our certified artisans bring decades of specialized marble restoration expertise to every project."
    },
    {
      title: "Premium Materials",
      description: "We use only the finest diamond polishing compounds and professional-grade sealants for lasting results."
    },
    {
      title: "Guaranteed Results",
      description: "Every restoration comes with our comprehensive warranty and satisfaction guarantee."
    },
    {
      title: "Eco-Friendly Process",
      description: "Our environmentally responsible methods protect your family and preserve natural marble beauty."
    }
  ];

  return (
    <section className="py-20 bg-marble-charcoal text-marble-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Our
              <span className="block bg-gradient-gold bg-clip-text text-transparent">
                Expert Team?
              </span>
            </h2>
            
            <p className="text-xl text-marble-gray-light mb-8">
              For over 15 years, we've been the trusted choice for marble restoration. 
              Our passion for craftsmanship and commitment to excellence has made us 
              the leading marble renovation specialists in the region.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-marble-gold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-marble-gray-light font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-marble-gray-dark/20 p-6 rounded-xl border border-marble-gray-dark/30">
                <h3 className="text-xl font-bold text-marble-gold mb-3">
                  {feature.title}
                </h3>
                <p className="text-marble-gray-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;