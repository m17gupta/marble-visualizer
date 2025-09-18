import StudioTemplate from "@/pages/studioPage/StudioTemplate";
import { Routes, Route } from "react-router-dom";

export function StudioRoutes() {
  return (
    <Routes>
      <Route path=":id" element={<StudioTemplate />} />
    </Routes>
  );
}