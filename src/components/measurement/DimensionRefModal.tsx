import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'

import { resetDistanceRef, updateDistanceRefMeter } from '@/redux/slices/jobSlice'
import { DistanceRefModal } from '@/models/jobModel/JobModel'
import { setCanvasType } from '@/redux/slices/canvasSlice'
import { ConvertToMeters } from '../canvasUtil/ConvertLengthInMeter'
interface AddDimensionRefModalProps {
  open: boolean;
  onClose: () => void;
  onMark: () => void;
  onSave: (data:DistanceRefModal) => void;

}
const DimensionRefModal = ({ open, onClose, onMark, onSave }: AddDimensionRefModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { distanceRef } = useSelector((state: RootState) => state.jobs);

  const [refDistance, setRefDistance] = useState<DistanceRefModal | null>(null);
  const [lengthValue, setLengthValue] = useState<number>(0);
  const [lengthUnit, setLengthUnit] = useState('ft');
  const [widthValue, setWidthValue] = useState<number>(0);
  const [widthUnit, setWidthUnit] = useState('in');



  useEffect(() => {
    if (distanceRef && distanceRef.distance_pixel) {
      setRefDistance(distanceRef);
    } else {
      setRefDistance(null);
    }
  }, [distanceRef]);

  const handleSaveDistanceRef = () => {
    const lengthInMeters = ConvertToMeters(lengthValue, lengthUnit);
    const widthInMeters = ConvertToMeters(widthValue, widthUnit);
    const totalDistanceInMeters = lengthInMeters + widthInMeters;
    dispatch(updateDistanceRefMeter(parseFloat(totalDistanceInMeters.toFixed(2)))); // Save the total distance in meters with 2 decimal places
    onSave({
       distance_pixel: distanceRef?.distance_pixel,
       distance_meter: parseFloat(totalDistanceInMeters.toFixed(2)),
    });
  };

  const handleMarkAgain = () => {
    dispatch(resetDistanceRef())
    dispatch(setCanvasType('dimension'))
    onClose();
  }


  const handleCancelMark = () => {

    dispatch(resetDistanceRef())
    setLengthValue(0);
    setLengthUnit('ft');
    setWidthValue(0);
    setWidthUnit('in');
    onClose();
  };


  return (
    <>
      <Dialog open={open} onOpenChange={handleCancelMark}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Reference Dimension</DialogTitle>
            <div className="text-sm text-muted-foreground">
              {refDistance === null && <span>
                Draw a reference line on a known dimension (like a door, window, or wall)
              </span>}
              {refDistance && refDistance.distance_pixel &&
                <span>
                  <br />
                  Enter its actual measurement to establish the project scale.
                </span>}
            </div>
          </DialogHeader>

          {/* Measurement Form */}
          {distanceRef && distanceRef.distance_pixel && <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="measurements">Enter Actual Measurements</Label>

              <div className="flex gap-2 w-full">
                {/* Length Input */}
                <div className="flex flex-1">
                  <Input
                    id="length"
                    type="number"
                    value={lengthValue}
                    onChange={(e) => setLengthValue(parseFloat(e.target.value))}
                    placeholder="6"
                    className="rounded-r-none border-r-0"
                  />
                  <Select value={lengthUnit} onValueChange={setLengthUnit}>
                    <SelectTrigger className="w-20 rounded-l-none border-l-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ft">ft</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Width Input */}
                <div className="flex flex-1">
                  <Input
                    id="width"
                    type="number"
                    value={widthValue}
                    onChange={(e) => setWidthValue(parseFloat(e.target.value))}
                    placeholder="8"
                    className="rounded-r-none border-r-0"
                  />
                  <Select value={widthUnit} onValueChange={setWidthUnit}>
                    <SelectTrigger className="w-20 rounded-l-none border-l-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            {refDistance == null && (
              <>
                <Button variant="outline" onClick={handleCancelMark}>
                  Cancel
                </Button>
                <Button onClick={onMark}>
                  Mark as Reference
                </Button>
              </>
            )}
            {refDistance && refDistance.distance_pixel && (
              <>
                <Button variant="outline" onClick={handleMarkAgain}>
                  Mark again
                </Button>
                <Button onClick={handleSaveDistanceRef}>
                  Continue
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DimensionRefModal