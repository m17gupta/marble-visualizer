import StudioTemplate from "@/pages/studioPage/StudioTemplate";
import { Route } from "react-router-dom";

export function StudioRoutes() {
  return (
    <>
     
      <Route path="studio/:id" element={<StudioTemplate />} />
    </>
  );
}