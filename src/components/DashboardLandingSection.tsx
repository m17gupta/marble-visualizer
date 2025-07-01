import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SideBar from './userProfile/SideBar';

// Data for different categories
const categoryData = {
  residential: {
    rooms: [
      {
        id: 'living-room',
        title: 'Living Room',
        image: '/images/living-room.jpg',
        alt: 'Modern living room with comfortable seating'
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        image: '/images/kitchen.jpg',
        alt: 'Contemporary kitchen with modern appliances'
      },
      {
        id: 'bedroom',
        title: 'Bedroom',
        image: '/images/bedroom.jpg',
        alt: 'Comfortable bedroom with natural lighting'
      },
      {
        id: 'bathroom',
        title: 'Bathroom',
        image: '/images/bathroom.jpg',
        alt: 'Modern bathroom with clean design'
      }
    ]
  },
  exterior: {
    rooms: [
      {
        id: 'garden',
        title: 'Garden',
        image: '/images/garden.jpg',
        alt: 'Beautiful garden landscape'
      },
      {
        id: 'patio',
        title: 'Patio',
        image: '/images/patio.jpg',
        alt: 'Outdoor patio area'
      },
      {
        id: 'pool-area',
        title: 'Pool Area',
        image: '/images/pool-area.jpg',
        alt: 'Swimming pool and deck'
      },
      {
        id: 'facade',
        title: 'Facade',
        image: '/images/facade.jpg',
        alt: 'Building exterior facade'
      }
    ]
  },
  commercial: {
    rooms: [
      {
        id: 'office',
        title: 'Office',
        image: '/images/office.jpg',
        alt: 'Modern office space'
      },
      {
        id: 'retail',
        title: 'Retail',
        image: '/images/retail.jpg',
        alt: 'Retail store interior'
      },
      {
        id: 'restaurant',
        title: 'Restaurant',
        image: '/images/restaurant.jpg',
        alt: 'Restaurant dining area'
      },
      {
        id: 'lobby',
        title: 'Lobby',
        image: '/images/lobby.jpg',
        alt: 'Commercial building lobby'
      }
    ]
  }
};

const topPicks = [
  {
    id: 'renovate',
    title: 'Renovate',
    description: 'Fully renovate your existing room or home with AI and try different templates, styles, and colors for your dream space.',
    image: '/images/renovate.jpg',
    ctaText: 'Try Now',
    ctaColor: 'bg-black hover:bg-gray-800'
  },
  {
    id: 'virtual-staging',
    title: 'Virtual Staging (New)',
    description: 'Professional AI virtual staging for your real estate photos in 15-20 seconds!',
    image: '/images/virtual-staging.jpg',
    ctaText: 'Stage',
    ctaColor: 'bg-black hover:bg-gray-800',
    badge: 'MLS Compliant'
  },
  {
    id: 'studio',
    title: 'Studio',
    description: 'Use our studio to create your dream space by accessing all our tools in one place.',
    image: '/images/studio.jpg',
    ctaText: 'Use',
    ctaColor: 'bg-black hover:bg-gray-800'
  }
];

interface RoomCardProps {
  room: {
    id: string;
    title: string;
    image: string;
    alt: string;
  };
  onClick?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  return (
    <div 
      className="relative flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
      onClick={() => onClick?.(room.id)}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundImage: `url(${room.image})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end p-6">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-white text-xl font-semibold drop-shadow-lg">
            {room.title}
          </h3>
          <ChevronRight className="text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  );
};

interface TopPickCardProps {
  pick: {
    id: string;
    title: string;
    description: string;
    image: string;
    ctaText: string;
    ctaColor: string;
    badge?: string;
  };
  onClick?: (pickId: string) => void;
}

const TopPickCard: React.FC<TopPickCardProps> = ({ pick, onClick }) => {
  return (
    <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-0 shadow-md">
      <div className="relative">
        {/* Image */}
        <div 
          className="h-48 bg-cover bg-center rounded-t-xl"
          style={{ backgroundImage: `url(${pick.image})` }}
        />
        
        {/* Badge */}
        {pick.badge && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {pick.badge}
          </div>
        )}
        
        {/* Overlay icon for renovate */}
        {pick.id === 'renovate' && (
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-6 bg-red-500 rounded-sm"></div>
              <div className="w-2 h-6 bg-yellow-500 rounded-sm"></div>
              <div className="w-2 h-6 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
            </div>
          </div>
        )}
        
        {/* Crown icon for virtual staging */}
        {pick.id === 'virtual-staging' && (
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="text-white text-lg">👑</div>
          </div>
        )}
        
        {/* Studio icon */}
        {pick.id === 'studio' && (
          <div className="absolute top-4 left-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">{pick.title}</CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {pick.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <button
          onClick={() => onClick?.(pick.id)}
          className={cn(
            "w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105",
            pick.ctaColor
          )}
        >
          {pick.ctaText}
        </button>
      </CardContent>
    </Card>
  );
};

interface DashboardLandingSectionProps {
  onRoomClick?: (roomId: string) => void;
  onTopPickClick?: (pickId: string) => void;
}

export const DashboardLandingSection: React.FC<DashboardLandingSectionProps> = ({
  onRoomClick,
  onTopPickClick
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="flex-shrink-0 w-64 py-4 space-y-6">
        <SideBar/>
      </div>

      {/* Right Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto py-8 space-y-12 rounded-md">
        {/* Header */}
        <div className='bg-white px-6 py-4 rounded-lg'>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Let's get started!</h2>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="residential" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="residential" className="flex items-center gap-2">
                🏠 Residential
              </TabsTrigger>
              <TabsTrigger value="exterior" className="flex items-center gap-2">
                🏖️ Exterior
              </TabsTrigger>
              <TabsTrigger value="commercial" className="flex items-center gap-2">
                🏢 Commercial
              </TabsTrigger>
            </TabsList>

            {/* Room Cards - Horizontal Scrollable */}
            {Object.entries(categoryData).map(([category, data]) => (
              <TabsContent key={category} value={category} className="space-y-8">
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-6 min-w-max">
                    {data.rooms.map((room) => (
                      <RoomCard 
                        key={room.id} 
                        room={room} 
                        onClick={onRoomClick}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Top Picks Section */}
        <div className="space-y-8 px-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Picks</h2>
            <p className="text-gray-600 text-lg">Trending Renovation Solutions.</p>
          </div>

          {/* Top Picks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topPicks.map((pick) => (
              <TopPickCard 
                key={pick.id} 
                pick={pick} 
                onClick={onTopPickClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLandingSection;
