import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDragIndicator } from "react-icons/md";
import { MasterGroupModel } from "@/models/jobModel/JobModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { updateHoverGroup } from "@/redux/slices/canvasSlice";
import { AppDispatch, RootState } from "@/redux/store";

// dnd-kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HiDotsVertical, HiOutlineDotsVertical } from "react-icons/hi";

type FlatSeg = {
  key: string;            // stable unique key for UI
  id?: number | null;     // original id (may be undefined)
  short_title: string;    // label
  color: string;          // dot color (from layer.color_code)
};

const LayerSegTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { masterArray } = useSelector((state: RootState) => state.masterArray);

  const [items, setItems] = useState<FlatSeg[]>([]);
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Build flat list from nested redux data
  useEffect(() => {
    const flat: FlatSeg[] = [];
    (masterArray || []).forEach((layer: any, layerIdx: number) => {
      const color = layer?.color_code ?? "#999";
      const groups = (layer?.allSegments || []) as MasterGroupModel[];
      groups.forEach((grp: MasterGroupModel, grpIdx: number) => {
        const segs = (grp?.segments || []) as SegmentModal[];
        segs.forEach((segment: SegmentModal, segIdx: number) => {
          flat.push({
            key: `${layerIdx}-${grpIdx}-${segment?.id ?? segIdx}`,
            id: segment?.id ?? null,
            short_title: segment?.short_title ?? "Unnamed Segment",
            color,
          });
        });
      });
    });
    setItems(flat);
  }, [masterArray]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownKey(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Hover highlight -> canvas
  const handleMouseEnter = (segTitle: string) => {
    dispatch(updateHoverGroup(segTitle ? [segTitle] : null));
  };
  const handleMouseLeave = () => dispatch(updateHoverGroup(null));

  // Dropdown
  const toggleDropdown = (key: string) =>
    setOpenDropdownKey((prev) => (prev === key ? null : key));
  const handleItemClick = (_label: string) => {
    // wire actions as needed
    setOpenDropdownKey(null);
  };

  // dnd-kit sensors (tuned for smooth UX)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((it) => it.key === active.id);
    const newIndex = items.findIndex((it) => it.key === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    setItems((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  // Icons
  const MoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="text-gray-500">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="5" r="1"></circle>
      <circle cx="12" cy="19" r="1"></circle>
    </svg>
  );

  return (
    <div className="w-full mx-auto border border-gray-200 font-sans rounded-md overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((it) => it.key)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="py-2 ">
            {items.map((seg) => (
              <SortableRow
                key={seg.key}
                seg={seg}
                isOpen={openDropdownKey === seg.key}
                toggleDropdown={toggleDropdown}
                handleItemClick={handleItemClick}
                dropdownRef={dropdownRef}
                onHoverEnter={handleMouseEnter}
                onHoverLeave={handleMouseLeave}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default LayerSegTab;

/* ----------------- Sortable Row ----------------- */
type RowProps = {
  seg: FlatSeg;
  isOpen: boolean;
  toggleDropdown: (key: string) => void;
  handleItemClick: (label: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onHoverEnter: (title: string) => void;
  onHoverLeave: () => void;
};

const SortableRow: React.FC<RowProps> = ({
  seg,
  isOpen,
  toggleDropdown,
  handleItemClick,
  dropdownRef,
  onHoverEnter,
  onHoverLeave,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: seg.key });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition, // smoothness
    touchAction: "manipulation",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-4 py-2 relative 
        ${isDragging ? " z-30  scale-[1.01]" : "bg-white hover:bg-gray-50 border border-gray-200 mb-1"}
        ${isSorting ? "z-0" : ""}
        transition-all duration-150`}
    >
      {/* Left: dot + title (redux hover highlight) */}
      <div
        className="flex items-center gap-3"
        onMouseEnter={() => onHoverEnter(seg.short_title)}
        onMouseLeave={onHoverLeave}
      >
        <span
          className="w-3 h-3 rounded-full ring-1 ring-gray-200"
          style={{ backgroundColor: seg.color }}
        />
        <span className="text-gray-800 select-none">{seg.short_title}</span>
      </div>

      {/* Right: drag-handle (only) + menu */}
      <div
        className="flex items-center gap-2"
        onMouseEnter={() => onHoverEnter(seg.short_title)}
        onMouseLeave={onHoverLeave}
      >
        {/* Drag handle */}
        <button
          aria-label="Drag row"
          className="p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <MdDragIndicator className="text-gray-500" />
        </button>

        {/* Menu */}
        <button
          type="button"
          onClick={() => toggleDropdown(seg.key)}
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
     <HiOutlineDotsVertical />


          
        </button>

        {isOpen && (
          <DropdownMenu
            dropdownRef={dropdownRef}
            onAction={handleItemClick}
          />
        )}
      </div>
    </li>
  );
};

/* ----------------- Dropdown ----------------- */
const DropdownMenu: React.FC<{
  onAction: (label: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}> = ({ onAction, dropdownRef }) => {
  const items = [
    "Bring to Front",
    "Send to Back",
    "Bring Forward",
    "Send Backward",
    "Duplicate Object",
    "Delete",
  ];
  return (
    <div
      ref={dropdownRef}
      className="absolute right-2 top-12 z-20 w-48 bg-white rounded-md shadow-lg border border-gray-200"
    >
      <ul className="py-1">
        {items.map((label) => (
          <li
            key={label}
            onClick={() => onAction(label)}
            className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
              label === "Delete" ? "text-red-600 hover:bg-red-50" : "text-gray-700"
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};
