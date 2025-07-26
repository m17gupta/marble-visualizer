import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  getSelectedSegment,
  getUserJobData,
} from "../../../../slice/userJobSlice/UserJobSlice";
import { DistanceRefModel } from "../../../../Model/markedDimension/MarkedDimensionModal";

type Props = {
  restartDimensionRef: () => void;
  toshowDetails?: boolean;
};

const OldDimension = ({ restartDimensionRef, toshowDetails }: Props) => {
  const getSelectedSegments = useSelector(getSelectedSegment);
  const getUserJobDatas = useSelector(getUserJobData);
  const [area, setArea] = useState<number>(0);
  const [segName, setSegName] = useState<string>("");
  const [dimensionRef, setDimensionRef] = useState<DistanceRefModel | null>(
    null
  );

  useEffect(() => {
    if (
      getSelectedSegments &&
      getSelectedSegments.length > 0 &&
      getSelectedSegments[0].details?.area
    ) {
      const segment = getSelectedSegments[0];
      if (
        segment &&
        segment.details !== undefined &&
        segment.details.area &&
        segment.segName
      ) {
        setArea(segment.details.area);
        setSegName(segment.segName);
      }
    }
  }, [getSelectedSegments]);

  useEffect(() => {
    if (getUserJobDatas?.distance_ref) {
      setDimensionRef(getUserJobDatas.distance_ref);
    } else {
      setDimensionRef(null);
    }
  }, [getUserJobDatas]);

  const handleEditDimensionRef = () => {
    restartDimensionRef();
  };

  return (
    <>
      {dimensionRef && (
        <div className="card shadow-sm border-0 mt-2 mb-2">
          <div className="card-body position-relative">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="card-title mb-1 text-primary">
                  <i className="bi bi-rulers text-info me-2"></i> Dimension
                  Reference
                </h5>
                <small className="text-muted">Scale used for this job</small>
              </div>
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip id="edit-tooltip">Edit Reference Dimension</Tooltip>
                }
              >
                <button
                  className="btn btn-light btn-sm border shadow-sm"
                  onClick={handleEditDimensionRef}
                >
                  <i className="bi bi-pencil-square text-primary"></i>
                </button>
              </OverlayTrigger>
            </div>

            {toshowDetails && (
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0 py-2">
                  <strong>Distance in Pixels:</strong>{" "}
                  <span className="text-info fw-semibold">
                    {dimensionRef.distance_pixel}
                  </span>
                </li>
                <li className="list-group-item px-0 py-2">
                  <strong>Distance in Meters:</strong>{" "}
                  <span className="text-success fw-semibold">
                    {dimensionRef.distance_meter}
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OldDimension;
