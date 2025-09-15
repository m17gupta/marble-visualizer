import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-marble-charcoal mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-marble-gray-dark max-w-2xl mx-auto">
            Get your free consultation and quote today. Let's bring your marble surfaces back to life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center shadow-card border-marble-gray-light">
            <CardHeader>
              <div className="w-16 h-16 bg-marble-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-marble-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <CardTitle className="text-marble-charcoal">Call Us Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-marble-gold mb-2">(555) 123-4567</p>
              <p className="text-marble-gray-dark">Available 24/7 for emergencies</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card border-marble-gray-light">
            <CardHeader>
              <div className="w-16 h-16 bg-marble-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-marble-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <CardTitle className="text-marble-charcoal">Email Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-marble-gold mb-2">info@marbleexperts.com</p>
              <p className="text-marble-gray-dark">Get detailed project estimates</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card border-marble-gray-light">
            <CardHeader>
              <div className="w-16 h-16 bg-marble-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-marble-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <CardTitle className="text-marble-charcoal">Visit Showroom</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-marble-charcoal mb-2">123 Marble Ave, Suite 100</p>
              <p className="text-marble-gray-dark">See our work samples</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-marble-white p-8 rounded-2xl max-w-2xl mx-auto shadow-marble">
            <h3 className="text-3xl font-bold text-marble-charcoal mb-4">
              Free Consultation & Quote
            </h3>
            <p className="text-marble-gray-dark mb-6">
              Our experts will assess your marble and provide a detailed restoration plan with transparent pricing.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-gold hover:shadow-gold transition-all duration-300 text-marble-charcoal font-semibold px-12 py-4 text-xl"
            >
              Schedule Free Consultation
            </Button>
            <p className="text-sm text-marble-gray mt-4">
              No obligations • Same-day estimates • Licensed & insured
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;