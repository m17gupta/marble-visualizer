import * as React from "react";
import { HeaderSection, PreviewBox, DemoRoomsPanel, QRDialog, GetDemoProject } from "./index";

import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { fetchMaterialSegments } from "@/redux/slices/materialSlices/materialSegmentSlice";
import MaterialData from "../swatchBookData/materialData/MaterialData";

import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { resetProjectSliceState } from "@/redux/slices/projectSlice";

interface DemoProjectHomeProps {
  onImageSelect?: (idx: number) => void;
  onImageClick?: () => void;
  onFileUpload?: (file: File) => void;
}

const DemoProjectHome: React.FC<DemoProjectHomeProps> = ({
  onImageSelect,
  onImageClick,
  onFileUpload,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [openQR, setOpenQR] = React.useState(false);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(0);

const navigate = useNavigate();

   React.useEffect(() => {
      dispatch(fetchMaterialSegments());
    }, [dispatch]);

    
  const handleUpload = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected:", file.name);
      onFileUpload?.(file);
    }
  };

  const handleImageSelect = (idx: number) => {
    setSelectedIdx(idx);
    onImageSelect?.(idx);
  };
    
 const handleHome = () => {
  dispatch(resetProjectSliceState())
    navigate("/");
  }

  return (
    <>
    {/* get demo project */}
    <GetDemoProject/>
    <MaterialData />
     <div className="min-h-screen bg-white">
      {/* page container */}
      <div className="mx-auto w-[90%] px-0 py-0 md:py-14 lg:py-14 sm:px-6 lg:px-8">
        {/* top two-column section */}
          <Button
          onClick={handleHome}
          className=" mb-6 bg-gray-100 shadow-none  text-gray-800 border border-gray-100 flex items-center gap-1"
        >
        <IoArrowBack />
         
          Back
        </Button>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)]">

             
          {/* left column */}
          <HeaderSection
            
          />

          {/* right column preview box */}
          <div className="hidden lg:block md:block 1">
          <PreviewBox />
          </div>
        </div>

        {/* demo rooms panel */}
        <DemoRoomsPanel
        />
      </div>

      {/* QR Dialog */}
      <QRDialog
        open={openQR}
        onOpenChange={setOpenQR}
      />
    </div>

     
    
    </>
  );
};

export default DemoProjectHome;