import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { MasterGroupModel } from "@/models/jobModel/JobModel";
import { setCanvasType } from "@/redux/slices/canvasSlice";
// import { setActiveTab } from "@/redux/slices/TabControlSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import AddSegSidebar from "../canvas/canvasAddNewSegment/AddSegSidebar";

const wallToDefaultTab: Record<string, string> = {
  account: "w1",
  password: "w2",
  tab3: "w3",
  tab4: "w4",
  tab5: "w5",
};

const StudioTabs = () => {
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const wallRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [activeWall, setActiveWall] = useState("account");

  useEffect(() => {
    const defaultInnerTab = wallToDefaultTab[activeWall];
    const el = tabRefs.current[defaultInnerTab];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });

    const wallEl = wallRefs.current[activeWall];
    if (wallEl)
      wallEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  }, [activeWall]);

  const handleInnerTabClick = (tab: string) => {
    const el = tabRefs.current[tab];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  };

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const { selectedMasterArray, selectedGroupSegment } = useSelector(
    (state: RootState) => state.masterArray
  );

  const [currentSelectedGroupSegment, setCurrentSelectedGroupSegment] =
    useState<MasterGroupModel | null>(null);
  // update the active
  useEffect(() => {
    if (
      selectedGroupSegment &&
      selectedGroupSegment.groupName &&
      selectedGroupSegment.segments.length > 0
    ) {
      setActiveTab(selectedGroupSegment.groupName);
      setCurrentSelectedGroupSegment(selectedGroupSegment);
    } else {
      setCurrentSelectedGroupSegment(null);
    }
  }, [selectedGroupSegment]);

  const handleAddGroupSegment = () => {

    if (currentSelectedGroupSegment == null) {
      alert("please select the group segment");
    } else {
      dispatch(setCanvasType("draw"));
    }
  };

  return (
    <Tabs
      defaultValue="account"
      value={activeWall}
      onValueChange={setActiveWall}
      className="w-full"
    >
      {/* Wall Tabs + Home Button */}
      <div className="flex items-center justify-between border-b bg-[#f8f9fa] px-2 py-2 w-42">
        <TabsList className=" w-48 flex-1 overflow-x-visible whitespace-nowrap pb-2 no-scrollbar flex items-center gap-1 bg-transparent ">
          <Swiper
            spaceBetween={8}
            slidesPerView="auto"
            className="max-w-[100%] flex-1 ml-0 gap-0"
          >
            {[
              { label: "Wall1", value: "account" },
              { label: "Wall2", value: "password" },
              { label: "Wall3", value: "tab3" },
              { label: "Wall4", value: "tab4" },
              { label: "Wall5", value: "tab5" },
            ].map((tab) => (
              <SwiperSlide key={tab.value} className="!w-auto">
                <TabsTrigger
                  ref={(el) => (wallRefs.current[tab.value] = el)}
                  value={tab.value}
                  className="px-4 py-2 text-sm rounded-t-md bg-transparent text-gray-600 data-[state=active]:bg-cyan-200 data-[state=active]:text-black"
                >
                  {tab.label}
                </TabsTrigger>
              </SwiperSlide>
            ))}
          </Swiper>
        </TabsList>

        <Button
          variant="ghost"
          className="ml-2 p-2 bg-white hover:bg-gray-200 rounded-md shadow-sm"
          onClick={handleAddGroupSegment}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475" />
            <path d="M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" />
            <path d="M15 18h6" />
            <path d="M18 15v6" />
          </svg>
        </Button>
      </div>

      {/* Inner Tabs for Wall 1 */}
      <TabsContent value="account">
        <Tabs defaultValue="w1" className="w-full">
          <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar px-2 py-1 bg-white">
            <Swiper spaceBetween={8} slidesPerView="auto" className="w-full">
              {["w1", "w2", "w3", "w4"].map((tab) => (
                <SwiperSlide key={tab} className="!w-auto">
                  <TabsTrigger
                    value={tab}
                    ref={(el) => (tabRefs.current[tab] = el)}
                    onClick={() => handleInnerTabClick(tab)}
                    className="uppercase text-sm font-semibold px-3 py-1 text-gray-500 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
                  >
                    {tab}
                  </TabsTrigger>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsList>

          <TabsContent value="w1" className="p-4">
            Content for W1

            {/* <AddSegSidebar /> */}
          </TabsContent>
          <TabsContent value="w2" className="p-4">
            Content for W2
          </TabsContent>
          <TabsContent value="w3" className="p-4">
            Content for W3
          </TabsContent>
          <TabsContent value="w4" className="p-4">
            Content for W4
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* Other Wall Tabs Content */}
      <TabsContent value="password">
        <Tabs defaultValue="w1" className="w-full">
          <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar px-2 py-1 bg-white">
            <Swiper spaceBetween={8} slidesPerView="auto" className="w-full">
              {["w1", "w2", "w3", "w4"].map((tab) => (
                <SwiperSlide key={tab} className="!w-auto">
                  <TabsTrigger
                    value={tab}
                    ref={(el) => (tabRefs.current[tab] = el)}
                    onClick={() => handleInnerTabClick(tab)}
                    className="uppercase text-sm font-semibold px-3 py-1 text-gray-500 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
                  >
                    {tab}
                  </TabsTrigger>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsList>

          <TabsContent value="w1" className="p-4">
            Content for W1
          </TabsContent>
          <TabsContent value="w2" className="p-4">
            Content for W2
          </TabsContent>
          <TabsContent value="w3" className="p-4">
            Content for W3
          </TabsContent>
          <TabsContent value="w4" className="p-4">
            Content for W4
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="tab3">
        <Tabs defaultValue="w1" className="w-full">
          <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar px-2 py-1 bg-white">
            <Swiper spaceBetween={8} slidesPerView="auto" className="w-full">
              {["w1", "w2", "w3", "w4"].map((tab) => (
                <SwiperSlide key={tab} className="!w-auto">
                  <TabsTrigger
                    value={tab}
                    ref={(el) => (tabRefs.current[tab] = el)}
                    onClick={() => handleInnerTabClick(tab)}
                    className="uppercase text-sm font-semibold px-3 py-1 text-gray-500 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
                  >
                    {tab}
                  </TabsTrigger>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsList>

          <TabsContent value="w1" className="p-4">
            Content for W1
          </TabsContent>
          <TabsContent value="w2" className="p-4">
            Content for W2
          </TabsContent>
          <TabsContent value="w3" className="p-4">
            Content for W3
          </TabsContent>
          <TabsContent value="w4" className="p-4">
            Content for W4
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="tab4">
        <Tabs defaultValue="w1" className="w-full">
          <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar px-2 py-1 bg-white">
            <Swiper spaceBetween={8} slidesPerView="auto" className="w-full">
              {["w1", "w2", "w3", "w4"].map((tab) => (
                <SwiperSlide key={tab} className="!w-auto">
                  <TabsTrigger
                    value={tab}
                    ref={(el) => (tabRefs.current[tab] = el)}
                    onClick={() => handleInnerTabClick(tab)}
                    className="uppercase text-sm font-semibold px-3 py-1 text-gray-500 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
                  >
                    {tab}
                  </TabsTrigger>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsList>

          <TabsContent value="w1" className="p-4">
            Content for W1
          </TabsContent>
          <TabsContent value="w2" className="p-4">
            Content for W2
          </TabsContent>
          <TabsContent value="w3" className="p-4">
            Content for W3
          </TabsContent>
          <TabsContent value="w4" className="p-4">
            Content for W4
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="tab5">
        <Tabs defaultValue="w1" className="w-full">
          <TabsList className="flex overflow-x-auto whitespace-nowrap border-b no-scrollbar px-2 py-1 bg-white">
            <Swiper spaceBetween={8} slidesPerView="auto" className="w-full">
              {["w1", "w2", "w3", "w4"].map((tab) => (
                <SwiperSlide key={tab} className="!w-auto">
                  <TabsTrigger
                    value={tab}
                    ref={(el) => (tabRefs.current[tab] = el)}
                    onClick={() => handleInnerTabClick(tab)}
                    className="uppercase text-sm font-semibold px-3 py-1 text-gray-500 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
                  >
                    {tab}
                  </TabsTrigger>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabsList>

          <TabsContent value="w1" className="p-4">
            Content for W1
          </TabsContent>
          <TabsContent value="w2" className="p-4">
            Content for W2
          </TabsContent>
          <TabsContent value="w3" className="p-4">
            Content for W3
          </TabsContent>
          <TabsContent value="w4" className="p-4">
            Content for W4
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};

export default StudioTabs;
