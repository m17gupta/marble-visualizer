import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder content for open card
const ContentPlaceholder = () => (
  <div className="p-4 text-white">
    <p>This is some placeholder content inside the accordion.</p>
  </div>
);

// Single card component
const Card = ({
  i,
  expanded,
  setExpanded
}: {
  i: number;
  expanded: false | number;
  setExpanded: (val: false | number) => void;
}) => {
  const isOpen = i === expanded;

  return (
    <div className="mb-2 rounded overflow-hidden shadow-lg">
      <motion.header
        className="cursor-pointer p-4 text-white font-bold"
        initial={false}
        animate={{ backgroundColor: isOpen ? "#FF0088" : "#0055FF" }}
        onClick={() => setExpanded(isOpen ? false : i)}
      >
        Click to {isOpen ? "Collapse" : "Expand"} Card {i + 1}
      </motion.header>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="bg-pink-500 overflow-hidden"
          >
            <ContentPlaceholder />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

// Parent component rendering all cards
export const ProjectAccordion = () => {
  const [expanded, setExpanded] = useState<false | number>(0);

  const accordionIds = [0, 1, 2, 3];

  return (
    <div className="max-w-md mx-auto mt-10">
      {accordionIds.map((i) => (
        <Card key={i} i={i} expanded={expanded} setExpanded={setExpanded} />
      ))}
    </div>
  );
};
