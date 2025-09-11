import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  MoreHorizontal,
  ChevronDown,
  Plus,
  BrickWall as Wall,
  FilePlus,
} from "lucide-react";
import { HiDotsVertical } from "react-icons/hi";

// NOTE: These are shadcn/ui components. You need to install them.
// I have recreated their basic structure and styling here for demonstration.
// --- Start of Simulated Shadcn Components ---
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "ghost";
    size?: "icon";
  }
>(({ className, variant, size, ...props }, ref) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantClasses =
    variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" : "";
  const sizeClasses = size === "icon" ? "h-8 w-8" : "";
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">{children}</div>
);
const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);
const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-20">
    {children}
  </div>
);
const DropdownMenuItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <a
    href="#"
    className={`block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 ${className}`}>
    {children}
  </a>
);
// --- End of Simulated Shadcn Components ---

// --- Data for Draggable Items ---
const initialWallLayers = [
  { id: "wl-1", content: "WL1" },
  { id: "wl-2", content: "WL2" },
  { id: "wl-3", content: "WL3" },
  { id: "wl-4", content: "WL4" },
];

// --- Sortable Item Component ---
function SortableItem({ id, content }: { id: string; content: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-2 rounded-md bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 p-1">
          <GripVertical className="w-5 h-5" />
        </div>
        <span className="text-gray-600">{content}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            // size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {/* <MoreHorizontal className="h-4 w-4" /> */}
            <HiDotsVertical className="h-4 w-4" />

          </Button>
        </DropdownMenuTrigger>
        {isMenuOpen && (
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 hover:bg-red-50">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}

// --- Main Structure Component ---
const Structure = () => {
  const [isWallOpen, setIsWallOpen] = useState(true);
  const [isWall1Open, setIsWall1Open] = useState(true);
  const [wallLayers, setWallLayers] = useState(initialWallLayers);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWallLayers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="m-0 grid gap-3">
      <div className="w-full bg-white rounded-lg shadow-none border overflow-hidden">
        <div
          className="flex items-center justify-between p-3 bg-purple-50 cursor-pointer"
          onClick={() => setIsWallOpen(!isWallOpen)}>
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-1 rounded">
              <Wall className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-800">Wall</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isWallOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Wall Accordion Content */}
        {isWallOpen && (
          <div className="border-t border-gray-200">
            {/* Add Segments Row */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2 text-purple-600 cursor-pointer">
                <FilePlus className="w-5 h-5" />
                <span className="text-sm font-semibold">Add Segments</span>
              </div>
              <button className="text-sm font-semibold text-purple-600 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Group
              </button>
            </div>

            {/* Wall1 Nested Accordion */}
            <div className="border-t border-gray-200">
              <div
                className="flex items-center pl-4 pr-3 py-3 cursor-pointer"
                onClick={() => setIsWall1Open(!isWall1Open)}>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 mr-2 transition-transform ${
                    isWall1Open ? "rotate-180" : ""
                  }`}
                />
                <span className="flex-grow font-medium text-gray-700">
                  Wall1
                </span>
              </div>

              {/* Wall1 Content with Drag and Drop */}
              {isWall1Open && (
                <div className="pl-10 pr-4 pb-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={wallLayers}
                      strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {wallLayers.map((item) => (
                          <SortableItem
                            key={item.id}
                            id={item.id}
                            content={item.content}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>
        )}
      </div>


        <div className="w-full bg-white rounded-lg shadow-none border overflow-hidden">
        <div
          className="flex items-center justify-between p-3 bg-purple-50 cursor-pointer"
          onClick={() => setIsWallOpen(!isWallOpen)}>
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-1 rounded">
              <Wall className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-semibold text-gray-800">Wall</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                isWallOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Wall Accordion Content */}
        {isWallOpen && (
          <div className="border-t border-gray-200">
            {/* Add Segments Row */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2 text-purple-600 cursor-pointer">
                <FilePlus className="w-5 h-5" />
                <span className="text-sm font-semibold">Add Segments</span>
              </div>
              <button className="text-sm font-semibold text-purple-600 flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Group
              </button>
            </div>

            {/* Wall1 Nested Accordion */}
            <div className="border-t border-gray-200">
              <div
                className="flex items-center pl-4 pr-3 py-3 cursor-pointer"
                onClick={() => setIsWall1Open(!isWall1Open)}>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 mr-2 transition-transform ${
                    isWall1Open ? "rotate-180" : ""
                  }`}
                />
                <span className="flex-grow font-medium text-gray-700">
                  Wall1
                </span>
              </div>

              {/* Wall1 Content with Drag and Drop */}
              {isWall1Open && (
                <div className="pl-10 pr-4 pb-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}>
                    <SortableContext
                      items={wallLayers}
                      strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {wallLayers.map((item) => (
                          <SortableItem
                            key={item.id}
                            id={item.id}
                            content={item.content}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Structure;
