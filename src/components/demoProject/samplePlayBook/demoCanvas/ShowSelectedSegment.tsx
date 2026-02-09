import * as fabric from 'fabric';
import { getPolygonCentroid, topRightCorner } from '@/components/canvasUtil/CalculatepolygonCentroid';
import { handlePolygonlieInPolygon } from '@/components/canvasUtil/test/HoverSegmentTest';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsMasterSelected } from '@/redux/slices/demoProjectSlice/DemoCanvasSlice';
import { toast } from 'sonner';
import { updateAnontationPosition } from '@/redux/slices/demoProjectSlice/DemoMasterArraySlice';

type Props = {
    canvas: React.RefObject<any>;
    zoom?: number;
};

interface centerPointModel {
    [key: string]: { x: number; y: number }
}

export interface CheckboxPosition {
    segmentKey: string;
    x: number;
    y: number;
    checked: boolean;
}
const computeCheckboxPositions = (
  centerPoint: centerPointModel,
  ratioW: number,
  ratioH: number,
  vt: number[],
  left: number,
  top: number
): CheckboxPosition[] => {
  return Object.entries(centerPoint).map(([segmentKey, pt]) => {
    const x = pt.x * ratioW;
    const y = pt.y * ratioH;
    const transformedX = vt[0] * x + vt[2] * y + vt[4];
    const transformedY = vt[1] * x + vt[3] * y + vt[5];
  
    return {
      segmentKey,
      x: transformedX + left + 80,
      y: transformedY + top + 80,
      checked: false,
    };
  });
};

const ShowSelectedSegment: React.FC<Props> = ({ canvas, zoom }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedDemoMasterItem } = useSelector((state: RootState) => state.demoMasterArray);
    const [centerPoint, setCenterPoint] = useState<centerPointModel>({});
    // const [checkboxPositions, setCheckboxPositions] = useState<CheckboxPosition[]>([]);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const { aiTrainImageHeight, aiTrainImageWidth } = useSelector((state: RootState) => state.canvas)
     const [masterCenterPoint, setMasterCenterPoint] = useState<centerPointModel>({});
  const [checkboxPositions, setCheckboxPositions] = useState<CheckboxPosition[]>([]);
  const [masterCheckboxPositions, setMasterCheckboxPositions] = useState<CheckboxPosition[]>([]);
  const [segName, setSegName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const [marginTop, setMarginTop] = useState<number>(0);
 const { isMasterSelected, isMask } = useSelector((state: RootState) => state.demoCanvas);
      const { isUpdatePoint } = useSelector((state: RootState) => state.demoCanvas);


  // ---------- derived state ----------
  const allSelected = useMemo(
    () => checkboxPositions.length > 0 && checkboxPositions.every(p => p.checked),
    [checkboxPositions]
  );
  const selectedCount = useMemo(
    () => checkboxPositions.filter(p => p.checked).length,
    [checkboxPositions]
  );

      // ---------- compute centroids ----------
  useEffect(() => {
    if (selectedDemoMasterItem?.name && canvas.current) {
      const fabricCanvas = canvas.current;
   
      const allSeg = selectedDemoMasterItem.allSegments as SegmentModal[];
      if (allSeg?.length) {
        const map: centerPointModel = {};
        for (const seg of allSeg) {
          if (seg.show_annotation_points) {
           
            map[seg.show_annotation_points.segmentKey] = { x: seg.show_annotation_points.x, y: seg.show_annotation_points.y };
            setCenterPoint(map);
            const masterKey = selectedDemoMasterItem.name;

            setSegName(masterKey);

            setMasterCenterPoint({ [masterKey]: map[allSeg[0]?.short_title ?? ""] });

          } else {
            const cp = getPolygonCentroid(seg.annotation_points_float || []);
            let isCenterPoint;
            if (selectedDemoMasterItem.name != "Window" && selectedDemoMasterItem.name != "Door") {
              const fabricPoint = new fabric.Point(cp.x, cp.y);
              isCenterPoint = handlePolygonlieInPolygon(canvas, fabricPoint)
            }

            const topRight = topRightCorner(seg.annotation_points_float || []);
            if (seg.short_title) map[seg.short_title] = isCenterPoint ? topRight : cp;
          }
          setCenterPoint(map);

          // set master center point
          const masterKey = selectedDemoMasterItem.name;

          setSegName(masterKey);
          const fisrtSeg = allSeg[0];
          //const masterCp = getPolygonCentroid(fisrtSeg.annotation_points_float || []);
          setMasterCenterPoint({ [masterKey]: map[allSeg[0]?.short_title ?? ""] });
        }


      }

    } else {
      setMasterCenterPoint({});
      setCenterPoint({});
    }
  }, [selectedDemoMasterItem, canvas]);

  useEffect(() => {
    setCheckboxPositions([]);
    setMasterCheckboxPositions([]);
    if (!canvas.current) return;
    if (!aiTrainImageWidth || !aiTrainImageHeight) return;
    if (!Object.keys(centerPoint).length) return;
    if (!Object.keys(masterCenterPoint).length) return;

    const fabricCanvas = canvas.current;
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();

    const ratioW = canvasWidth / aiTrainImageWidth;
    const ratioH = canvasHeight / aiTrainImageHeight;


    const vt = (fabricCanvas.viewportTransform || [1, 0, 0, 1, 0, 0]) as number[]; // [a,b,c,d,e,f]

    const { left, top } = getCurrentMargins();
    setMarginLeft(left);
    setMarginTop(top);
    const positions: CheckboxPosition[] = computeCheckboxPositions(centerPoint, ratioW, ratioH, vt, left, top);
    const masterPositions: CheckboxPosition[] = computeCheckboxPositions(masterCenterPoint, ratioW, ratioH, vt, left, top);
    setMasterCheckboxPositions(masterPositions);
    setCheckboxPositions(positions);
  }, [centerPoint, canvas, aiTrainImageWidth, aiTrainImageHeight, zoom, masterCenterPoint]);


  // ---------- helpers ----------
  const getCurrentMargins = () => {
    const fabricCanvas = canvas.current;
    if (!fabricCanvas) return { left: 0, top: 0 };
    const wrapperEl = fabricCanvas.wrapperEl as HTMLElement;
    if (!wrapperEl || !wrapperEl.parentElement) return { left: 0, top: 0 };

    const parentContainer = wrapperEl.parentElement;
    const canvasRect = wrapperEl.getBoundingClientRect();
    const containerRect = parentContainer.getBoundingClientRect();

    return {
      left: (containerRect.width - canvasRect.width) / 2,
      top: (containerRect.height - canvasRect.height) / 2,
    };
  };

  

     const handleCheckboxChange = (segmentKey: string, checked: boolean) => {
    setCheckboxPositions(prev =>
      prev.map(p => (p.segmentKey === segmentKey ? { ...p, checked } : p))
    );
    // dispatch(selectSegment({ segmentKey, selected: checked })); // hook into your store if needed
  };

  const handleShowAllCheckBoxes = (segmentKey: string, checked: boolean) => {
    console.log("Master checkbox clicked:", segmentKey, checked);
    dispatch(setIsMasterSelected(false))
    setMasterCheckboxPositions(prev =>
      prev.map(p => (p.segmentKey === segmentKey ? { ...p, checked } : p))
    );
  }
  const handleToggleAll = (data: string) => {
    if (data === 'Deselect all') {
      dispatch(setIsMasterSelected(true))
      setCheckboxPositions(prev => prev.map(p => ({ ...p, checked: !allSelected })));
    } else {
      //  dispatch(setIsMasterSelected(true))
      setCheckboxPositions(prev => prev.map(p => ({ ...p, checked: !allSelected })));
    }

  };

  const handleMouseDown = (e: React.MouseEvent, segmentKey: string, currentX: number, currentY: number) => {
     if(!isUpdatePoint){
      toast.error("Please select Edit point");
      return;
     }
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDraggedItem(segmentKey);
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });


  };

  const handleMouseMove = (e: React.MouseEvent) => {
  
    if (!isDragging || !draggedItem) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setCheckboxPositions(prev =>
      prev.map(p =>
        p.segmentKey === draggedItem
          ? { ...p, x: newX, y: newY }
          : p
      )
    );

    dispatch(updateAnontationPosition({ data: [{ segmentKey: draggedItem, x: newX - marginLeft-80, y: newY - marginTop-80, checked: false }] }))
  };

  const handleMouseUp = () => {

    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleMasterMouseDown = (e: React.MouseEvent, segmentKey: string, currentX: number, currentY: number) => {
      if(!isUpdatePoint){
      toast.error("Please select Edit point");
      return;
     }
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDraggedItem(segmentKey);
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
  };

    const handleMasterMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedItem) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setMasterCheckboxPositions(prev =>
      prev.map(p =>
        p.segmentKey === draggedItem
          ? { ...p, x: newX, y: newY }
          : p
      )
    );


  };
  

    
    return (
        <div
      ref={containerRef}
      className="relative pointer-events-none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 50, // ensure above toolbar/canvas
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleMasterMouseMove(e);
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top-center select-all pill */}

      {!isMasterSelected && checkboxPositions.length > 0 && (
        <div className="absolute inset-x-0 top-24 flex justify-center pointer-events-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleAll(allSelected ? 'Deselect all' : 'Select all');
            }}
            className="px-4 py-2 rounded-full bg-gray-900/70 hover:bg-gray-900/70 text-white border border-white/70 shadow-md hover:bg-gray-800 transition flex items-center gap-2"
            aria-pressed={allSelected}
            title={allSelected ? 'Deselect all' : 'Select all'}
          >
            <span className="text-sm font-semibold">{allSelected ? 'Deselect all' : 'Select all'}</span>


            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="#fff" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="68" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><circle cx="188" cy="172" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><circle cx="68" cy="172" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle></svg>
            {selectedCount > 0 && <span className="text-xs opacity-80">({selectedCount})</span>}
          </button>
        </div>
      )}

      {/* Markers */}
      {!isMasterSelected && !isMask &&
        checkboxPositions.map((pos, index) => (
          <div
            key={pos.segmentKey}
            data-testid={`${pos.segmentKey}-label`}
            className="absolute pointer-events-auto"
            style={{
              top: `${pos.y}px`,
              left: `${pos.x}px`,
              transform: 'translate(-50%, -50%)',
              lineHeight: 0,
              transition: isDragging && draggedItem === pos.segmentKey ? 'none' : 'transform 0.15s ease',
              cursor: 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, pos.segmentKey, pos.x, pos.y)}
          >
            <button
              onClick={(e) => {
                if (!isDragging) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCheckboxChange(pos.segmentKey, !pos.checked);
                }
              }}
              aria-label={pos.segmentKey}
              aria-pressed={pos.checked}
              className={`group relative inline-flex items-center justify-center p-2 rounded-full shadow-md border transition 
              ${pos.checked
                  ? 'bg-gray-900/70 border-white/90 ring-1 ring-white/90'
                  : 'bg-gray-900/70 border-white/85 hover:bg-gray-800'
                }`}
            >

              {pos.checked ? (
                <svg
                  viewBox="0 0 20 20"
                  className="w-4 h-4 text-blue bg-white rounded-full"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10.5l3 3 7-7" />
                </svg>
              ) : (
                <span className="w-3 h-3 p-1 rounded-full bg-white inline-block" />
              )}
            </button>
            <span>{pos.segmentKey}</span>

          </div>
        ))}

      {/* Master Marker */}
      {isMasterSelected &&
        !isMask &&
        masterCheckboxPositions.map((pos) => (
          <div
            key={pos.segmentKey}
            data-testid={`${pos.segmentKey}-label`}
            className="absolute pointer-events-auto"
            style={{
              top: `${pos.y}px`,
              left: `${pos.x}px`,
              transform: 'translate(-50%, -50%)',
              lineHeight: 0,
              transition: isDragging && draggedItem === pos.segmentKey ? 'none' : 'transform 0.15s ease',
              cursor: 'grab',
            }}
            onMouseDown={(e) => handleMasterMouseDown(e, pos.segmentKey, pos.x, pos.y)}
            onClick={(e) => {
              if (!isDragging) {
                e.preventDefault();
                e.stopPropagation();
                handleShowAllCheckBoxes(pos.segmentKey, !pos.checked);
              }
            }}
          >
            <button
              // onClick={(e) => {
              //   e.preventDefault();
              //   e.stopPropagation();
              //   handleShowAllCheckBoxes(pos.segmentKey, !pos.checked);
              // }}
              aria-label={pos.segmentKey}
              aria-pressed={pos.checked}
              className={`group relative inline-flex items-center justify-center p-2 rounded-full shadow-md border transition 
              ${pos.checked
                  ? 'bg-gray-900/70 border-white/90 ring-1 ring-white/90'
                  : 'bg-gray-900/70 border-white/85 hover:bg-gray-800'
                }`}
            >

              {pos.checked ? (
                <svg
                  viewBox="0 0 20 20"
                  className="w-4 h-4 text-blue bg-white rounded-full"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10.5l3 3 7-7" />
                </svg>
              ) : (
                <span className="w-3 h-3 p-1 rounded-full bg-white inline-block" >

                </span>
              )}
            </button>

            <div className="w-max mx-auto mt-2 text-center text-black text-base font-semibold drop-shadow bg-white/80 rounded px-2 py-0.5 select-none pointer-events-none"
            //onClick={() => handleShowAllCheckBoxes(pos.segmentKey, !pos.checked)}
            >
              {pos.segmentKey}
            </div>
          </div>
        ))}
    </div>
    )
}

export default ShowSelectedSegment

