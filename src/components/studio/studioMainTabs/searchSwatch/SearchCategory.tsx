import { TextShimmer } from '@/components/core'
import { CategoryModel } from '@/models/swatchBook/category/CategoryModel';
import { fetchAllBrands, setFilterSwatchCategory } from '@/redux/slices/swatch/FilterSwatchSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
const Chip: React.FC<{ children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>> = ({ children, className = "", ...rest }) => (
    <span
        className={`inline-flex items-center px-3 py-1 rounded-full border text-sm leading-none ${className}`}
        {...rest}
    >
        {children}
    </span>
);
const SearchCategory = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedCategory, setSelectedCategory] = React.useState<CategoryModel | null>(null);

    const {filterSwatch} = useSelector((state: RootState) => state.filterSwatch);

    const { category, isFetchingCategory } = useSelector((state: RootState) => state.filterSwatch);

    const handleCategoryForBrandSearch = async (category: CategoryModel) => {
       
        dispatch(setFilterSwatchCategory(category));

        await dispatch(fetchAllBrands(category.id));

    };

    // update the selected category when filterSwatchCategory changes
    React.useEffect(() => {
        if (filterSwatch && filterSwatch.category && filterSwatch.category.id) {
            setSelectedCategory(filterSwatch.category);
        }else{
            setSelectedCategory(null);
        }
    }, [filterSwatch]);
    return (
        <>
            <div className="flex flex-wrap gap-2">
                {isFetchingCategory ? (
                    <TextShimmer className='font-mono text-sm' duration={1}>
                        Loading categories...
                    </TextShimmer>
                ) : category && category.length > 0 ? (
                    category.map((cat) => (
                        <Chip
                            key={cat.id}
                            className={`cursor-pointer transition-colors rounded-md border-black-100 bg-gray-50 ${selectedCategory?.id === cat.id
                                    ? "border-green-600 bg-green-100 text-green-800"
                                    : "border-green-400 text-green-700 hover:bg-green-50"
                                }`}
                            onClick={() => handleCategoryForBrandSearch(cat)}
                        >
                            {cat.title}
                        </Chip>
                    ))
                ) : (
                    <div className="text-sm text-gray-500">
                        No categories available
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchCategory