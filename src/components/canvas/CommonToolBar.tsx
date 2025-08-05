import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import AddSegLists from './canvasAddNewSegment/AddSegLists';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Separator } from '@/components/ui/separator';

type CommonToolBarProps = {
    title: string
    onSaveAnnotation: () => void;
}
const CommonToolBar = ({ title, onSaveAnnotation }: CommonToolBarProps) => {
    const { selectedSegment } = useSelector((state: RootState) => state.masterArray);


    const { canvasType } = useSelector((state: RootState) => state.canvas);
    const handleSaveAnnotation = () => {
        onSaveAnnotation();
    };
    return (
        <Card>
            <CardContent className="py-2 px-4">
                {/* {children} */}

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">


                        {canvasType === "edit" && <Button
                            variant={"ghost"}
                            onClick={handleSaveAnnotation}
                        >
                            Save Annotation
                        </Button>}





                    </div>




                    <Separator orientation="vertical" className="h-6" />
                    <Badge variant="secondary">
                        <span className="text-xs font-bold">
                            {title || "Canvas Marking"}
                        </span>
                    </Badge>

                    <AddSegLists
                        segType={selectedSegment?.segment_type || "Unknown"}
                        groupName={selectedSegment?.group_label_system || "Unknown"}
                        shortName={selectedSegment?.short_title || "Unknown"}
                    />

                </div>

                <div className="flex items-center space-x-2">





                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"

                                className='py-0 px-3 '
                                onClick={handleCancelDrawing}
                            >
                                <span className="text-xs font-bold ">Cancel Draw</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Cancel draw action</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"

                                className='py-0 px-3 '
                                onClick={handleResetZoom}
                            >
                                <span className="text-xs font-bold ">Reset </span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reset zoom to 100%</TooltipContent>
                    </Tooltip> */}



                </div>

            </CardContent>
        </Card >
    )
}

export default CommonToolBar