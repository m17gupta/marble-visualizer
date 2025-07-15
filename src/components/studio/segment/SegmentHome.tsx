import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const SegmentHome = () => {
  const { list: jobs } = useSelector((state: RootState) => state.jobs);
  console.log("SegmentHome jobs", jobs);

  const handleGetMaskSegment = async () => {};

  return (
    <>
      <h1 className=" text-lg font-bold">Segment Jobs</h1>
      <>
        {jobs[0] &&
        jobs[0] !== undefined &&
        jobs[0].segments &&
        Object.keys(jobs[0].segments).length > 0 ? (
          <>
            <h4>Available Jobs:</h4>
          </>
        ) : (
          <Button onClick={handleGetMaskSegment}>Get mask segment</Button>
        )}
      </>
    </>
  );
};

export default SegmentHome;
