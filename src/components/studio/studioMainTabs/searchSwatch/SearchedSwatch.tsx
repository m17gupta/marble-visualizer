import { RootState } from '@/redux/store'

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MaterialService } from '@/services/material/materialService/MaterialService';
import { MaterialModel } from '@/models';
import { TextShimmer } from '@/components/core';

import { toast } from 'sonner';
import { addPaletteImage } from '@/redux/slices/visualizerSlice/genAiSlice';


type Props={
  onCountSwatch: (count: number) => void;
}
const SearchedSwatch = ({onCountSwatch}:Props) => {

  const dispatch = useDispatch();
  const path = "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
  const newPath = "https://betadzinly.s3.us-east-2.amazonaws.com/material/";
  const [recommendedSwatches, setRecommendedSwatches] = useState<
    MaterialModel[]
  >([]);
  const isApiCategory = useRef<boolean>(true);
  const isApiBrand = useRef<boolean>(true);
  const isApiStyle = useRef<boolean>(true);

  const { filterSwatch, isFetchingSwatch, isFetchingBrand, isFetchingStyle } = useSelector((state: RootState) => state.filterSwatch);
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
        onCountSwatch(filteredMaterials.length);
        setRecommendedSwatches(filteredMaterials);
      };

      fetchRecommendedSwatches();
    }
  }, [
    filterSwatch,
    wallMaterials,
    doorMaterials,
    roofMaterials,
    windowMaterials,
    trimMaterials,
    materials,
  ]);

  //based category selection search swatch

  useEffect(() => {
    if (filterSwatch.category &&
      filterSwatch.category.id &&
      isFetchingBrand && isApiCategory.current) {
      isApiCategory.current = false;
      searchSwatchByCategoryId(filterSwatch.category.id);
    }
  }, [filterSwatch.category, recommendedSwatches, isFetchingBrand]);

  // search swatch based on category Id
  const searchSwatchByCategoryId = async (categoryId: number) => {

    const { status, data, error } = await MaterialService.getMaterialsByCategory_Id(categoryId);
    if (status && data) {
      isApiCategory.current = true;
      onCountSwatch(data.length);
      setRecommendedSwatches(data);
    } else if (error) {
      isApiCategory.current = true;
      toast.error("Error fetching swatches by category. Please try again later.");
    }
  }



  useEffect(() => {
    if (filterSwatch.category &&
      filterSwatch.category.id &&
      filterSwatch.brand &&
      filterSwatch.brand.length > 0 &&
      isFetchingStyle && isApiBrand.current) {
      isApiBrand.current = false;
      const brand_ids: number[] = [];
      const brandIds = filterSwatch.brand.map((brand) => brand.id);
      if (brandIds.length == 1) {
        brand_ids.push(brandIds[0]);
      } else {
        brand_ids.push(...brandIds);
      }


      searchSwatchByBrandId(brand_ids, filterSwatch.category.id);
    }
  }, [filterSwatch, recommendedSwatches, isFetchingStyle]);


  // search swatch based on brand Id and category Id
  const searchSwatchByBrandId = async (brandId: number[], categoryId: number) => {
    const { status, data, error } = await MaterialService.getMaterialsByCategoryAndBrand(categoryId, brandId);

    // console.log("searchSwatchByBrandId", status, data, error);
    if (status && data) {
      isApiBrand.current = true;
      if (status )
        if (data && data.length > 0) {
          onCountSwatch(data.length);
        setRecommendedSwatches(data);
      } else {
        toast.error("No swatches found for the selected brand");
      }

    } else if (error) {
      isApiBrand.current = true;
      toast.error("Error fetching swatches by brand. Please try again later.");
    }
  }


  useEffect(() => {
    if (filterSwatch &&
      filterSwatch.category &&
      filterSwatch.category.id &&
      filterSwatch.brand &&
      filterSwatch.brand.length > 0 &&
      filterSwatch.style &&
      filterSwatch.style.length > 0 &&
      isFetchingSwatch && isApiStyle.current) {
      isApiStyle.current = false;
      const brandIds = filterSwatch.brand.map((brand) => brand.id);
      const styleIds = filterSwatch.style.map((style) => style.id);
      searchSwatchByStyleId(filterSwatch.category.id, brandIds, styleIds);
    }
  }, [filterSwatch, recommendedSwatches, isFetchingSwatch]);

  const searchSwatchByStyleId = async (categoryId: number, brandId: number[], styleId: number[]) => {
    const { status, data, error } = await MaterialService.getMaterialsByCategoryBrandAndStyle(categoryId, brandId, styleId);
    // console.log("searchSwatchByStyleId", status, data, error);
    if (status ) {
      isApiStyle.current = true;
      if (data && data.length > 0) {
        onCountSwatch(data.length);
        setRecommendedSwatches(data);
      } else {
        toast.error("No swatches found for the selected style.");
      }

    } else if (error) {
      isApiStyle.current = true;
      toast.error("Error fetching swatches by style. Please try again later.");
    }
  }


  const handleSelectedSwatch = (src: MaterialModel) => {
    
    const image_path= src.bucket_path === "default"
      ? `${path}/${src.photo}`
      : `${newPath}/${src.bucket_path}`;

      dispatch(addPaletteImage(image_path))

  };
  return (
    <>
      <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[50vh] sm:max-h-[50vh]">
        {isFetchingSwatch ? (
          <TextShimmer className='font-mono text-sm' duration={1}>
            Loading Swatches...
          </TextShimmer>
        ) : (
          recommendedSwatches && recommendedSwatches.length === 0 ? (
            <div>No swatches found.</div>
          ) : (
            recommendedSwatches.map((src, idx) => (
              <button
                key={idx}
                className="aspect-square rounded-lg overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 p-0"
                title={`Swatch ${idx + 1}`}

                onClick={() => handleSelectedSwatch(src)}
              >
                <LazyLoadImage
                  src={
                    src.bucket_path === "default"
                      ? `${path}/${src.photo}`
                      : `${newPath}/${src.bucket_path}`
                  }
                  alt={`swatch-${idx + 1}`}
                  className="w-full h-full object-cover"
                 
                />
              </button>
            ))
          )
        )}
      </div>
    </>
  )
}

export default SearchedSwatch