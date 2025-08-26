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
    onCancel: () => void;
}
const CommonToolBar = ({ title, onSaveAnnotation, onCancel }: CommonToolBarProps) => {
    const { selectedSegment } = useSelector((state: RootState) => state.masterArray);


    const { canvasType } = useSelector((state: RootState) => state.canvas);
    const handleSaveAnnotation = () => {
        onSaveAnnotation();
    };

    const handleCancelAnnotation = () => {
        onCancel();
    };
    return (
        <Card>
            <CardContent className="py-2 px-4">
                {/* {children} */}

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">


                        {canvasType === "edit" && (
                            <Button
                                variant={"ghost"}
                                onClick={handleSaveAnnotation}
                            >
                                Save Annotation
                            </Button>
                        )}
                        {canvasType === "edit" && (
                            <Button
                                variant={"ghost"}
                                onClick={handleCancelAnnotation}
                            >
                                cancel Annotation
                            </Button>
                        )}





                    </div>




                    <Separator orientation="vertical" className="h-6" />
                    <Badge variant="secondary">
                        <span className="text-xs font-bold">
                            {title || "Canvas Marking"}
                        </span>
                    </Badge>

                 { canvasType==="reannotation" && <AddSegLists
                        segType={selectedSegment?.segment_type || "Unknown"}
                        groupName={selectedSegment?.group_label_system || "Unknown"}
                        shortName={selectedSegment?.short_title || "Unknown"}
                    />}

                </div>

                <div className="flex items-center space-x-2">





                </div>

            </CardContent>
        </Card >
    )
}

export default CommonToolBar