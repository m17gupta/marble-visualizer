import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const TabNavigation = () => {
  const [designhubactivetab, setDesignHubActiveTab] = useState(
    "recommendations-swatches"
  );

  const { activeTab: tabControlActiveTab } = useSelector(
    (state: RootState) => state.tabControl
  );

  const handleChangeTab = (value: string) => {
    console.log("Tab changed to:", value);
    setDesignHubActiveTab(value);
  };

  useEffect(() => {
    if (tabControlActiveTab) {
      handleChangeTab(tabControlActiveTab);
    }
  }, [tabControlActiveTab]);

  const [active, setActive] = useState("palette");

  const buttons = [
    {
      id: "materials",
      icon: (
        <img
          src="/assets/image/line-md--gauge-loop.svg"
          alt="Materials"
          className="h-4 w-4"
        />
      ),
    },
    {
      id: "edit",
      isDropdown: true,
    },
    {
      id: "measurement",
      icon: (
        <img
          src="/assets/image/carbon--area.svg"
          alt="Information"
          className="h-4 w-4"
        />
      ),
    },
    {
      id: "information",
      icon: (
        <img
          src="/assets/image/solar--info-square-linear.svg"
          alt="Information"
          className="h-4 w-4"
        />
      ),
    },
   
  ];

  return (
    <div className="flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground border-b border-gray-200 gap-2">
      {buttons.map((btn) => {
        if (btn.id === "edit") {
          return (
            <DropdownMenu key="edit">
              <DropdownMenuTrigger asChild>
                <button
                  onClick={() => setActive("edit")}
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    active === "edit"
                      ? "bg-black text-white border-gray-800"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <img
                    src="/assets/image/line-md--edit-twotone.svg"
                    alt="Edit"
                    className="h-4 w-4"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Edit Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <img
                    src="/assets/image/line-md--edit-twotone.svg"
                    alt="Edit"
                    className="h-4 w-4 mr-2"
                  />
                  Edit Annotation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <img
                    src="/assets/image/line-md--history-alt.svg"
                    alt="Re-annotate"
                    className="h-4 w-4 mr-2"
                  />
                  Re-Annotation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <img
                    src="/assets/image/line-md--trash.svg"
                    alt="Delete"
                    className="h-4 w-4 mr-2"
                  />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <button
            key={btn.id}
            onClick={() => setActive(btn.id)}
            className={`px-3 py-1 rounded-md border transition-colors ${
              active === btn.id
                ? "bg-black text-white border-gray-800"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {btn.icon}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
