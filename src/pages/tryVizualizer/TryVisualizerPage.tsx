"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  HeaderSection,
  PreviewBox,
  DemoRoomsPanel,
  QRDialog,
  DEMO_IMAGES,
  DemoProjectHome,
} from "@/components/demoProject";

/* ----------------------- component ----------------------- */
export default function TryVisualizerPage() {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [openQR, setOpenQR] = React.useState(false);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(0);
  const [searchValue, setSearchValue] = React.useState("");

  const navigate = useNavigate();


  return (

       <DemoProjectHome/>
   
 
  );
}
