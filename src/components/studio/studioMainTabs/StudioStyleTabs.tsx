import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InspirationContent from "./tabContent/InspirationContent";

export function StudioStyleTabs() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="chat" className="shadow border border-gray-600">
            <img
              src="/assets/image/line-md--chat-round-dots.svg"
              alt="Chat Icon"
              className="h-5 w-5 mr-2"
            />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="renovation"
            className="shadow border border-gray-600">
            <img
              src="/assets/image/line-md--edit-twotone.svg"
              alt="Chat Icon"
              className="h-5 w-5 mr-2"
            />
            Renovation
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="shadow border border-gray-600">
            <img
              src="/assets/image/svgviewer-output.svg"
              alt="Chat Icon"
              className="h-5 w-5 mr-2"
            />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="flex flex-col gap-4  max-w-md mx-auto bg-white   ">
            <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-100 pb-2 p-4">
              <span>187/250 Designs Left</span>
              <button className="px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-800 text-xs font-semibold">
                Buy More Credits
              </button>
            </div>

            <div className="flex gap-3 p-4">
              <div className="relative w-16 h-16 rounded overflow-hidden border">
                <img
                  src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/CarolynReformatted_1753799607502_hgvazm.jpg"
                  alt="Thumb"
                  className="object-cover w-full h-full"
                />
                <button className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  <span className="text-xs text-red-500 font-bold">×</span>
                </button>
              </div>

              <div className="flex-1">
                <img
                  src="https://testvizualizer.s3.us-east-2.amazonaws.com/uploads/images/11/CarolynReformatted_1753799607502_hgvazm.jpg"
                  alt="Main Image"
                  className="rounded w-full object-cover max-h-40 border"
                />

                <div className="mt-1 text-gray-600 text-sm px-3 py-1 bg-gray-100 rounded-xl ">
                  aaaaa
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
              {/* Textarea */}
              <div className="px-4 pt-3">
                <textarea
                  rows={2}
                  defaultValue="aaaaa"
                  className="w-full rounded-xl border-none p-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-0 resize-none"
                  placeholder="Type your prompt..."
                  spellCheck="false"
                />
              </div>

              {/* Bottom Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                {/* Left Icons */}
                <div className="flex items-center gap-5 text-sm text-gray-600">
                  <button className="flex items-center gap-1 hover:text-purple-600 transition p-0">
                    <span className="text-base">
                    <img
                      src="/assets/image/svgviewer-output.svg"
                      alt="Chat Icon"
                      className="h-5 w-5"
                    />
                      </span> History
                  </button>
                  <button className="text-base hover:text-purple-600 transition p-0">
                    <img
                      src="/assets/image/line-md--image.svg"
                      alt="Chat Icon"
                      className="h-5 w-5 "
                    />
                   
                  </button>
                  <button className="relative text-base hover:text-purple-600 transition p-0">
                    
                    <img
                      src="/assets/image/line-md--link.svg"
                      alt="Chat Icon"
                      className="h-5 w-5 "
                    />
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      H
                    </span>

                    
                  </button>
                </div>

                {/* Generate Button */}
                <button className="px-4 py-1.5 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium transition">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="renovation">
          <InspirationContent />
        </TabsContent>

        <TabsContent value="history">
          <InspirationContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default StudioStyleTabs;
