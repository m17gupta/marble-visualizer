import { Button } from "@/components/ui/button";
import heroImage from "../../../public/assets/marble/hero-living-room.jpg";

const HeroSection = () => {
  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Visualize Your
              <span className="text-primary block">Perfect Space</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Transform any room with our advanced visualization technology. 
              Upload your space, select products, and see exactly how they'll look before you buy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-hero text-lg px-8 py-4">
                Book a Demo
              </Button>
              <Button variant="outline" className="btn-ghost-hero text-lg px-8 py-4">
                Try Visualizer
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Trusted by 50K+ users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>99% accuracy</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={heroImage}
                alt="Modern living room with plants and neutral decor"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Floating Elements */}
              <div className="absolute top-6 left-6 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Preview</span>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="text-sm">
                  <div className="font-semibold">98% Match</div>
                  <div className="text-muted-foreground">Visualization Quality</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;