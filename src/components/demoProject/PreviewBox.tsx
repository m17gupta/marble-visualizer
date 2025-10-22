import * as React from "react";
import { PreviewBoxProps } from "./types";
import { DEFAULT_ROOM_IMAGE } from "./constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const PreviewBox = () => {

  const {userImage} = useSelector((state: RootState) => state.demoCanvas);
  const [imageSrc, setImageSrc] = React.useState<string>(DEFAULT_ROOM_IMAGE);
  const alt = "Room Preview";

  const navigate = useNavigate();
   React.useEffect(() => {
    if(userImage){
     // console.log("PreviewBox userImage:", userImage);
      const objectUrl = URL.createObjectURL(userImage);
      setImageSrc(objectUrl);
      navigate('/try-visualizer/sample');
      
    }
  }, [userImage]);

 // console.log("PreviewBox imageSrc:", imageSrc);

  return (
    <section className="relative rounded-md border border-gray-50 bg-gray-50 p-3">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-sm">
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>

      {/* floating demo markers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-6 flex flex-col gap-3">
          <div className="h-10 w-10 md:h-16 rounded-sm bg-white/90 shadow ring-1 ring-black/10" />
          <div className="h-10 w-10 md:h-16 rounded-sm bg-white/90 shadow ring-1 ring-black/10" />
          <div className="h-10 w-10 md:h-16 rounded-sm bg-white/90 shadow ring-2 ring-blue-400/70" />
        </div>
      </div>
    </section>
  );
};

export default PreviewBox;