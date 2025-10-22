
import { getPolygonCentroid } from '@/components/canvasUtil/CalculatepolygonCentroid';
import { SegmentModal } from '@/models/jobSegmentsModal/JobSegmentModal';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

type Props = {
    canvas: React.RefObject<any>;
    zoom?: number;
};

interface centerPointModel {
    [key: string]: { x: number; y: number }
}

interface CheckboxPosition {
    segmentKey: string;
    x: number;
    y: number;
    checked: boolean;
}
const ShowSelectedSegment: React.FC<Props> = ({ canvas, zoom }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedDemoMasterItem } = useSelector((state: RootState) => state.demoMasterArray);
    const [centerPoint, setCenterPoint] = useState<centerPointModel>({});
    const [checkboxPositions, setCheckboxPositions] = useState<CheckboxPosition[]>([]);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const { aiTrainImageHeight, aiTrainImageWidth } = useSelector((state: RootState) => state.canvas)
    // Calculate center points when selectedDemoMasterItem changes
    useEffect(() => {
        if (selectedDemoMasterItem &&
            selectedDemoMasterItem.name &&
            selectedDemoMasterItem.name) {

            const allSeg = selectedDemoMasterItem.allSegments as SegmentModal[];
            if (allSeg && allSeg.length > 0) {
                const newCenterPoints: centerPointModel = {};
                allSeg.forEach(seg => {
                    const allPoints = seg.annotation_points_float;
                    const centerPoints = getPolygonCentroid(allPoints || []);
                    if (seg.short_title) {
                        newCenterPoints[seg.short_title] = centerPoints;
                    }
                });
                setCenterPoint(newCenterPoints);
            }
        } else {
            setCenterPoint({});
        }
    }, [selectedDemoMasterItem]);

    // Get canvas position and convert center points to screen coordinates
    // Sync overlay positions with canvas zoom/pan
    useEffect(() => {
        setCheckboxPositions([]);
        if (
            canvas.current &&
            Object.keys(centerPoint).length > 0 &&
            aiTrainImageWidth &&
            aiTrainImageHeight
        ) {
            const fabricCanvas = canvas.current;
            const canvasWidth = fabricCanvas.getWidth();
            const canvasHeight = fabricCanvas.getHeight();
            const ratioWidth = canvasWidth / aiTrainImageWidth;
            const ratioHeight = canvasHeight / aiTrainImageHeight;
            const { left, top } = getCurrentMargins();
            console.log('Canvas margins:', { left, top });
            // Get current viewport transform for zoom/pan
            const vt = fabricCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];
            // [scaleX, skewX, skewY, scaleY, translateX, translateY]

            // Get canvas element and its bounding rect
            const canvasElement = fabricCanvas.getElement();
            if (canvasElement) {
                const rect = canvasElement.getBoundingClientRect();
                setCanvasOffset({ x: rect.left, y: rect.top });

                // Convert center points to checkbox positions, applying zoom/pan
                const positions: CheckboxPosition[] = Object.entries(centerPoint).map(([segmentKey, position]) => {
                    // Transform the logical (image) coordinates to canvas coordinates
                    let x = position.x * ratioWidth;
                    let y = position.y * ratioHeight;
                    // Apply viewport transform (zoom/pan)
                    const transformedX = vt[0] * x + vt[2] * y + vt[4];
                    const transformedY = vt[1] * x + vt[3] * y + vt[5];
                    return {
                        segmentKey,
                        x: transformedX + left,
                        y: transformedY + top,
                        checked: false
                    };
                });

                console.log('Calculated checkbox positions:', positions);
                setCheckboxPositions(positions);
            }
        }
    }, [centerPoint, canvas, aiTrainImageWidth, aiTrainImageHeight, zoom]);

    // Listen for canvas zoom/pan and update positions
    // useEffect(() => {
    //     const fabricCanvas = canvas.current;
    //     if (!fabricCanvas) return;
    //     const updatePositions = () => {
    //         // Trigger the above effect by updating centerPoint (shallow copy)
    //         setCenterPoint(cp => ({ ...cp }));
    //     };
    //     fabricCanvas.on('viewport:changed', updatePositions);
    //     fabricCanvas.on('zoom:changed', updatePositions);
    //     fabricCanvas.on('object:moving', updatePositions);
    //     return () => {
    //         fabricCanvas.off('viewport:changed', updatePositions);
    //         fabricCanvas.off('zoom:changed', updatePositions);
    //         fabricCanvas.off('object:moving', updatePositions);
    //     };
    // }, [canvas, centerPoint]);

    // Handle checkbox change
    const handleCheckboxChange = (segmentKey: string, checked: boolean) => {
        // console.log(`Segment ${segmentKey} ${checked ? 'selected' : 'deselected'}`);
        // console.log('Before update:', checkboxPositions);

        setCheckboxPositions(prev => {
            const updated = prev.map(pos =>
                pos.segmentKey === segmentKey
                    ? { ...pos, checked }
                    : pos
            );
            console.log('After update:', updated);
            return updated;
        });

        // You can dispatch an action here to handle segment selection
        // dispatch(selectSegment({ segmentKey, selected: checked }));
    };


    const getCurrentMargins = () => {
        const fabricCanvas = canvas.current;
        if (!fabricCanvas) return { left: 0, top: 0 };

        // Get the Fabric.js wrapper element (the container div around the canvas)
        const wrapperEl = fabricCanvas.wrapperEl as HTMLElement;
        if (!wrapperEl || !wrapperEl.parentElement) return { left: 0, top: 0 };

        // Get the parent container (the section wrapper from NewCanvas)
        const parentContainer = wrapperEl.parentElement;
        const canvasRect = wrapperEl.getBoundingClientRect();
        const containerRect = parentContainer.getBoundingClientRect();

        return {
            left: (containerRect.width - canvasRect.width) / 2,
            top: (containerRect.height - canvasRect.height) / 2
        };
    };
    return (
        <div ref={containerRef} className="relative pointer-events-none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {checkboxPositions.map((position) => (
                <div
                    key={position.segmentKey}
                    data-testid={`${position.segmentKey}-label`}
                    className="absolute pointer-events-auto"
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        top: `${position.y}px`,
                        left: `${position.x}px`,
                        display: 'grid',
                        placeItems: 'center',
                        width: 'auto',
                        height: 'auto',
                        transform: 'translate(-50%, -50%)',
                        lineHeight: '0',
                        transition: '0.35s',
                        userSelect: 'none'
                    }}
                >
                    <button
                        className={`relative flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-300 ${position.checked
                            ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                            : 'bg-gray-800 bg-opacity-80 border-white text-white hover:bg-gray-700'
                            }`}
                        data-selected={position.checked}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Button clicked for:', position.segmentKey, 'Current state:', position.checked);
                            handleCheckboxChange(position.segmentKey, !position.checked);
                        }}
                    >
                        {/* Label Text */}
                        <p className="text-xs font-medium whitespace-nowrap">
                            {position.segmentKey}
                        </p>

                        {/* Expandable Content - shows when selected */}
                        {position.checked && (
                            <div
                                className="flex items-center overflow-hidden transition-all duration-300 ease-in-out"
                                style={{
                                    minWidth: '0px',
                                    maxWidth: position.checked ? '200px' : '0px',
                                    opacity: position.checked ? 1 : 0
                                }}
                            >
                                <div className="flex items-center pl-1">
                                    <div className="relative">
                                        {/* Thumbnail Preview */}
                                        <div
                                            className="w-3 h-3 rounded-full border border-white"
                                            style={{
                                                backgroundImage: `url("/services/product/product_thumbnails/ae10ad69034a471d8b40d8615d2f6bf3/content/")`,
                                                backgroundSize: '300%',
                                                backgroundPosition: 'center center',
                                                position: 'absolute',
                                                top: '0px',
                                                insetInlineStart: '0px'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ShowSelectedSegment