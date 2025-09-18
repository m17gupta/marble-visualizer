"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Pick = {
  id: string;
  title: string;
  blurb: string;
  cta: string;
  image: string;
  badgeLeft?: React.ReactNode;   // top-left round badge
  badgeRight?: string;           // top-right pill badge
  onClick?: () => void;
  buttonClassName?: string;      // custom CTA color
};

const PICKS: Pick[] = [
  {
    id: "renovate",
    title: "Renovate",
    blurb:
      "Fully renovate your existing room or home with AI and try different templates, styles, and colors for your dream space.",
    cta: "Try Now",
    image:
      "https://images.unsplash.com/photo-1582582429416-0ef1a1f1c34b?q=80&w=1600&auto=format&fit=crop",
    buttonClassName: "bg-black hover:bg-black/90 text-white",
  },
  {
    id: "staging",
    title: "Virtual Staging (New)",
    blurb: "Professional AI virtual staging for your real estate photos in 15–20 seconds!",
    cta: "Stage",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    badgeLeft: (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
        <Crown className="h-3.5 w-3.5" />
      </div>
    ),
    badgeRight: "MLS Compliant",
    buttonClassName: "bg-zinc-900 hover:bg-zinc-800 text-white",
  },
  {
    id: "studio",
    title: "Studio",
    blurb:
      "Use our studio to create your dream space by accessing all our tools in one place.",
    cta: "Use",
    image:
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1600&auto=format&fit=crop",
    buttonClassName: "bg-gray-900 hover:bg-gray-800 text-white",
  },
  {
    id: "visualizer",
    title: "Visualizer",
    blurb:
      "Preview materials and colors on your project in real-time with our smart visualizer.",
    cta: "Open",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
    buttonClassName: "bg-indigo-600 hover:bg-indigo-700 text-white",
  },
];

export default function RenovationKit({
  className,
  heading = "Renovation Kit",
  subheading = "Trending Renovation Solutions.",
}: {
  className?: string;
  heading?: string;
  subheading?: string;
}) {
  return (
    <section className={cn("mt-4", className)}>
      <div className="mb-3">
        <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
        <p className="text-muted-foreground">{subheading}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PICKS.map((p) => (
          <PickCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}

// MotionCard wraps Card with framer-motion for animation
const MotionCard = motion(Card);

function PickCard({
  title,
  blurb,
  cta,
  image,
  badgeLeft,
  badgeRight,
  onClick,
  buttonClassName,
}: Pick) {
  return (
    <MotionCard
      className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02, boxShadow: "0px 10px 25px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="relative h-48 w-full">
        <motion.img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />

        {badgeLeft && <div className="absolute left-3 top-3">{badgeLeft}</div>}

        {badgeRight && (
          <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow-sm">
            {badgeRight}
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>

        <div className="mt-4">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onClick}
              className={cn(
                "h-12 w-full rounded-xl text-base font-semibold",
                buttonClassName
              )}
            >
              {cta}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </MotionCard>
  );
}
