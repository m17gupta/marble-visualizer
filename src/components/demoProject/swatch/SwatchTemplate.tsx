import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import GridSwatch from './GridSwatch';
import SwatchList from './SwatchList';
type Props = {
    swatchType: string;
}
const SwatchTemplate = ({ swatchType }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const [recommendedSwatches, setRecommendedSwatches] = useState<
        MaterialModel[]
    >([]);
    const [broken, setBroken] = useState<Record<string | number, boolean>>({});
    const { selectedDemoMasterItem } = useSelector((state: RootState) => state.demoMasterArray);
    const {
        materials,
        wallMaterials,
        doorMaterials,
        roofMaterials,
        windowMaterials,
        trimMaterials,
        floorMaterials
    } = useSelector((state: RootState) => state.materials);

    const s3DefaultBase =
        "https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials";
    const s3NewBase = "https://betadzinly.s3.us-east-2.amazonaws.com/material";


    const computeImageUrl = (swatch: MaterialModel): string | null => {
        const clean = (v?: string | null) =>
            (v ?? "")
                .toString()
                .trim()
                .replace(/^null$|^undefined$/i, "");
        const bucket = clean((swatch as any).bucket_path);
        const photo = clean((swatch as any).photo);

        if (bucket && bucket !== "default") {
            return `${s3NewBase}/${bucket}`;
        }
        if (bucket === "default" && photo) {
            return `${s3DefaultBase}/${photo}`;
        }
        return null;
    };

    const markBroken = (id: string | number) =>
        setBroken((prev) => ({ ...prev, [id]: true }));

    const clearBroken = () => setBroken({});

    //const isOpen = activeId === data.id;

    const handlePick = () => {
        //setActiveId(isOpen ? null : data.id);
    };


    useEffect(() => {
        if (
            selectedDemoMasterItem &&
            wallMaterials &&
            doorMaterials &&
            roofMaterials &&
            windowMaterials &&
            trimMaterials
        ) {
            let filtered: MaterialModel[] = [];
            switch (selectedDemoMasterItem.name) {
                case "Wall":
                    filtered = wallMaterials;
                    break;
                case "Door":
                    filtered = doorMaterials;
                    break;
                case "Roof":
                    filtered = roofMaterials;
                    break;
                case "Window":
                    filtered = windowMaterials;
                    break;
                case "Trim":
                    filtered = trimMaterials;
                    break;
                default:
                    filtered = materials || [];
            }
            setRecommendedSwatches(filtered || []);
            clearBroken();
        }
    }, [
        selectedDemoMasterItem,
        wallMaterials,
        doorMaterials,
        roofMaterials,
        windowMaterials,
        trimMaterials,
        materials,
    ]);

    const cards = useMemo(
        () =>
            (recommendedSwatches || []).map((swatch) => {
                // const url = computeImageUrl(swatch);
                const url=swatch.gallery[0]
                const isBroken = broken[swatch.id];
                const hideImage = !url || isBroken;

                return { swatch, url, hideImage };
            }),
        [recommendedSwatches, broken]
    );
    return (
        <>
            {swatchType === "grid" ? (
                <>
                    {cards.map(({ swatch, url, hideImage }) =>
                        hideImage ? null : (

                            <GridSwatch

                                swatch={swatch}
                                url={url}
                                hideImage={hideImage}
                            />
                        )
                    )}
                </>
            ) : (
               <>
               {cards.map(({ swatch, url, hideImage }) =>
                        hideImage ? null : (

                            <SwatchList

                                swatch={swatch}
                                url={url}
                                hideImage={hideImage}
                            />
                        )
                    )}
               </>
            )}
        </>
    )
}

export default SwatchTemplate