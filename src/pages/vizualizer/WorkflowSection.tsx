import { Card, CardContent } from "@/components/ui/card";
import { Upload, Eye, Sparkles } from "lucide-react";

const WorkflowSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Space",
      description: "Simply upload a photo of your room or space. Our AI will analyze the dimensions and lighting conditions.",
      step: "01"
    },
    {
      icon: Eye,
      title: "See Products in Context",
      description: "Browse our catalog and see how furniture, decor, and materials look in your actual space with realistic lighting.",
      step: "02"
    },
    {
      icon: Sparkles,
      title: "Experience the Magic",
      description: "Get photorealistic visualizations that help you make confident purchasing decisions before you buy.",
      step: "03"
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your space in three simple steps. Our advanced AI technology makes visualization effortless and accurate.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="card-hover bg-card border-border relative overflow-hidden">
              {/* Step Number */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">{step.step}</span>
              </div>

              <CardContent className="p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>

              {/* Connecting Line (for desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary/50 to-transparent z-10"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Ready to see the magic in action?
          </p>
          <button className="btn-hero px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;