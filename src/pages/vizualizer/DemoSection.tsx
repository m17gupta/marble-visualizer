import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import demoRoomImage from "/assets/marble/demo-room.jpg";
import wallImage from "../../../public/assets/marble/category-wall.jpg";
import curtainsImage from "../../../public/assets/marble/category-curtains.jpg";
import floorImage from "../../../public/assets/marble/category-floor.jpg";
import furnitureImage from "../../../public/assets/marble/category-furniture.jpg";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const DemoSection = () => {
  const [activeCategory, setActiveCategory] = useState("wall");
  const navigate = useNavigate();
  const categories = [
    { id: "wall", name: "Wall", image: wallImage },
    { id: "curtains", name: "Curtains", image: curtainsImage },
    { id: "floor", name: "Floor", image: floorImage },
    { id: "furniture", name: "Furniture", image: furnitureImage }
  ];


  const {user, isAuthenticated} = useSelector((state:RootState) => state.auth);

  const handleUpload = (categoryId: string) => {
    navigate("/try-visualizer");
    // setActiveCategory(categoryId);
    // if(!isAuthenticated){
    //   navigate("/login");
    //   return;
    // }else{
    //    console.log("User is authenticated:", user);
    // }
    // Logic to update the demo room visualization based on selected category
  }
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Interactive Demo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our visualization technology firsthand. Select different product categories and see how they transform this sample room.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Selector */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Product Categories
            </h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    activeCategory === category.id
                      ? "category-active"
                      : "category-inactive"
                  }`}
                  onClick={() => handleUpload(category.id)}
                >
                  <CardContent className="p-4 flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Browse {category.name.toLowerCase()} options
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Button className="w-full btn-hero">
                Try with Your Room
              </Button>
              <Button variant="outline" className="w-full">
                View Full Catalog
              </Button>
            </div>
          </div>

          {/* Visualizer Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={demoRoomImage}
                    alt="Demo room visualization"
                    className="w-full h-[500px] object-cover"
                  />
                  
                  {/* Overlay UI Elements */}
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live Preview</span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="text-sm">
                      <div className="font-semibold capitalize">{activeCategory} Category</div>
                      <div className="text-muted-foreground">Active Selection</div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-sm">High Quality</span>
                        </div>
                        <div className="text-sm text-muted-foreground">|</div>
                        <div className="text-sm text-muted-foreground">
                          Rendering in real-time
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          Reset View
                        </Button>
                        <Button size="sm" className="btn-hero">
                          Save Design
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Hotspots for interactivity */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-primary rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-0 left-0 w-6 h-6 bg-primary rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">15s</div>
                  <div className="text-sm text-muted-foreground">Render Time</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">4K</div>
                  <div className="text-sm text-muted-foreground">Resolution</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;