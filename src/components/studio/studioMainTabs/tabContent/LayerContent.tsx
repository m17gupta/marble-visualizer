import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/redux/hooks";
import {
  clearTestCanvas,
  PolyModel,
  setAnnotation,
  updateAnnotation,
} from "@/redux/slices/TestCanvasSlices";
import { CanvasSizeSlider } from "@/components/canvas/layerCanvas/CanvasSizeSlider";
import { jsonData } from "../../../../components/canvas/layerCanvas/JsonData";
import { Checkbox } from "@/components/ui/checkbox";

const LayerContent = () => {
  const [inputValue, setInputValue] = useState("");
  const [isFormatted, setIsFormatted] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const dispatch = useAppDispatch();
  const [sampleData, setSampleData] = useState<PolyModel[]>([]);
  const parsedData = useMemo(() => {
    if (!inputValue.trim()) return null;

    try {
      return JSON.parse(inputValue);
    } catch (error) {
      return null;
    }
  }, [inputValue]);

  // console.log("Parsed Data:", parsedData)
  // console.log("Input Value:", inputValue)
  const formatJSON = () => {
    if (parsedData) {
      const formatted = JSON.stringify(parsedData, null, 2);
      setInputValue(formatted);
      setIsFormatted(true);
    }
  };

  const clearInput = () => {
    setInputValue("");
    setIsFormatted(false);
    dispatch(clearTestCanvas());
    setSampleData([]);
  };

  useEffect(() => {
    if (!parsedData) return;
    const allpoly: PolyModel[] = [];
    if (parsedData.results && Array.isArray(parsedData.results)) {
      const result = parsedData.results;

      // convert polygon into number Array
      if (result && result.length > 0) {
        result.forEach((item: any, index: number) => {
          const flattened: number[] = item.polygon.flat();
          const data = {
            id: index,
            name: item.label || "",
            box: item.box || [],
            annotation: flattened,
          };
          allpoly.push(data);
        });
      }

      if (allpoly.length > 0) {
        setSampleData(allpoly);
        // console.log("All Polygon Data:", allpoly)
        dispatch(setAnnotation(allpoly));
      }
    }
  }, [parsedData, dispatch]);

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 1500);
    } catch (err) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 1500);
    }
  };
  const handleSegmentClick = (item: PolyModel) => {
    console.log("Segment clicked:", item);

    dispatch(updateAnnotation(item));
  };

  return (
    <div className="p-6 space-y-6">
      <CanvasSizeSlider />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {/* <Label htmlFor="response-input" className="text-sm font-medium">
            Paste JSON Response
          </Label> */}

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyJSON}
              // disabled={!parsedData}
            >
              Copy JSON
            </Button>
            {copyStatus === "success" && (
              <span className="text-green-600 text-xs ml-1">Copied!</span>
            )}
            {copyStatus === "error" && (
              <span className="text-red-600 text-xs ml-1">Copy failed</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={formatJSON}
              disabled={!parsedData}
            >
              Format JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearInput}
              disabled={!inputValue}
            >
              Clear
            </Button>
          </div>
        </div>

        <textarea
          id="response-input"
          placeholder="Paste your JSON response here..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full h-40 p-3 text-sm font-mono border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {sampleData && sampleData.length > 0 && (
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {sampleData.map((item) => (
            <div key={item.name} onClick={() => handleSegmentClick(item)}>
              <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                  id="toggle-2"
                  defaultChecked
                  className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">{item.name}</p>
                </div>
              </Label>
            </div>
          ))}
        </div>
      )}

      {/* {parsedData && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Formatted JSON Output</Label>
          <div className="max-h-96 overflow-auto border rounded-md">
            <pre className="p-4 text-xs font-mono bg-muted">
              <code>{JSON.stringify(parsedData, null, 2)}</code>
            </pre>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default LayerContent;
