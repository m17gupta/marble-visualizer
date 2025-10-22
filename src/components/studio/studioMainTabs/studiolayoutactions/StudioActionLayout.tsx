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
import { FiSettings, FiCopy, FiTrash2, FiX, FiMoreVertical, FiPlus } from "react-icons/fi";
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

export default function StudioActionLayout () {
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
          <MdOutlineLayers size={18} />
        </button>
             
                    
      </PopoverTrigger>

      {/* Transparent wrapper; our draggable card inside */}
      <PopoverContent side="top" align="end" className="p-0 bg-transparent border-0 shadow-none">
        <Draggable
          handle=".drag-handle"
          disabled={isDraggingSegment} 
          cancel='[data-rbd-drag-handle-context-id], .no-drag' 
          enableUserSelectHack={false}
        >
          <div
            className={[
              "relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
              "transition-all duration-300 ease-in-out",
              large ? "w-[760px] h-[80vh]" : "w-[400px] h-[60vh]",
            ].join(" ")}
          >
           
            <div className="drag-handle cursor-move flex items-center justify-between bg-violet-700 px-4 py-3 text-white shrink-0">
              <h3 className="text-lg font-semibold">Layers</h3>
              <PopoverPrimitive.Close
                className="rounded-full bg-white/20 hover:bg-white/30 p-1 transition no-drag"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </PopoverPrimitive.Close>
            </div>

           
            <div className="flex items-center justify-between bg-slate-100 px-4 py-3 shrink-0">
              <Input
                placeholder="Search Layers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 max-w-[70%] bg-white no-drag"
              />
              <Button
                variant="secondary"
                className="h-9 rounded-md bg-slate-200 px-3 text-slate-800 hover:bg-slate-300 no-drag"
              >
                + Filter
              </Button>
            </div>

          
            <div className="flex-1 overflow-auto p-4">
              <DragDropContext
                onDragStart={() => setIsDraggingSegment(true)}  // <— NEW
                onDragEnd={onDragEnd}
              >
                {filtered.map((type) => (
                  <div key={type.id} className="mb-4 rounded-lg border border-slate-200">
                
                    <div className="flex items-center justify-between bg-violet-50 px-3 py-2 rounded-t-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-violet-700">{type.name}</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-violet-700 hover:bg-violet-100 no-drag"
                        onClick={() => addGroup(type.id)}
                      >
                        <FiPlus className="mr-1" /> Add Group
                      </Button>
                    </div>

                 
                    <div className="p-3 space-y-3">
                      {type.groups.map((g) => {
                        const isOpen = openGroups[g.id] ?? true;
                        return (
                          <div key={g.id} className="rounded-md border border-slate-200">
                          
                            <div className="flex items-center justify-between px-2 py-2 bg-white rounded-t-md">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setOpenGroups((s) => ({ ...s, [g.id]: !isOpen }))}
                                  className="text-slate-400 hover:text-slate-600 no-drag py-1 px-1"
                                  title={isOpen ? "Collapse" : "Expand"}
                                >
                                  {isOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
                                </button>
                                <span className="font-medium">{g.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-violet-700 hover:bg-violet-50 no-drag"
                                  onClick={() => addSegment(type.id, g.id)}
                                >
                                  <FiPlus className="mr-1" /> Add Segment
                                </Button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="rounded p-1 hover:bg-slate-100 no-drag">
                                      <FiMoreVertical />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="no-drag">Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 no-drag">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                           
                            {isOpen && (
                              <Droppable droppableId={`${type.id}__${g.id}`}>
                                {(
                                  dropProvided: DroppableProvided,
                                  dropSnapshot: DroppableStateSnapshot
                                ) => (
                                  <div
                                    ref={dropProvided.innerRef}
                                    {...dropProvided.droppableProps}
                                    className={[
                                      "p-2 rounded-b-md space-y-2 transition",
                                      dropSnapshot.isDraggingOver ? "bg-violet-50" : "bg-slate-50",
                                    ].join(" ")}
                                  >
                                    {g.segments.map((s, index) => (
                                      <DnDItem draggableId={s.id} index={index} key={s.id}>
                                        {(
                                          dragProvided: DraggableProvided,
                                          dragSnapshot: DraggableStateSnapshot
                                        ) => (
                                          <div
                                            ref={dragProvided.innerRef}
                                            {...dragProvided.draggableProps}
                                            className={[
                                              "flex items-center justify-between bg-white rounded-md px-2 py-2 border",
                                              dragSnapshot.isDragging
                                                ? "border-violet-400 ring-2  ring-violet-200"
                                                : "border-slate-200 hover:border-violet-300",
                                              "transition shadow-sm",
                                            ].join(" ")}
                                          >
                                            <div className="flex items-center gap-2">
                                            
                                              <span
                                                {...dragProvided.dragHandleProps}
                                                className="text-slate-400 cursor-grab active:cursor-grabbing"
                                                title="Drag to reorder"
                                              >
                                                <MdDragIndicator />
                                              </span>
                                              <span>{s.name}</span>
                                            </div>

                                            <div className="flex items-center gap-3 text-slate-500">
                                              <FiSettings className="hover:text-slate-700 cursor-pointer no-drag" />
                                              <FiCopy className="hover:text-slate-700 cursor-pointer no-drag" />
                                              <FiTrash2
                                                onClick={() => deleteSegment(type.id, g.id, s.id)}
                                                className="hover:text-red-600 cursor-pointer no-drag"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </DnDItem>
                                    ))}

                            
                                    {dropProvided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </DragDropContext>
            </div>

            {/* Resize toggle */}
            <button
              onClick={() => setLarge((v) => !v)}
              className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-slate-700 text-white/90 grid place-items-center shadow-md hover:bg-slate-800 transition no-drag"
              title={large ? "Shrink" : "Expand"}
              aria-label={large ? "Shrink panel" : "Expand panel"}
            >
              {large ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </Draggable>
      </PopoverContent>
    </Popover>
  );
}
