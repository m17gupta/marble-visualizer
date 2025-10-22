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
import { FaRegCommentDots } from "react-icons/fa";
import CommentListItem from "@/components/comments/CommentListItem";
import CommentLists from "@/components/comments/CommentLists";
import { motion } from "framer-motion"; // Naya import animation ke liye
import { CheckCircle2 } from "lucide-react"; // Naya import icon ke liye
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ------------ Types ------------ */
type Segment = { id: string; name: string };
type SegmentGroup = { id: string; name: string; segments: Segment[] };
type SegmentType = { id: string; name: string; groups: SegmentGroup[] };

interface Comment {
  id: string;
  author: string;
  initials: string;
  avatarUrl?: string;
  message: string;
  timestamp: string; // Naye fields add kiye gaye hain
  isResolved: boolean;
  commentNumber: number;
}


/* ------------ Initial Data ------------ */
const initialData: SegmentType[] = [
  {
    id: "walls",
    name: "WALLS",
    groups: [
      {
        id: "wall-1", name: "WALL1", segments: [
          { id: "wl-1", name: "WL1" },
          { id: "wl-2", name: "WL2" },
          { id: "wl-3", name: "WL3" },
        ]
      },
      {
        id: "wall-2", name: "WALL2", segments: [
          { id: "wl-4", name: "WL4" },
          { id: "wl-5", name: "WL5" },
        ]
      },
    ],
  },
];

/* small id gen */
const nid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

// Dummy comments data for demonstration
const DUMMY_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "Alice Johnson",
    initials: "AJ",
    avatarUrl: "",
    message: "This wall needs to be extended.",
    timestamp: "2024-06-01 10:15",
    isResolved: false,
    commentNumber: 1,
  },
  {
    id: "c2",
    author: "Bob Smith",
    initials: "BS",
    avatarUrl: "",
    message: "Resolved the issue with the window.",
    timestamp: "2024-06-02 14:30",
    isResolved: true,
    commentNumber: 2,
  },
  {
    id: "c3",
    author: "Carol Lee",
    initials: "CL",
    avatarUrl: "",
    message: "Please check the measurements again.",
    timestamp: "2024-06-03 09:45",
    isResolved: false,
    commentNumber: 3,
  },
];

export default function LayersPopover() {
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

  // OPTIONAL: small visual polish (just spacing/tokens)
  const CommentListItems = ({
    comment,
    isActive,
    onClick,
  }: {
    comment: Comment;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <motion.div
      onClick={onClick}
      className={`relative p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${isActive ? "bg-blue-50 border-blue-500 shadow-md" : "bg-white border-gray-200 hover:bg-gray-50"
        }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {isActive && <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-600 rounded-l-lg" />}
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={comment.avatarUrl} alt={comment.author} />
              <AvatarFallback>{comment.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm text-gray-900">{comment.author}</p>
              <p className="text-xs text-gray-500">{comment.timestamp}</p>
            </div>
          </div>
          {comment.isResolved && <CheckCircle2 className="h-5 w-5 text-green-500" />}
        </div>
        <div className="flex items-end justify-between pl-12">
          <p className="text-sm text-gray-700">{comment.message}</p>
          <span className="flex items-center justify-center h-6 w-6 rounded-md border bg-white text-xs font-semibold text-gray-600">
            {comment.commentNumber}
          </span>
        </div>
      </div>
    </motion.div>
  );



  const [activeComment, setActiveComment] = useState<string | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="grid place-items-center rounded-full bg-blue-600 text-white shadow-lg
                 hover:scale-105 active:scale-[0.97] transition-transform focus:outline-none
                 leading-none  [&>svg]:block shrink-0 w-10 h-10 justify-center"
          title="Comments"
        >
          <FaRegCommentDots size={18} />
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
          <div
            className={[
              "relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
              "transition-all duration-300 ease-in-out",
              large ? "w-[760px] h-[80vh]" : "w-[400px] h-[60vh]",
            ].join(" ")}
          >

            <div className="drag-handle cursor-move flex items-center justify-between bg-violet-700 px-4 py-3 text-white shrink-0">
              <h3 className="text-lg font-semibold">Comment</h3>
              <PopoverPrimitive.Close
                className="rounded-full bg-white/20 hover:bg-white/30 p-1 transition no-drag"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </PopoverPrimitive.Close>
            </div>

            <div className="flex flex-col gap-3 p-4  overflow-auto">
              {DUMMY_COMMENTS.map((comment: Comment) => (
                <CommentListItems
                  key={comment.id}
                  comment={comment}
                  isActive={activeComment === comment.id}
                  onClick={() => setActiveComment(comment.id)}
                />
              ))}
            </div>

          </div>
        </Draggable> */}
      </PopoverContent>
    </Popover>
  );
}
