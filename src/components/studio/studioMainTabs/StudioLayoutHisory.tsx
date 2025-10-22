import React, { useMemo, useState } from "react";
import Draggable from "react-draggable";
import {
  DragDropContext,
  Droppable,
  Draggable as DnDItem,
  type DropResult,
  type DroppableProvided,
  type DroppableStateSnapshot,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from "@hello-pangea/dnd";

import { MdOutlineLayers, MdDragIndicator } from "react-icons/md";
import { FiSettings, FiCopy, FiTrash2, FiX, FiMoreVertical, FiPlus, FiClock } from "react-icons/fi";
import { Maximize2, Minimize2 } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

/* ------------ Types ------------ */
type Segment = { id: string; name: string };
type SegmentGroup = { id: string; name: string; segments: Segment[] };
type SegmentType = { id: string; name: string; groups: SegmentGroup[] };

/* ------------ Initial Data ------------ */
const initialData: SegmentType[] = [
  {
    id: "walls",
    name: "WALLS",
    groups: [
      { id: "wall-1", name: "WALL1", segments: [
        { id: "wl-1", name: "WL1" },
        { id: "wl-2", name: "WL2" },
        { id: "wl-3", name: "WL3" },
      ]},
      { id: "wall-2", name: "WALL2", segments: [
        { id: "wl-4", name: "WL4" },
        { id: "wl-5", name: "WL5" },
      ]},
    ],
  },
];

/* small id gen */
const nid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export default function StudioLayoutHisory () {
  const [data, setData] = useState<SegmentType[]>(initialData);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [large, setLarge] = useState(false);
  const [isDraggingSegment, setIsDraggingSegment] = useState(false); // <— NEW

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.map((t) => ({
      ...t,
      groups: t.groups
        .map((g) => ({
          ...g,
          segments: g.segments.filter((s) => s.name.toLowerCase().includes(q)),
        }))
        .filter((g) => g.name.toLowerCase().includes(q) || g.segments.length),
    }));
  }, [data, search]);

  const addGroup = (typeId: string) =>
    setData((prev) =>
      prev.map((t) =>
        t.id !== typeId
          ? t
          : {
              ...t,
              groups: [...t.groups, { id: nid("grp"), name: `WALL${t.groups.length + 1}`, segments: [] }],
            }
      )
    );

  const addSegment = (typeId: string, groupId: string) =>
    setData((prev) =>
      prev.map((t) =>
        t.id !== typeId
          ? t
          : {
              ...t,
              groups: t.groups.map((g) =>
                g.id !== groupId
                  ? g
                  : {
                      ...g,
                      segments: [...g.segments, { id: nid("seg"), name: `WL${g.segments.length + 1}` }],
                    }
              ),
            }
      )
    );

  const deleteSegment = (typeId: string, groupId: string, segId: string) =>
    setData((prev) =>
      prev.map((t) =>
        t.id !== typeId
          ? t
          : {
              ...t,
              groups: t.groups.map((g) =>
                g.id !== groupId ? g : { ...g, segments: g.segments.filter((s) => s.id !== segId) }
              ),
            }
      )
    );

  /* ---------- DND helpers (segments) ---------- */
  const onDragEnd = (result: DropResult) => {
    setIsDraggingSegment(false);
    const { source, destination } = result;
    if (!destination) return;

    const [srcTypeId, srcGroupId] = source.droppableId.split("__");
    const [dstTypeId, dstGroupId] = destination.droppableId.split("__");

    setData((prev) =>
      prev.map((t) => {
        if (t.id !== srcTypeId && t.id !== dstTypeId) return t;
        const groupsCopy = t.groups.map((g) => ({ ...g, segments: [...g.segments] }));

        if (srcTypeId === t.id) {
          const srcG = groupsCopy.find((g) => g.id === srcGroupId)!;
          const [moved] = srcG.segments.splice(source.index, 1);
          if (dstTypeId === t.id) {
            const dstG = groupsCopy.find((g) => g.id === dstGroupId)!;
            dstG.segments.splice(destination.index, 0, moved);
          }
        } else if (dstTypeId === t.id) {
          // (cross-segment-type move – uncommon, but retained)
          const dstG = groupsCopy.find((g) => g.id === dstGroupId)!;
          dstG.segments.splice(destination.index, 0, { id: result.draggableId, name: result.draggableId });
        }

        return { ...t, groups: groupsCopy };
      })
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="grid place-items-center rounded-full bg-blue-600 text-white shadow-lg hover:scale-105 active:scale-[0.97] transition-transform focus:outline-none leading-none [&>svg]:block shrink-0 w-10 h-10 justify-center" title="Layers">
        {/* <MdOutlineLayers size={18} /> */}
           <FiClock size={18} />
        </button>
             
                    
      </PopoverTrigger>

      {/* Transparent wrapper; our draggable card inside */}
      <PopoverContent side="top" align="end" className="p-0 bg-transparent border-0 shadow-none">
        {/* <Draggable
          handle=".drag-handle"
          disabled={isDraggingSegment} // <— disable modal dragging while list DnD
          cancel='[data-rbd-drag-handle-context-id], .no-drag' // <— ignore DnD handles & inputs
          enableUserSelectHack={false}
        >
       
        </Draggable> */}
      </PopoverContent>
    </Popover>
  );
}
