
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { fetchMaterialSegments } from "@/redux/slices/materialSlices/materialSegmentSlice";
import React from "react";
import GetDemoProject from "@/components/demoProject/GetDemoProject";
import MaterialData from "@/components/swatchBookData/materialData/MaterialData";
import HeaderSection from "@/components/demoProject/HeaderSection";
import PreviewBox from "@/components/demoProject/PreviewBox";
import { DemoRoomsPanel, QRDialog } from "@/components/demoProject";

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
  const [searchValue, setSearchValue] = React.useState("");


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

  return (
    <>
    {/* get demo project */}
    <GetDemoProject/>

    <MaterialData />
    <div className="min-h-screen bg-white">
      {/* page container */}
      <div className="mx-auto w-[90%] px-0 py-0 md:py-14 lg:py-14 sm:px-6 lg:px-8">
        {/* top two-column section */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
          {/* left column */}
          <HeaderSection
            // onUpload={handleUpload}
            // onQROpen={() => setOpenQR(true)}
            // fileInputRef={fileRef}
            // onFileChange={handleFileChange}
          />

          {/* right column preview box */}
          <div className="hidden lg:block md:block">
          <PreviewBox />
          </div>
        </div>

        {/* demo rooms panel */}
        <DemoRoomsPanel
          // images={DEMO_IMAGES}
          // selectedIdx={selectedIdx}
          // onImageSelect={handleImageSelect}
          // onImageClick={onImageClick || (() => {})}
          // searchValue={searchValue}
          // onSearchChange={setSearchValue}
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