import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { updateWorkspaceType } from '@/redux/slices/visualizerSlice/workspaceSlice';
import GetAllInspirational from '@/components/swatchBookData/GetAllInsiprational';
import GetAllMaterialSegment from '@/components/swatchBookData/GetMaterialSegments';
import RoomCard from '@/components/workSpace/landing/RoomCard';

// Data for different categories
const categoryData = {
  homeOwner: {
    rooms: [
      {
        id: 'living-room',
        title: 'Existing Home Color/Material Ideas',
        image: 'http://www.dzinly.in/files/dzinly-gallery/color-material-after.png',
        beforeImage: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        afterImage: "https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg", // Added after image
        alt: 'Modern living room with comfortable seating'
      },
      {
        id: 'kitchen',
        title: 'Existing Home Architectural Addition',
        image: 'http://www.dzinly.in/files/dzinly-gallery/arc-addition-after.png',
        beforeImage: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        afterImage: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg', // Added after image
        alt: 'Contemporary kitchen with modern appliances'
      },
      {
        id: 'bedroom',
        title: 'Turn Plans Into Renderings',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Comfortable bedroom with natural lighting'
      },
      {
        id: 'bathroom',
        title: 'Front Yard Landscape Design',
        image: 'https://www.dzinly.com/files/dzinly-gallery/turn-plans-to-renderings-thumbnail.png',
        beforeImage: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        afterImage: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg', // Added after image
        alt: 'Modern bathroom with clean design'
      }
    ]
  },
  realtor: {
    rooms: [
      {
        id: 'garden',
        title: 'Front View',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Beautiful garden landscape'
      },
      {
        id: 'patio',
        title: 'Patio',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Outdoor patio area'
      },
      {
        id: 'pool-area',
        title: 'Pool Area',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Swimming pool and deck'
      },
      {
        id: 'facade',
        title: 'Facade',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Building exterior facade'
      }
    ]
  },
  trade: {
    rooms: [
      {
        id: 'office',
        title: 'Office',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Modern office space'
      },
      {
        id: 'retail',
        title: 'Retail',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Retail store interior'
      },
      {
        id: 'restaurant',
        title: 'Restaurant',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Restaurant dining area'
      },
      {
        id: 'lobby',
        title: 'Lobby',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Commercial building lobby'
      }
    ]
  },
  distributor: {
    rooms: [
      {
        id: 'office',
        title: 'Office',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Modern office space'
      },
      {
        id: 'retail',
        title: 'Retail',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Retail store interior'
      },
      {
        id: 'restaurant',
        title: 'Restaurant',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
        alt: 'Restaurant dining area'
      },
      {
        id: 'lobby',
        title: 'Lobby',
        image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
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
    image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
    ctaText: 'Try Now',
    ctaColor: 'bg-black hover:bg-gray-800'
  },
  {
    id: 'virtual-staging',
    title: 'Virtual Staging (New)',
    description: 'Professional AI virtual staging for your real estate photos in 15-20 seconds!',
    image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
    ctaText: 'Stage',
    ctaColor: 'bg-black hover:bg-gray-800',
    badge: 'MLS Compliant'
  },
  {
    id: 'studio',
    title: 'Studio',
    description: 'Use our studio to create your dream space by accessing all our tools in one place.',
    image: 'https://www.dzinly.com/files/dzinly-gallery/home/chris-after.jpg',
    ctaText: 'Use',
    ctaColor: 'bg-black hover:bg-gray-800'
  }
];

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
const LandingHome = () => {
  const dispatch = useDispatch();

  const handleRoomClick = (roomId: string) => {
    console.log('Room clicked:', roomId);
    // Add your navigation logic here
  };
    
      const handleTopPickClick = (pickId: string) => {
        console.log('Top pick clicked:', pickId);
        // Add your navigation logic here
        switch (pickId) {
          case 'renovate':
            dispatch(updateWorkspaceType('renovate'))
           
            // Navigate to renovation tool
            break;
          case 'virtual-staging':
            // Navigate to virtual staging
            break;
          case 'studio':
            dispatch(updateWorkspaceType('design-hub'))
            // Navigate to studio
            break;
        }
      };
  return (
    <>
   
    <div className="rounded-md transition-all px-6 pt-6 duration-300">
        {/* lg:pl-80 */}
        {/* Header */}
        <div className='bg-white px-6 py-4 rounded-lg'>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Let's get started!</h2>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="homeOwner" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-8 gap-3 h-14">

              <TabsTrigger value="homeOwner" className="flex items-center gap-2 px-4 py-2 rounded-md">
                🏠 Home Owner
              </TabsTrigger>
              <TabsTrigger value="realtor" className="flex items-center gap-2 px-4 py-2 rounded-md">
                🏖️ Realtor
              </TabsTrigger>
              <TabsTrigger value="trade" className="flex items-center gap-2 px-4 py-2 rounded-md">
                🏢 Trade
              </TabsTrigger>
              <TabsTrigger value="distributor" className="flex items-center gap-2 px-4 py-2 rounded-md">
                🏢 Distributor
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
                        onClick={handleRoomClick}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Top Picks Section */}
        <div className="space-y-8 px-6 mt-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Picks</h2>
            <p className="text-gray-600 text-lg">Trending Renovation Solutions.</p>
          </div>

          {/* Top Picks Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topPicks.map((pick) => (
              <TopPickCard
                key={pick.id}
                pick={pick}
               onClick={handleTopPickClick}
              />
            ))}
          </div>
        </div>
      </div>

      <GetAllInspirational/>

      <GetAllMaterialSegment/>
    </>
  )
}

export default LandingHome