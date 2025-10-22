import { DemoMasterModel } from '@/models/demoModel/DemoMaterArrayModel';
import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';
import { AppDispatch, RootState } from '@/redux/store';
import { computeImageUrl } from '@/utils/GetPalletUrl';

import { Layers } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

interface swatchListModel {
    [key: string]: string
}
const SelectedSwatchList = () => {
 
    const dispatch = useDispatch<AppDispatch>();
    const [allPalleteUrl, setAllPalleteUrl] = React.useState<swatchListModel>({});
    const { demoMasterArray } = useSelector((state: RootState) => state.demoMasterArray);

    useEffect(() => {
        if (demoMasterArray && demoMasterArray.length > 0) {
            const palleteUrls: swatchListModel = {};
            demoMasterArray.forEach((item: DemoMasterModel) => {
                const allPallate = item.overAllSwatch || [];
                allPallate.map((swatch: MaterialModel) => {
                    const url = computeImageUrl(swatch);
                    if (url) {
                        palleteUrls[swatch.id ?? ""] = url;
                    }
                });

            });
            setAllPalleteUrl(palleteUrls);
        }
    }, [demoMasterArray]);
  



    return (
        <>

            {allPalleteUrl &&
                Object.keys(allPalleteUrl).length > 0 &&
                    (<div className="flex w-auto items-center gap-2 rounded-xl border-none bg-white px-3 text-left shadow-sm transition cursor-pointer">
                        <div className=" hidden md:block">
                            <div className="flex">
                                {allPalleteUrl &&
                                    Object.keys(allPalleteUrl).length > 0
                                    && Object.keys(allPalleteUrl).map((key, index) => (
                                        <div className={`-ml-3 relative z-${10 * index} h-10 w-10 overflow-hidden rounded-md border bg-white shadow-sm`}
                                            key={key}>
                                            <img
                                                src={allPalleteUrl[key]}
                                                alt={`swatch-${key}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}

                      



                            </div>
                        </div>

                        <span className="relative inline-block block md:hidden">
                            {/* icon */}
                            <Layers className="h-7 w-7 text-zinc-500" />{/* or <LuLayers size={28} /> */}

                            {/* count badge */}
                            <span
                                aria-label="selected items"
                                className="
                     absolute -top-1 -right-1
                     flex h-5 min-w-[20px] items-center justify-center
                     rounded-full bg-emerald-800 px-1.5
                     text-[11px] font-bold leading-none text-white
                     ring-2 ring-white shadow
                   "
                            >
                                2
                            </span>
                        </span>

                        <div className="rounded-lg p-2 hover:bg-gray-100">
                            <div className="truncate text-xs text-muted-foreground">
                                Demo Company
                            </div>
                            <div className="truncate text-sm font-medium">Red Oak – Natural</div>
                        </div>
                    </div>)}
        </>
    );
}

export default SelectedSwatchList


