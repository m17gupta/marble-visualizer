

const BeforeAfter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-yellow-100 via-white to-yellow-400 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/assets/marble/marble-after.jpg')] bg-cover bg-center pointer-events-none" />
      <div className="relative z-10">
  <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-marble-charcoal mb-4">
            Transformations That Speak
          </h2>
          <p className="text-xl text-marble-gray-dark max-w-2xl mx-auto">
            See the dramatic difference our expert restoration makes. 
            Every project showcases our commitment to excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl shadow-card">
              <img 
                src="/assets/marble/marble-before.jpg" 
                alt="Marble surface before restoration - damaged and stained"
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-semibold">
                  BEFORE
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-marble-charcoal mb-2">Damaged & Stained</h3>
              <p className="text-marble-gray-dark">
                Years of wear, stains, and scratches had left this marble surface dull and damaged.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="relative overflow-hidden rounded-xl shadow-card">
              <img 
                src="/assets/marble/marble-after.jpg" 
                alt="Marble surface after restoration - gleaming and pristine"
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-marble-gold text-marble-charcoal px-4 py-2 rounded-full font-semibold">
                  AFTER
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-marble-charcoal mb-2">Restored & Gleaming</h3>
              <p className="text-marble-gray-dark">
                Our expert restoration brought back the marble's natural beauty and lustrous shine.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-marble p-8 rounded-2xl max-w-4xl mx-auto shadow-card">
            <h3 className="text-2xl font-bold text-marble-charcoal mb-4">
              Ready to Transform Your Marble?
            </h3>
            <p className="text-marble-gray-dark mb-6">
              Every marble surface has the potential to be stunning. Let our experts reveal its hidden beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-gold hover:shadow-gold transition-all duration-300 text-marble-charcoal font-semibold px-8 py-3 rounded-lg">
                Schedule Consultation
              </button>
              <button className="border border-marble-gray hover:bg-marble-gray hover:text-marble-white transition-all duration-300 text-marble-gray-dark font-semibold px-8 py-3 rounded-lg">
                Call (555) 123-4567
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