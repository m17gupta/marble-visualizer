import * as React from "react";
import { DEFAULT_ROOM_IMAGE } from "./constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const PreviewBox = () => {
  const { userImage } = useSelector((state: RootState) => state.demoCanvas);
  const [imageSrc, setImageSrc] = React.useState<string>(DEFAULT_ROOM_IMAGE);
  const alt = "Room Preview";
  const navigate = useNavigate();

  React.useEffect(() => {
    let objectUrl: string | null = null;

    if (userImage) {
      objectUrl = URL.createObjectURL(userImage);
      setImageSrc(objectUrl);
      navigate("/try-visualizer/sample");
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userImage, navigate]);

  return (
    <section className="relative rounded-md border border-gray-50 bg-gray-50 p-3">

      {/* Main Preview Image */}
      <div className="aspect-[16/9] w-full overflow-hidden rounded-sm">
      <video
          width="100%"
          autoPlay
          muted
          loop
          playsInline
          style={{ borderRadius: "8px" }}
        >
          <source src="https://cdn-2.reimaginehome.ai/media/webflow/videos/SignUpVideo.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Background Video Overlay */}
      <div className="absolute bottom-4 right-4 w-[220px] rounded-lg overflow-hidden hidden md:block">
        <video
          width="100%"
          autoPlay
          muted
          loop
          playsInline
          style={{ borderRadius: "8px" }}
        >
          <source src="https://cdn-2.reimaginehome.ai/media/webflow/videos/SignUpVideo.mp4" type="video/mp4" />
        </video>
      </div>

   

    </section>
  );
};

export default PreviewBox;
