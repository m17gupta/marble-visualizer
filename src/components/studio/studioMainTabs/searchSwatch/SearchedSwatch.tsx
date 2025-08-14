import { AppDispatch, RootState } from '@/redux/store'
import { MaterialModel } from '@/services/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SearchedSwatch = () => {
      const path = "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
  const newPath = "https://betadzinly.s3.us-east-2.amazonaws.com/material/";
    const dispatch = useDispatch<AppDispatch>();
      const [recommendedSwatches, setRecommendedSwatches] = useState<
        MaterialModel[]
      >([]);

    const { filterSwatch } = useSelector((state: RootState) => state.filterSwatch);
  const {
    materials,
    wallMaterials,
    doorMaterials,
    roofMaterials,
    windowMaterials,
    trimMaterials,
  } = useSelector((state: RootState) => state.materials);

      // update the selected Swatch recommentation
      useEffect(() => {
        if (
          filterSwatch &&
          filterSwatch.segment_types &&
          wallMaterials &&
          wallMaterials.length > 0 &&
          doorMaterials &&
          doorMaterials.length > 0 &&
          roofMaterials &&
          roofMaterials.length > 0 &&
          windowMaterials &&
          windowMaterials.length > 0 &&
          trimMaterials &&
          trimMaterials.length > 0
        ) {
          // Fetch recommended swatches based on the selected segment type
          const fetchRecommendedSwatches = async () => {
            // Here you would typically call an API to get the recommended swatches
            // For now, we will just filter the materials based on the selected segment type
            let filteredMaterials: MaterialModel[] = [];
            const title = filterSwatch.segment_types?.name;
            switch (title) {
              case "Wall":
                filteredMaterials = wallMaterials;
    
                break;
              case "Door":
                filteredMaterials = doorMaterials;
                break;
              case "Roof":
                filteredMaterials = roofMaterials;
                break;
              case "Window":
                filteredMaterials = windowMaterials;
                break;
              case "Trim":
                filteredMaterials = trimMaterials;
                break;
              default:
                filteredMaterials = materials; // Fallback to all materials
            }
            setRecommendedSwatches(filteredMaterials);
          };
    
          fetchRecommendedSwatches();
        }
      }, [
        filterSwatch.segment_types,
        wallMaterials,
        doorMaterials,
        roofMaterials,
        windowMaterials,
        trimMaterials,
        materials,
      ]);

      console.log("recommendedSwatches", recommendedSwatches);
      console.log("filterSwatch", filterSwatch.segment_types?.name);
  return (
    <>

      <div className="grid grid-cols-3 gap-3">
            {recommendedSwatches.map((src, idx) => (
              <button
                key={idx}
                className="aspect-square rounded-lg overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                title={`Swatch ${idx + 1}`}
              >

                <img  
                  src={
                        src.bucket_path === "default"
                          ? `${path}/${src.photo}`
                          : `${newPath}/${src.bucket_path}`
                      }
                 alt={`swatch-${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
    </>
  )
}

export default SearchedSwatch