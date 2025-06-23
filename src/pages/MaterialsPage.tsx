import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Eye, Heart, Filter } from 'lucide-react';

const materials = {
  textures: [
    {
      id: 1,
      name: 'Concrete Wall',
      description: 'High-resolution concrete texture',
      url: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Architecture',
      downloads: 1234,
      likes: 89,
    },
    {
      id: 2,
      name: 'Wood Grain',
      description: 'Natural wood pattern texture',
      url: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Natural',
      downloads: 2156,
      likes: 156,
    },
    {
      id: 3,
      name: 'Fabric Pattern',
      description: 'Soft fabric weave texture',
      url: 'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Textile',
      downloads: 987,
      likes: 67,
    },
  ],
  images: [
    {
      id: 4,
      name: 'Mountain Landscape',
      description: 'Stunning mountain view',
      url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Nature',
      downloads: 3421,
      likes: 234,
    },
    {
      id: 5,
      name: 'City Skyline',
      description: 'Modern urban cityscape',
      url: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Urban',
      downloads: 2987,
      likes: 198,
    },
    {
      id: 6,
      name: 'Abstract Geometry',
      description: 'Colorful geometric patterns',
      url: 'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Abstract',
      downloads: 1876,
      likes: 145,
    },
  ],
  icons: [
    {
      id: 7,
      name: 'Business Icons',
      description: 'Professional business icon set',
      url: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Business',
      downloads: 5432,
      likes: 321,
    },
    {
      id: 8,
      name: 'UI Elements',
      description: 'Complete UI element pack',
      url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      category: 'Interface',
      downloads: 4321,
      likes: 287,
    },
  ],
};

export function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('textures');

  const getCurrentMaterials = () => {
    return materials[activeTab as keyof typeof materials] || [];
  };

  const filteredMaterials = getCurrentMaterials().filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
        <p className="text-muted-foreground">
          High-quality assets for your creative projects
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="textures">Textures</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={material.url}
                      alt={material.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <Badge variant="secondary">{material.category}</Badge>
                    </div>
                    <CardDescription>{material.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {material.downloads.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {material.likes}
                        </span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">FREE</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No materials found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Upload your own materials</h3>
              <p className="text-muted-foreground">
                Share your creative assets with the community
              </p>
            </div>
            <Button variant="outline">
              Upload Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}