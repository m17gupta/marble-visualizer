import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"; // <-- Import HoverCard instead of Popover

// Note: I left the other imports in case you need them elsewhere.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

export function SelectPalletPopover() {
  const dispatch = useDispatch<AppDispatch>();
  const { requests } = useSelector((state: RootState) => state.genAi);

  const handleDelete = (data: string) => {
    // Your delete logic here
    console.log("Deleting item:", data);
  };

  return (
    <div className="flex items-baseline  gap-4 rounded-md border border-gray-200 bg-white px-2  mb-4 mx-4">
      <div className="flex flex-grow gap-2 overflow-x-auto scroll-thin p-2 ">
        
        <HoverCard>
          {/* Replace PopoverTrigger with HoverCardTrigger */}
          <HoverCardTrigger asChild>
            <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#25f474] bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105">
              <img
                src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__830_OTUxMTE0.jpg"
                alt="user-input"
                className="h-6 w-6 rounded-md object-cover"
              />
              <p className="text-sm">WL1 </p>
              <span
                className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                // The onClick for deleting will still work perfectly
                onClick={() => handleDelete("wall-1-id")}
              >
                &times;
              </span>
            </div>
          </HoverCardTrigger>

          {/* Replace PopoverContent with HoverCardContent */}
          <HoverCardContent
            className="w-[240px] rounded-xl p-3 shadow-lg"
            sideOffset={8}
          >
            <h6 className="mb-2 text-md font-semibold">wall 1</h6>
            <img
              src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__830_OTUxMTE0.jpg"
              alt="seg-img"
              className="rounded-md"
            />
          </HoverCardContent>
        </HoverCard>

       


        <HoverCard>
          {/* Replace PopoverTrigger with HoverCardTrigger */}
          <HoverCardTrigger asChild>
            <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#00b7eb] bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105">
              <img
                src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Pella - 6 Lite Vinyl Casement - Black_1698672052.png"
                alt="user-input"
                className="h-6 w-6 rounded-md object-cover"
              />
              <p className="text-sm">Gutter </p>
              <span
                className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                // The onClick for deleting will still work perfectly
                onClick={() => handleDelete("wall-1-id")}
              >
                &times;
              </span>
            </div>
          </HoverCardTrigger>

          {/* Replace PopoverContent with HoverCardContent */}
          <HoverCardContent
            className="w-[240px] rounded-xl p-3 shadow-lg"
            sideOffset={8}
          >
            <h6 className="mb-2 text-md font-semibold">wall 1</h6>
            <img
              src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Belden__830_OTUxMTE0.jpg"
              alt="seg-img"
              className="rounded-md"
            />
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          {/* Replace PopoverTrigger with HoverCardTrigger */}
          <HoverCardTrigger asChild>
            <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105">
              <img
                src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/test.jpeg"
                alt="user-input"
                className="h-6 w-6 rounded-md object-cover"
              />
              <p className="text-sm">Mask </p>
              <span
                className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                // The onClick for deleting will still work perfectly
                onClick={() => handleDelete("wall-1-id")}
              >
                &times;
              </span>
            </div>
          </HoverCardTrigger>

          {/* Replace PopoverContent with HoverCardContent */}
          <HoverCardContent
            className="w-[240px] rounded-xl p-3 shadow-lg"
            sideOffset={8}
          >
            <h6 className="mb-2 text-md font-semibold">Mask</h6>
            <img
              src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/test.jpeg"
              alt="seg-img"
              className="rounded-md"
            />
          </HoverCardContent>
        </HoverCard>

        <HoverCard>
          {/* Replace PopoverTrigger with HoverCardTrigger */}
          <HoverCardTrigger asChild>
            <Button
              variant="outline"
              className="flex w-40 items-center justify-between px-2"
            >
              {/* 1. Wrap the text in its own span */}
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                change the wall with you
              </span>

              {/* 2. The close icon */}
              <span className="ml-2 text-lg text-gray-500">&times;</span>
            </Button>
          </HoverCardTrigger>

          {/* Replace PopoverContent with HoverCardContent */}
          <HoverCardContent
            className="w-[240px] rounded-xl p-3 shadow-lg"
            sideOffset={8}
          >
            <h6 className="mb-2 text-sm font-semibold">
              change the wall with with pallet image
            </h6>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

{
  /* <HoverCard>
  <HoverCardTrigger asChild>
    <Button
      variant="outline"
      className="flex w-40 items-center justify-between px-2"
    >
   
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
        change the wall with you
      </span>

      <span className="ml-2 text-lg text-gray-500">&times;</span>
    </Button>
  </HoverCardTrigger>

  <HoverCardContent
    className="w-[240px] rounded-xl p-3 shadow-lg"
    sideOffset={8}
  >
    <h6 className="mb-2 text-sm font-semibold">
      change the wall with with pallet image
    </h6>
  </HoverCardContent>
</HoverCard>; */
}

{/* <HoverCard>
  <HoverCardTrigger asChild>
    <div className="ps-2 pe-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-2 py-1 shadow-sm transition-transform duration-200 hover:scale-105">
      <img
        src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/test.jpeg"
        alt="user-input"
        className="h-6 w-6 rounded-md object-cover"
      />
      <p className="text-sm">Mask </p>
      <span
        className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
        onClick={() => handleDelete("wall-1-id")}
      >
        &times;
      </span>
    </div>
  </HoverCardTrigger>

  <HoverCardContent
    className="w-[240px] rounded-xl p-3 shadow-lg"
    sideOffset={8}
  >
    <h6 className="mb-2 text-md font-semibold">Mask</h6>
    <img
      src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/test.jpeg"
      alt="seg-img"
      className="rounded-md"
    />
  </HoverCardContent>
</HoverCard>; */}
