import * as React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Box, UploadCloud, QrCode } from "lucide-react";
import { HeaderSectionProps } from "./types";
import { DirectS3UploadService } from "@/services/uploadImageService/directS3UploadService";
import { useSelector } from "react-redux";
import { selectProfile } from "@/redux/slices/user/userProfileSlice";
import PreviewBox from "./PreviewBox";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUserImage } from "@/redux/slices/demoProjectSlice/DemoCanvasSlice";

type Props = {
};

const HeaderSection: React.FC<Props> = () => {

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [openQR, setOpenQR] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);

  const profile = useSelector(selectProfile);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    //console.log("Selected file:", file);
    dispatch(setUserImage(file));
   
  };

    const handleQrOpen = () => {
        setOpenQR(true);
    }
  
  return (
    <section className="space-y-5">
        <h1 className="text-[32px] font-semibold tracking-tight text-zinc-800">
          Select a room for Transformation
        </h1>

        <div className="block lg:hidden md:hidden">
         <PreviewBox />
        </div>

      {/* bullets */}
      <div className="space-y-2 text-[15px] text-zinc-800">
        <div className="flex items-start gap-2">
          <Camera className="mt-[2px] h-4 w-4 text-zinc-800" />
          <span>Upload a picture of your room</span>
        </div>
        <div className="flex items-start gap-2">
          <Box className="mt-[2px] h-4 w-4 text-zinc-800" />
          <span>Try our products in your room</span>
        </div>
      </div>

      {/* upload button with beta ribbon */}
      <div className="grid gap-4">
        <Button
          onClick={handleUpload}
          className="group h-11 w-80 gap-2 rounded-md bg-zinc-900 px-6 text-white shadow hover:bg-zinc-800"
        >
          <UploadCloud className="h-5 w-5 opacity-90" />
          <span className="text-[15px] font-semibold">Upload</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* QR button → opens modal */}
        <Button
          variant="outline"
          onClick={handleQrOpen}
          className="h-11 w-80 justify-start gap-2 rounded-md border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
        >
          <QrCode className="h-4 w-4" />
          Or scan a QR code to upload pictures
        </Button>
      </div>
      <p className="pt-2 text-[16px] font-medium text-zinc-600">
        No picture? Try our demo rooms instead
      </p>
    </section>
  );
};

export default HeaderSection;