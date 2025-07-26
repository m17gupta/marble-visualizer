import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUpdateGroup,
  getIsUpdateGroup,
} from "../slice/canvas/updatevalue/UpdateValueSlice";
import { AppDispatch } from "../store/Store";
import { addHoverGroup, addNoHoverGroup, getMasterArray, resetHoverGrp, resetNoHoverGroup, startSegHoverEffect, stopSegHoverEffect } from "../slice/canvas/masterArray/MasterArraySlice";
import {
  addEachSegment,
  getGroupName,
} from "../slice/toolActive/ToolActiveSlice";
import { addApiMessage } from "../slice/messageToast/ToastSlice";
import { JobSegmentationModel, MasterArrayModel } from "../Model/masterArray/MasterArrayModel";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import {
  getSelectedSegment,
  getUserJobData,
} from "../slice/userJobSlice/UserJobSlice";
import StartMarkingDimension from "../module/ImageView/LeftSections/markingDimension/StartMarkingDimension";
import OldDimension from "../module/ImageView/LeftSections/markingDimension/OldDimension";
import { DistanceRefModel } from "../Model/markedDimension/MarkedDimensionModal";

// import {
//   changeSegmentTab,
//   switchToOutline,
// } from "../slice/tabControl/TabControlSlice";
// import {
//   addSegmentTypeAllSearchSwatch,
//   addTypeOfSearch,
//   resetFilter,
//   updateIsFilter,
// } from "../slice/materialSlice/SearchMaterial";
// import { resetSearchBrandName } from "../slice/materialSlice/MaterialBrandSlice";
// import { resetSearchStyleName } from "../slice/materialSlice/MaterialStyleSlice";
import { SideModel } from "./SideModelForMeasurement";
import { PdfDetails, Swatch } from "../Model/Job/SamModel";
import { Link } from "react-router-dom";
import { UpdateUserJob } from "../api/jobs/JobApi";

type AppliedDataType = {
  segment_name: string;
  swatches: Swatch;
};

const formatArea = (area: number, unit: string): string => {
  if (unit === "ft") {
    const feet = Math.floor(area);
    const inch = Math.round((area - feet) * 12);
    return `${feet} sq. ft ${inch} in`;
  }
  return `${area.toFixed(2)} sq. ${unit}`;
};

export const MeasurementTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const getMasterArrays = useSelector(getMasterArray);
  const getIsUpdateGroups = useSelector(getIsUpdateGroup);
  const [isDimensionStarted, setIsDimensionStarted] = useState(false);
  const [showStyle, setShowStyle] = useState<boolean>(false);
  const [allSegMaster, setAllSegMaster] = useState<MasterArrayModel[]>([]);
  const [activeTab, setActiveTab] = useState<MasterArrayModel | null>(null);
  const getGroupNames = useSelector(getGroupName);
  const [style, setStyle] = useState<string[]>([]);
  // Track which accordion items are open
  const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set());
  const getSelectedSegments = useSelector(getSelectedSegment);
  const [dimensionRef, setDimensionRef] = useState<DistanceRefModel | null>(
    null
  );

  const [isEditing, setIsEditing] = useState("");

  const [segmentname, setSegmentName] = useState<string>("");
  const [groupname, setGroupName] = useState("");

  // const [complete, setCompleteList] = useState<any>({});
  const [complete, setCompleteList] = useState<PdfDetails[]>([]);

  const handleSegment_name = (name: string) => {
    setSegmentName(name);
    setShowStyle(true);
  };

  const handleSideModalClose = (name: string) => {
    setSegmentName("");
    setShowStyle(false);
  };

  // const handlingSementAdd = (data: string) => {
  //   if (data) {
  //     newdata.item_name = data.item_name;
  //     setAppliedData(newdata);
  //   } else {
  //     const compl = JSON.parse(JSON.stringify(complete))
  //     compl.swatches.push(newdata.item_name)
  //     setCompleteList(compl);
  //     setAppliedData({ item_name: "" });
  //   }
  //   setShowStyle((prev) => !prev);
  // };

  const handlingSementAdd = (data: Swatch) => {
    const copieddata = [...complete];
    const compl: PdfDetails = {
      segment_name: "",
      project_summary: "",
      swatches: {},
      total_cost: 0,
    };
    const matchedSegment =
      activeTab?.segmentation !== undefined &&
      activeTab.segmentation.find(
        (group) => Object.keys(group)[0] === segmentname
      );

    if (!matchedSegment) return;
    const groupData = matchedSegment[segmentname];
    const area = groupData.reduce(
      (acc: any, item: any) => acc + item.details.area || 0,
      0
    );

    const cost_swatch = 1500;
    compl.swatches = data;
    compl.total_cost = cost_swatch * area;
    compl.project_summary =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quaerat illo rem unde sapiente natus, totam ad animi iure molestias, corrupti, harum doloremque?";
    compl.segment_name = segmentname;
    copieddata.push(compl);
    setCompleteList(copieddata);
  };

  const handleStyleDelete = (keyName: string, idx: number) => {
    const compl = [...complete].filter((d) => d.segment_name == keyName);
    const deletedresultfromcompl = compl.filter((d, id) => {
      return id !== idx;
    });
    const final = [...complete].filter((d) => d.segment_name != keyName);
    setCompleteList([...final, ...deletedresultfromcompl]);
  };

  // Handle accordion toggle
  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getUserJobDatas = useSelector(getUserJobData);
  useEffect(() => {
    if (getUserJobDatas?.distance_ref) {
      setDimensionRef(getUserJobDatas.distance_ref);
    } else {
      setDimensionRef(null);
    }
  }, [getUserJobDatas, isDimensionStarted]);

  useEffect(() => {
    if (
      getSelectedSegments &&
      getSelectedSegments.length > 0 &&
      getSelectedSegments[0].details &&
      getSelectedSegments[0].details.area !== undefined &&
      getSelectedSegments[0].details.area !== null
    ) {
      setIsDimensionStarted(true);
    } else {
      setIsDimensionStarted(false);
    }
  }, [getSelectedSegments]);

  useEffect(() => {
    if (getMasterArrays?.allSeg && getMasterArrays.allSeg.length > 0) {
      setAllSegMaster(getMasterArrays.allSeg);
      setActiveTab(getMasterArrays.allSeg[0]);
    } else {
      setAllSegMaster([]);
    }
  }, [getMasterArrays]);

  // Reset accordion state when activeTab changes
  useEffect(() => {
    setOpenAccordions(new Set());
  }, [activeTab]);

  useEffect(() => {
    if (getIsUpdateGroups) {
      dispatch(addUpdateGroup(false));
      if (activeTab) {
        dispatch(addEachSegment(activeTab));
        dispatch(addApiMessage("Segments updated."));
      }
    }
  }, [getIsUpdateGroups, activeTab, dispatch]);

  const [unit, setUnit] = useState<{ value: number; standard: string }>({
    value: 1,
    standard: "m",
  });

  const handleChangeUnit = (value: string) => {
    const newUnitset = { ...unit };
    if (value == "m") {
      newUnitset.standard = value;
      newUnitset.value = 1;
      setUnit(newUnitset);
    } else if (value == "ft") {
      newUnitset.standard = value;
      newUnitset.value = 3.28;
      setUnit(newUnitset);
    }
  };

  const handleUpdateGroupName = async (obj: {
    _id: string;
    groupname: string;
  }) => {
    // console.log(obj)
    setIsEditing("");
  };

  // hover over the group
  const handleHoverGroup = (groupName: string, color: string) => {
    dispatch(resetNoHoverGroup());
    dispatch(
      addHoverGroup({
        groupName: groupName,
        color: color,
      })
    );
  };

  const handleRemoveHover = (groupName: string) => {
    // console.log("handleRemoveHover", groupName)
    dispatch(resetHoverGrp());
    dispatch(addNoHoverGroup(groupName));
    // dispatch(resetHoverGrp())
  };

  // on Hover segment
  const handleHoverSegment = (data: JobSegmentationModel[]) => {

    if (data) {

      dispatch(startSegHoverEffect({
        seg: data
      }))


    }

  }
  const handleOffHoverSegment = () => {

    dispatch(stopSegHoverEffect())
  }

   const handLeMouseHover = (data: JobSegmentationModel) => {
 
     dispatch(startSegHoverEffect({
       seg: [data]
 
     }))
   }
  
    const handleMouseOut = () => {
      dispatch(stopSegHoverEffect())
    }
  
  return (
    <div className="tab-pane active" id="measurement">
      {showStyle && (
        <SideModel
          activeTab={activeTab}
          handlingSementAdd={handlingSementAdd}
          handleSideModalClose={handleSideModalClose}
        />
      )}
      <div className="p-3 border-end bg-light" style={{ height: "100vh" }}>
        {/* For Measruement Tab */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h5 className="text-primary fw-bold mb-0">Measurement Tab</h5>

          <div className="d-flex align-items-center gap-2">
            <label htmlFor="unitSelect" className="form-label mb-0">
              Unit:
            </label>
            <select
              id="unitSelect"
              value={unit.standard}
              className="form-select form-select-sm w-auto"
              onChange={(e) => {
                handleChangeUnit(e.target.value);
              }}
              defaultValue={"m"}
            >
              <option value="m">sq. m</option>
              <option value="ft">sq. ft</option>
            </select>
          </div>
        </div>

        {!dimensionRef ? (
          <div
            className="border rounded-4 p-4 shadow-sm bg-white dimention-box"
            style={{ maxWidth: "360px" }}
          >
            <StartMarkingDimension />
          </div>
        ) : (
          <>
            <OldDimension
              restartDimensionRef={() => {
                setDimensionRef(null);
                setIsDimensionStarted(false);
              }}
              toshowDetails={false}
            />
            <div>
              <h6 className="text-muted mb-2">Segments</h6>

              <>
                <div
                  style={{
                    overflowX: "auto",
                  }}
                  className="scroll-thin-horizontal d-flex border-bottom mb-3 gap-2"
                >
                  {allSegMaster.map((tab) => (
                    <div
                      key={tab.name}
                      onMouseEnter={() =>
                        handleHoverGroup(tab.name ?? "", tab.color_code ?? "")
                      }
                      onMouseLeave={() => handleRemoveHover(tab.name ?? "")}
                      onClick={() => setActiveTab(tab)}
                      className={`p-2 cursor-pointer ${activeTab?.name === tab.name
                        ? "fw-bold text-primary border-bottom border-3 border-primary"
                        : "text-dark"
                        }`}
                      style={{ cursor: "pointer" }}
                    >
                      {tab.name}
                    </div>
                  ))}
                </div>

                {activeTab && (
                  <div
                    id="groupList"
                    className="accordion"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {activeTab.segmentation?.map((group: any, i: number) => {
                      const keyName = Object.keys(group)[0];
                      const values = group[keyName];
                      const groupName = values?.length
                        ? [
                          ...new Set<string>(
                            values.map((item: any) => item.details.group)
                          ),
                        ][0]
                        : keyName;
                      const collapseId = `groupCollapse${i}`;
                      const headingId = `groupHeading${i}`;
                      const isOpen = openAccordions.has(i);
                      const area = values
                        .reduce(
                          (acc: any, item: any) => acc + item.details.area || 0,
                          0
                        )
                        .toFixed(2);

                      return (
                        <div key={keyName} className="accordion-item">
                          <h2 className="accordion-header" id={headingId}>
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center"
                                onMouseEnter={() => handleHoverSegment(values)}
                                onMouseLeave={handleOffHoverSegment}
                              >
                                <input
                                  disabled={!(isEditing === groupName)}
                                  type="text"
                                  className="ms-2 form-control form-control-sm border-0 bg-transparent"
                                  defaultValue={groupName}
                                  style={{
                                    maxWidth: "100%",
                                  }}

                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setGroupName(e.target.value);
                                  }}
                                />
                                {isEditing === groupName ? (
                                  <i
                                    onClick={() => {
                                      handleUpdateGroupName({
                                        _id: activeTab?.job_id ?? "",
                                        groupname: groupname,
                                      });
                                    }}
                                    style={{ cursor: "pointer" }}
                                    className="ms-2 bi bi-check2 text-success fs-6"
                                  ></i>
                                ) : (
                                  <i
                                    onClick={() => {
                                      setIsEditing(groupName);
                                    }}
                                    className="bi ms-2 bi-pencil-square text-primary fs-6"
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                )}
                              </div>
                              <button
                                className={`accordion-button bg-transparent border-0 shadow-none ${!isOpen ? "collapsed" : ""
                                  }`}
                                type="button"
                                onClick={() => toggleAccordion(i)}
                                aria-expanded={isOpen}
                                aria-controls={collapseId}
                                style={{ outline: "none", boxShadow: "none" }}
                              >
                                {/* Button Content Here */}
                              </button>
                            </div>
                          </h2>
                          <div
                            id={collapseId}
                            className={`accordion-collapse collapse ${isOpen ? "show" : ""
                              }`}
                            aria-labelledby={headingId}
                          >
                            <div className="accordion-body">
                              <ul className="list-group list-group-flush">
                                <AreaListItem
                                  style={complete}
                                  area={formatArea(
                                    area * unit.value,
                                    unit.standard
                                  )}
                                  keyName={keyName}
                                  handleSegment_name={handleSegment_name}
                                  // handleSegmentDelete={handleSegmentDelete}
                                  handleStyleDelete={handleStyleDelete}
                                />
                                <li className="list-group-item px-1 py-1 d-flex gap-3 justify-content-between">
                                  <b>
                                    <div>Segment</div>
                                  </b>
                                  <b>
                                    {" "}
                                    <div>Area in {unit.standard}</div>
                                  </b>
                                </li>
                                {values.map((seg: any, idx: number) => (
                                  <li
                                    key={idx}
                                    className="list-group-item px-1 py-1 d-flex gap-3 justify-content-between"
                                  >
                                    <div

                                      onMouseEnter={() => handLeMouseHover(seg)}
                                      onMouseLeave={handleMouseOut}
                                    >{seg.details.seg_short}</div>
                                    <div>
                                      {seg.details?.area !== undefined
                                        ? formatArea(
                                          seg.details.area * unit.value,
                                          unit.standard
                                        )
                                        : "Calculate the area"}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            </div>
          </>
        )}

        <div className="d-flex align-items-center justify-content-center mt-2">
          <Link to={`/pdf/${encodeURIComponent(JSON.stringify(complete))}`}>
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              // onClick={handleSavePDF}
            >
              <i className="bi bi-file-earmark-pdf-fill"></i>
              Save PDF
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AreaListItem = ({
  style,
  area,
  keyName,
  handleSegment_name,
  handleStyleDelete,
}: any) => {
  const s3path = process.env.REACT_APP_S3BucketMaterial;
  const newS3Path = process.env.REACT_APP_S3Bucket;
  const path = `${s3path}/liv/materials`;
  const newPath = `${newS3Path}/material`;
  // ✅ Fix: Proper filter
  const filteredStyles =
    style?.filter((d: any) => d.segment_name === keyName) || [];

  return (
    <li className="list-group-item px-2 py-2 d-flex justify-content-between align-items-center">
      {/* Area Value */}
      <span className="text-dark fw-medium">
        {area === 0 ? "Need To Calculate Again" : `${area}`}
      </span>

      {/* Delete or Apply Control */}
      <div className="position-relative d-inline-block">
        {filteredStyles.length > 0 ? (
          <div
            className="d-flex flex-wrap gap-1 align-items-start"
            style={{
              maxWidth: "120px",
              cursor: "pointer",
            }}
          >
            {filteredStyles.map((item: any, idx: number) => (
              <div
                key={idx}
                className="position-relative"
                style={{ width: "50px", height: "50px" }}
              >
                <img
                  src={
                    item.swatches.bucket_path === "default"
                      ? `${path}/${item?.swatches.photo}`
                      : `${newPath}/${item?.swatches.bucket_path}`
                  }
                  className="border rounded shadow-sm w-100 h-100"
                  style={{ objectFit: "cover" }}
                  alt="swatch"
                />
                <button
                  onClick={() => handleStyleDelete(keyName, idx)}
                  className="position-absolute top-0 end-0 translate-middle p-0 border-0 bg-transparent"
                  style={{ width: "16px", height: "16px" }}
                >
                  <i
                    className="bi bi-x-circle-fill text-danger"
                    style={{ fontSize: "0.75rem" }}
                  ></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={() => handleSegment_name(keyName)}
            className="btn btn-sm btn-success  border border-success mt-2"
          >
            Select Style
          </button>
        )}
      </div>
    </li>
  );
};
