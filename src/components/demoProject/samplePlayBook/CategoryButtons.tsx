import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Ruler, Sparkles } from "lucide-react";

export type CategoryType = "floors" | "rugs" | "walls";

interface CategoryButtonsProps {
  category: CategoryType;
  setCategory: (category: CategoryType) => void;
  variant?: "collapsed" | "expanded";
}

const categoryConfig = [
  { 
    key: "floors" as CategoryType, 
    Icon: Layers, 
    activeClassesCollapsed: "border-emerald-400 ring-4 ring-emerald-100 bg-emerald-50",
    activeClassesExpanded: "border-emerald-500 bg-emerald-50"
  },
  { 
    key: "rugs" as CategoryType, 
    Icon: Ruler, 
    activeClassesCollapsed: "border-rose-400 ring-4 ring-rose-100 bg-rose-50",
    activeClassesExpanded: "border-rose-500 bg-rose-50"
  },
  { 
    key: "walls" as CategoryType, 
    Icon: Sparkles, 
    activeClassesCollapsed: "border-violet-400 ring-4 ring-violet-100 bg-violet-50",
    activeClassesExpanded: "border-violet-500 bg-violet-50"
  },
];

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ 
  category, 
  setCategory, 
  variant = "expanded" 
}) => {
  if (variant === "collapsed") {
    return (
      <>
        {categoryConfig.map(({ key, Icon, activeClassesCollapsed }) => (
          <button
            key={key}
            type="button"
            title={key}
            onClick={() => setCategory(key)}
            className={[
              "flex h-14 w-14 items-center justify-center rounded-xl border bg-white shadow-sm transition hover:shadow",
              category === key ? activeClassesCollapsed : "border-zinc-200",
            ].join(" ")}
          >
            <Icon className="h-6 w-6" />
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      {categoryConfig.map(({ key, Icon, activeClassesExpanded }) => (
        <Button
          key={key}
          variant="outline"
          className={["h-12 w-12 p-0", category === key ? activeClassesExpanded : ""].join(" ")}
          onClick={() => setCategory(key)}
        >
          <Icon className="h-5 w-5" />
        </Button>
      ))}
    </>
  );
};

export default CategoryButtons;