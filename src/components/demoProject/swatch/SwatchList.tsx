
import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';
import React, { useState } from 'react'
import { FaRegHeart } from 'react-icons/fa6';
type SwatchListProps = {
    swatch: MaterialModel;
    url: string | null;
    hideImage: boolean;
}
const SwatchList: React.FC<SwatchListProps> = ({
    swatch,
    url,
    hideImage
}) => {

    const [activeId, setActiveId] = useState<string | null>(null);

    const isOpen = activeId === swatch.id?.toString();

    const handlePick = () => {
        setActiveId(isOpen ? null : swatch.id?.toString() || null);
    };

      const handleFav = (e: React.MouseEvent) => {
            e.stopPropagation();
            // dispatch(favoriteSwatch(swatch.id));
        }
    return (

        <>
            <article
                onClick={handlePick}
                className={[
                    "flex cursor-pointer items-stretch gap-3 rounded-xl border bg-white p-3",
                    isOpen ? "border-emerald-500 ring-2 ring-emerald-300" : "border-zinc-200 hover:border-zinc-300"
                ].join(" ")}
            >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                    <img
                        src={url as string}
                        alt={swatch.title || `material-${swatch.id}`}
                        className="h-full w-full object-cover"
                    />
                    <button
                        onClick={handleFav}
                        className="absolute right-1 top-1 inline-flex p-1 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow"
                        aria-label="favorite"
                        type="button"
                    >
                        <FaRegHeart />

                    </button>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-zinc-500">{swatch.title}</p>
                    <h3 className="truncate text-xs font-medium">{swatch.description}</h3>
                    {/* <p className="mt-1 text-xs text-zinc-600">Size: {swatch.sizes}</p> */}
                    <div className="mt-3 flex items-center gap-2">
                        <a href="#" className="group inline-flex items-center text-xs font-medium text-emerald-700 ">
                            More product details
                            {/* <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" /> */}
                        </a>
                        {/* <Badge variant="secondary">Tile</Badge> */}
                    </div>
                </div>
            </article>
        </>
    )
}

export default SwatchList










