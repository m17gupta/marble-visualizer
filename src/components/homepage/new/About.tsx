
const About = () => {
  const stats = [
    { number: "5+", label: "Years AI Research" },
    { number: "50K+", label: "Designs Generated" },
    { number: "99.9%", label: "Uptime Rate" },
    { number: "24/7", label: "Cloud Processing" }
  ];

  const features = [
    {
      title: "Advanced AI Technology",
      description: "Our cutting-edge machine learning algorithms understand natural marble patterns and create stunning, realistic designs."
    },
    {
      title: "Instant Generation",
      description: "Generate thousands of unique marble patterns in seconds with our lightning-fast AI processing engine."
    },
    {
      title: "Professional Quality",
      description: "Every design meets professional standards with high-resolution output suitable for commercial projects."
    },
    {
      title: "Cloud-Based Studio",
      description: "Access your designs anywhere with our secure cloud platform that saves your creative work automatically."
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
                AI Studio?
              </span>
            </h2>
            
            <p className="text-xl text-marble-gray-light mb-8">
              We've revolutionized marble design with cutting-edge AI technology. 
              Our passion for innovation and commitment to quality has made us 
              the leading AI-powered marble visualization platform worldwide.
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