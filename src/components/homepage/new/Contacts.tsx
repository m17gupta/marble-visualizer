import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-marble-charcoal mb-4">
            Ready to Create Amazing Designs?
          </h2>
          <p className="text-xl text-marble-gray-dark max-w-2xl mx-auto">
            Join thousands of users creating stunning marble visualizations with AI. Get started today!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center shadow-card border-marble-gray-light">
            <CardHeader>
              <div className="w-16 h-16 bg-marble-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-marble-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-marble-charcoal">Instant Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-marble-gold mb-2">5 Seconds</p>
              <p className="text-marble-gray-dark">AI creates designs instantly</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card border-marble-gray-light">
            <CardHeader>
              <div className="w-16 h-16 bg-marble-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-marble-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <CardTitle className="text-marble-charcoal">Get Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-marble-gold mb-2">support@marblevisualizer.com</p>
              <p className="text-marble-gray-dark">Need help with your designs?</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card border-marble-gray-light">
            <CardHeader>
              <div className="w-16 h-16 bg-marble-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-marble-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <CardTitle className="text-marble-charcoal">Premium Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-marble-charcoal mb-2">4K Resolution</p>
              <p className="text-marble-gray-dark">Professional grade outputs</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-marble-white p-8 rounded-2xl max-w-2xl mx-auto shadow-marble">
            <h3 className="text-3xl font-bold text-marble-charcoal mb-4">
              Start Creating for Free
            </h3>
            <p className="text-marble-gray-dark mb-6">
              Try our AI marble visualizer today and create stunning designs instantly. No credit card required!
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-gold hover:shadow-gold transition-all duration-300 text-marble-charcoal font-semibold px-12 py-4 text-xl"
            >
              Try Free Now
            </Button>
            <p className="text-sm text-marble-gray mt-4">
              No signup required • Unlimited previews • Export in HD
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;