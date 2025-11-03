

const BeforeAfter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-yellow-100 via-white to-yellow-400 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/assets/marble/marble-after.jpg')] bg-cover bg-center pointer-events-none" />
      <div className="relative z-10">
  <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-marble-charcoal mb-4">
            AI Design Magic in Action
          </h2>
          <p className="text-xl text-marble-gray-dark max-w-2xl mx-auto">
            See how our AI transforms simple ideas into stunning marble visualizations. 
            Every design showcases the power of artificial intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl shadow-card">
              <img 
                src="/assets/marble/marble-before.jpg" 
                alt="Basic concept sketch or simple room layout"
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-semibold">
                  INPUT
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-marble-charcoal mb-2">Simple Concept</h3>
              <p className="text-marble-gray-dark">
                Start with a basic idea, room photo, or simple sketch that you want to transform.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl shadow-card">
              <img 
                src="/assets/marble/marble-after.jpg" 
                alt="AI-generated stunning marble design visualization"
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-marble-gold text-marble-charcoal px-4 py-2 rounded-full font-semibold">
                  AI RESULT
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-marble-charcoal mb-2">Stunning Visualization</h3>
              <p className="text-marble-gray-dark">
                Our AI transforms your concept into photorealistic marble designs with incredible detail.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-marble p-8 rounded-2xl max-w-4xl mx-auto shadow-card">
            <h3 className="text-2xl font-bold text-marble-charcoal mb-4">
              Ready to Create Your Dream Design?
            </h3>
            <p className="text-marble-gray-dark mb-6">
              Every great marble design starts with an idea. Let our AI bring your vision to life instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-gold hover:shadow-gold transition-all duration-300 text-marble-charcoal font-semibold px-8 py-3 rounded-lg">
                Start Creating Now
              </button>
              <button className="border border-marble-gray hover:bg-marble-gray hover:text-marble-white transition-all duration-300 text-marble-gray-dark font-semibold px-8 py-3 rounded-lg">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default BeforeAfter;