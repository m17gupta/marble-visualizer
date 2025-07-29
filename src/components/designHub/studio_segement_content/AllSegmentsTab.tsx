import * as React from "react";
import { motion, Reorder } from "framer-motion";
import { Cross1Icon } from "@radix-ui/react-icons";

// Ingredient type
export interface Ingredient {
  icon: string;
  label: string;
}

// Props for each tab
interface Props {
  item: Ingredient;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
}

// All ingredient options
export const allIngredients: Ingredient[] = [
  { icon: "🍅", label: "Tomato" },
  { icon: "🥬", label: "Lettuce" },
  { icon: "🧀", label: "Cheese" },
  { icon: "🥕", label: "Carrot" },
  { icon: "🍌", label: "Banana" },
  { icon: "🫐", label: "Blueberries" },
  { icon: "🥂", label: "Champers?" }
];

// Initial selection
const [tomato, lettuce, cheese] = allIngredients;
export const initialTabs = [tomato, lettuce, cheese];

// Utility to get the next unused ingredient
export function getNextIngredient(
  ingredients: Ingredient[]
): Ingredient | undefined {
  const existing = new Set(ingredients.map((ing) => ing.label));
  return allIngredients.find((ingredient) => !existing.has(ingredient.label));
}

// Component for each tab
export const AllSegmentsTab = ({
  item,
  onClick,
  onRemove,
  isSelected
}: Props) => {
  return (
    <Reorder.Item
      value={item}
      id={item.label}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        backgroundColor: isSelected ? "#f3f3f3" : "#fff",
        y: 0,
        transition: { duration: 0.15 }
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
      whileDrag={{ backgroundColor: "#e3e3e3" }}
      onPointerDown={onClick}
      className={`flex items-center justify-between gap-2 px-1 py-1 text-sm rounded-md border transition-all cursor-pointer
        ${
          isSelected
            ? "border-blue-600 bg-gray-100 shadow-sm"
            : "border-gray-300 bg-white"
        }`}
    >
      <motion.span layout="position">
      {item.label}
      </motion.span>

      <motion.div layout className="close">
        <motion.button
          onPointerDown={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          initial={false}
          animate={{
            backgroundColor: isSelected ? "#e3e3e3" : "#fff"
          }}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
        >
          <Cross1Icon className="w-3.5 h-3.5 text-gray-600" />
        </motion.button>
      </motion.div>
    </Reorder.Item>
  );
};
