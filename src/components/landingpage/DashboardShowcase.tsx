"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building2, Castle, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

type Room = { id: string; title: string; image: string };

type Props = {
  userName?: string;
  className?: string;
  rooms?: Room[]; // used for "residential"
};

export default function DashboardShowcase({
  userName = "SkyVurge",
  className,
  rooms = [
    {
      id: "living",
      title: "Living Room",
      image:
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "kitchen",
      title: "Kitchen",
      image:
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "bedroom",
      title: "Bedroom",
      image:
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d51?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "bathroom",
      title: "Bathroom",
      image:
        "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d51?q=80&w=1600&auto=format&fit=crop",
    },
  ],
}: Props) {
  // sample data for other tabs (so you SEE tab change)
  const exterior: Room[] = [
    {
      id: "facade",
      title: "Facade",
      image:
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "patio",
      title: "Patio",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "garden",
      title: "Garden",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1600&auto=format&fit=crop",
    },
  ];
  const commercial: Room[] = [
    {
      id: "lobby",
      title: "Lobby",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "cafe",
      title: "Cafe",
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "workspace",
      title: "Workspace",
      image:
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  const [tab, setTab] = React.useState<"residential" | "exterior" | "commercial">(
    "residential"
  );
  const data =
    tab === "residential" ? rooms : tab === "exterior" ? exterior : commercial;

  // progress bar
  const barRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const updateProgress = React.useCallback(() => {
    const el = scrollerRef.current;
    const bar = barRef.current;
    if (!el || !bar) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? (el.scrollLeft / max) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, []);

  React.useEffect(() => {
    updateProgress(); // init
    const onResize = () => updateProgress();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateProgress, tab]);

  return (
    <div
     
    >
     

      {/* Tabs (controlled) */}

      
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        
         <TabsList className="h-auto gap-2 bg-gray-300 flex justify-center w-[40%] mx-auto p-2 rounded-lg">
          <TabsTrigger
            value="residential"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
          <Landmark className="mr-2 h-4 w-4" />  Residential 
          </TabsTrigger>
          <TabsTrigger
            value="exterior"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
           <Castle className="mr-2 h-4 w-4" /> Exterior 
          </TabsTrigger>
          <TabsTrigger
            value="commercial"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
           <Building2 className="mr-2 h-4 w-4" />  Commercial 
          </TabsTrigger>
        </TabsList>

        {/* Horizontal cards – simple native scroller (no ScrollArea) */}
        <div className="mt-4 sm:mt-6 rounded-xl border bg-card text-card-foreground p-4 sm:p-6 mb-8">
          <div
            ref={scrollerRef}
            onScroll={updateProgress}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 scroll-smooth snap-x scrollbar-none"
          >
            {data.map((room) => (
              <ImageCard
                key={room.id}
                title={room.title}
                image={room.image}
              />
            ))}
          </div>

          {/* progress bar */}

        </div>
      </Tabs>
    </div>
  );
}

function ImageCard({ title, image }: { title: string; image: string }) {
  return (
    <Card className="relative aspect-[16/10] min-w-[280px] sm:min-w-[360px] lg:min-w-[420px] overflow-hidden border-0 shadow-none snap-start">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover rounded-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent rounded-lg" />
      </div>

      <div className="absolute left-4 top-4 z-10">
        <span className="text-white drop-shadow-md text-lg font-semibold">
          {title}
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <Button
        //   size="icon"
          className="rounded-full bg-white/95 p-4 px-2 text-foreground shadow-sm hover:bg-white"
          variant="default"
          aria-label={`Open ${title}`}
        >
          <ChevronRight className="h-5 w-5" />
          {/* <FaArrowRight className="h-5 w-5"/>    */}

        </Button>
      </div>
    </Card>
  );
}
