import React from 'react'
import { AppDispatch, RootState } from '@/redux/store';

import { useDispatch, useSelector } from 'react-redux';
import { TextShimmer } from '@/components/core';
import { setFilterSwatchStyle } from '@/redux/slices/swatch/FilterSwatchSlice';
import { StyleModel } from '@/models/swatchBook/styleModel/StyleModel';
const CollapsibleRow: React.FC<{
    title: string;
    count?: number;
    children?: React.ReactNode;
}> = ({ title, count = 0, children }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="border-b last:border-b-0">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between py-3"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <span>{title}</span>
                    <span className="inline-flex items-center justify-center text-white text-[10px] bg-violet-600 rounded-full w-5 h-5">
                        {count}
                    </span>
                </div>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                >
                    <path d="M6 9l6 6 6-6" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            {open && <div className="pb-3">{children}</div>}
        </div>
    );
};

const Chip: React.FC<{ children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>> = ({ children, className = "", ...rest }) => (
    <span
        className={`inline-flex items-center px-3 py-1 rounded-full border text-sm leading-none ${className}`}
        {...rest}
    >
        {children}
    </span>
);
const SearchStyle = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [selectedStyles, setSelectedStyles] = React.useState<number[]>([]);
    const { style, isFetchingStyle } = useSelector((state: RootState) => state.filterSwatch);
 const {filterSwatch} = useSelector((state: RootState) => state.filterSwatch);

    const handleStyleSelection = (style: StyleModel) => {
        dispatch(setFilterSwatchStyle(style));
        setSelectedStyles(prev =>
            prev.includes(style.id)
                ? prev.filter(id => id !== style.id)
                : [...prev, style.id]
        );
    };

    //update selected styye
    React.useEffect(() => {
        if (filterSwatch && filterSwatch.style && filterSwatch.style.length > 0) {
            setSelectedStyles(filterSwatch.style.map(s => s.id));
        } else {
            setSelectedStyles([]);
        }
    }, [filterSwatch]);

  return (
    <>
    <CollapsibleRow title="Style" count={selectedStyles.length || 0}>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {isFetchingStyle ? (
                            <TextShimmer className='font-mono text-sm' duration={1}>
                                Loading styles...
                            </TextShimmer>
                        ) : style && style.length > 0 ? (
                            style.map((s) => (
                                <Chip
                                    key={s.id}
                                    className={`cursor-pointer transition-colors ${selectedStyles.includes(s.id)
                                        ? "border-blue-600 bg-blue-100 text-blue-800"
                                        : "border-blue-400 text-blue-700 hover:bg-blue-50"
                                        }`}
                                    onClick={() => handleStyleSelection(s)}
                                >
                                    {s.title}
                                </Chip>
                            ))
                        ) : (
                            <div className="text-xs text-gray-500">No styles available</div>
                        )}
                    </div>
                </CollapsibleRow>
    </>
  )
}

export default SearchStyle