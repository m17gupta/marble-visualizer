import * as React from "react";
import { useState } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import {
  allIngredients,
  AllSegmentsTab,
  Ingredient,
  initialTabs,
  getNextIngredient,
} from "./AllSegmentsTab";
import { Plus } from "lucide-react";

export default function App() {
  const [tabs, setTabs] = useState(initialTabs);
  const [selectedTab, setSelectedTab] = useState<Ingredient>(tabs[0]);

  const add = () => {
    const nextItem = getNextIngredient(tabs);
    if (nextItem) {
      setTabs([...tabs, nextItem]);
      setSelectedTab(nextItem);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center">
      <div className="bg-white px-4 py-3 rounded-xl shadow-md max-w-2xl">
        <nav className="flex items-center gap-3 flex-wrap">
          <Reorder.Group
            as="ul"
            axis="x"
            onReorder={setTabs}
            className="flex gap-2 items-center  overflow-x-auto w-60"
            values={tabs}
          >
            <AnimatePresence initial={false}>
              {tabs.map((item: Ingredient) => (
                <AllSegmentsTab
                  key={item.label}
                  item={item}
                  isSelected={selectedTab.label === item.label}
                  onClick={() => setSelectedTab(item)}
                  onRemove={() =>
                    setTabs((prev: Ingredient[]) =>
                      prev.filter((i) => i.label !== item.label)
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <motion.button
            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            onClick={add}
            disabled={tabs.length === allIngredients.length}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </nav>
      </div>

      <main className="mt-10 text-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : "empty"}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {selectedTab ? selectedTab.icon : "😋"}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
