import { MaterialSegmentModel } from '@/models/materialSegment';
import { BrandModel } from '@/models/swatchBook/brand/BrandModel';
import { CategoryModel } from '@/models/swatchBook/category/CategoryModel';
import { StyleModel } from '@/models/swatchBook/styleModel/StyleModel';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { categoryService } from '@/services/material/categoryService/CateoryService';
import { BrandService } from '@/services/material/brandService/BrandService';
import { StyleService } from '@/services/material/styleService/StyleService';

export interface FilterSwatchSliceState {
    filterSwatch: {
        segment_types: MaterialSegmentModel | null,
        category: CategoryModel | null,
        brand: BrandModel[] | null,
        style: StyleModel[] | null,
    },
    category: CategoryModel[] | null,
    brand: BrandModel[] | null,
    style: StyleModel[] | null,
    filterSwatches: [],
    isLoading: boolean,
    isFeetching: boolean,
    isFetchingCategory: boolean,
    isFetchingBrand: boolean,
    isFetchingStyle: boolean,
    isFetchingSwatch: boolean,

}

const initialState: FilterSwatchSliceState = {
    filterSwatch: {
        segment_types: null,
        category: null,
        brand: null,
        style: null
    },
    category: null,
    brand: null,
    style: null,
    filterSwatches: [],
    isLoading: false,
    isFeetching: false,
    isFetchingCategory: false,
    isFetchingBrand: false,
    isFetchingStyle: false,
    isFetchingSwatch: false,
};


// create thunk  for fetch all categories based on catehory array name
// create thunk  for fetch all brands based on brand array name
export const fetchAllCategories = createAsyncThunk(
    'filterSwatch/fetchAllCategories',
    async (categorys: string[], { rejectWithValue }) => {
        try {
            const response = await categoryService.getCategoryByName(categorys);
          
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.error || 'Failed to fetch categories');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }
);

// create thunk  to fetch brand based on categoryId
export const fetchAllBrands = createAsyncThunk(
    'filterSwatch/fetchAllBrands',
    async (categoryId: number, { rejectWithValue }) => {
        try {
            const response = await BrandService.getBrandsByCategory(categoryId);
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.error || 'Failed to fetch brands');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }
);

export   const fetchAllStyles = createAsyncThunk(
    'filterSwatch/fetchAllStyles',
    async (brandId: number, { rejectWithValue }) => {
        try {
            const response = await StyleService.getStylesByBrand(brandId);
            if (response.success && response.data) {
                return response.data;
            } else {
                return rejectWithValue(response.error || 'Failed to fetch styles');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }
);

const filterSwatchSlice = createSlice({
    name: 'filterSwatch',
    initialState,
    reducers: {
        setFilterSwatchSegmentType: (state, action: PayloadAction<MaterialSegmentModel | null>) => {
            state.filterSwatch.segment_types = action.payload;
            state.filterSwatch.category = null; // Reset category when segment type changes
            state.filterSwatch.brand = null; // Reset brand when segment type changes
            state.filterSwatch.style = null; // Reset style when segment type changes
            state.category = null; // Reset category in the state   
            state.brand = null; // Reset brand in the state
            state.style = null; // Reset style in the state

        },
        setFilterSwatchCategory: (state, action: PayloadAction<CategoryModel | null>) => {
            state.filterSwatch.category = action.payload;
            state.filterSwatch.brand = null; // Reset brand when category changes
            state.filterSwatch.style = null; // Reset style when category changes
            state.filterSwatch.brand = null; // Reset brand in the state
            state.filterSwatch.style = null; // Reset style in the state
        },
        setFilterSwatchBrand: (state, action: PayloadAction<BrandModel>) => {
            if (!state.filterSwatch.brand) {
                state.filterSwatch.brand = [action.payload];
                // rearrange the state.brand array to show selected brands first
                if (state.brand) {
                    const selectedBrandIds = state.filterSwatch.brand.map(brand => brand.id);
                    state.brand = state.brand.sort((a, b) => {
                        const aIsSelected = selectedBrandIds.includes(a.id);
                        const bIsSelected = selectedBrandIds.includes(b.id);
                        
                        if (aIsSelected && !bIsSelected) return -1;
                        if (!aIsSelected && bIsSelected) return 1;
                        return 0;
                    });
                }
            } else {
                // check existing brand
                const existingBrand = state.filterSwatch.brand.find(brand => brand.id === action.payload.id);
                if (!existingBrand) {
                    state.filterSwatch.brand.push(action.payload);
                    // rearrange the state.brand array to show selected brands first
                    if (state.brand) {
                        const selectedBrandIds = state.filterSwatch.brand.map(brand => brand.id);
                        state.brand = state.brand.sort((a, b) => {
                            const aIsSelected = selectedBrandIds.includes(a.id);
                            const bIsSelected = selectedBrandIds.includes(b.id);
                            
                            if (aIsSelected && !bIsSelected) return -1;
                            if (!aIsSelected && bIsSelected) return 1;
                            return 0;
                        });
                    }
                } else {
                    // If it exists, remove it
                    state.filterSwatch.brand = state.filterSwatch.brand.filter(brand => brand.id !== action.payload.id);
                    if (state.filterSwatch.brand.length === 0) {
                        state.filterSwatch.brand = null; // Clear the brand array if empty
                    }
                    
                    // rearrange the state.brand array to show selected brands first
                    if (state.brand && state.filterSwatch.brand) {
                        const selectedBrandIds = state.filterSwatch.brand.map(brand => brand.id);
                        state.brand = state.brand.sort((a, b) => {
                            const aIsSelected = selectedBrandIds.includes(a.id);
                            const bIsSelected = selectedBrandIds.includes(b.id);
                            
                            if (aIsSelected && !bIsSelected) return -1;
                            if (!aIsSelected && bIsSelected) return 1;
                            return 0;
                        });
                    }
                }
            }
        },
        setFilterSwatchStyle: (state, action: PayloadAction<StyleModel>) => {
            if (!state.filterSwatch.style) {
                state.filterSwatch.style = [action.payload];

                // rearrange the state.style array to show selected styles first
                if (state.style) {
                    const selectedStyleIds = state.filterSwatch.style.map(style => style.id);
                    state.style = state.style.sort((a, b) => {
                        const aIsSelected = selectedStyleIds.includes(a.id);
                        const bIsSelected = selectedStyleIds.includes(b.id);
                        
                        if (aIsSelected && !bIsSelected) return -1;  // a comes first
                        if (!aIsSelected && bIsSelected) return 1;   // b comes first  
                        return 0;                                    // maintain order
                    });
                }
            } else {
                // check existing style
                const existingStyle = state.filterSwatch.style.find(style => style.id === action.payload.id);
                if (!existingStyle) {
                    state.filterSwatch.style.push(action.payload);
                    // rearrange the state.style array to show selected styles first
                    if (state.style) {
                        const selectedStyleIds = state.filterSwatch.style.map(style => style.id);
                        state.style = state.style.sort((a, b) => {
                            const aIsSelected = selectedStyleIds.includes(a.id);
                            const bIsSelected = selectedStyleIds.includes(b.id);
                            
                            if (aIsSelected && !bIsSelected) return -1;  // a comes first
                            if (!aIsSelected && bIsSelected) return 1;   // b comes first  
                            return 0;                                    // maintain order
                        });
                    }
                } else {
                    // If it exists, remove it
                    state.filterSwatch.style = state.filterSwatch.style.filter(style => style.id !== action.payload.id);
                    if (state.filterSwatch.style.length === 0) {
                        state.filterSwatch.style = null; // Clear the style array if empty
                    }else{
                        // rearrange the state.style array to show selected styles first
                        if (state.style && state.filterSwatch.style) {
                            const selectedStyleIds = state.filterSwatch.style.map(style => style.id);
                            state.style = state.style.sort((a, b) => {
                                const aIsSelected = selectedStyleIds.includes(a.id);
                                const bIsSelected = selectedStyleIds.includes(b.id);
                                
                                if (aIsSelected && !bIsSelected) return -1;  // a comes first
                                if (!aIsSelected && bIsSelected) return 1;   // b comes first  
                                return 0;                                    // maintain order
                            });
                        }
                    }
                }
            }
        },
        clearFilter: (state) => {
            state.filterSwatch = {
                segment_types: null,
                category: null,
                brand: null,
                style: null
            };
            state.category = null;
            state.brand = null;
            state.style = null;
            state.filterSwatches = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchAllCategories
            .addCase(fetchAllCategories.pending, (state) => {
            state.isFetchingCategory = true;
            state.isLoading = true;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isFetchingCategory = false;
                state.category = action.payload;
            })
            .addCase(fetchAllCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isFetchingCategory = false;
                // You might want to add an error field to store the error message
                console.error('Failed to fetch categories:', action.payload);
            });

        builder
            // fetchAllBrands       
            .addCase(fetchAllBrands.pending, (state) => {
                state.isFetchingBrand = true;
                state. isFetchingSwatch = true;
                state.isLoading = true;
            })
            .addCase(fetchAllBrands.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isFetchingBrand = false;
                state. isFetchingSwatch = false;
                    state.brand = action.payload;
                
            })
            .addCase(fetchAllBrands.rejected, (state, action) => {
                state.isLoading = false;
                state.isFetchingBrand = false;
                state. isFetchingSwatch = false;
                console.error('Failed to fetch brands:', action.payload);
            });

            // fetchAllStyles
        builder
            .addCase(fetchAllStyles.pending, (state) => {
                state.isFetchingStyle = true;
                state.isLoading = true;
                 state. isFetchingSwatch = true;
            })
            .addCase(fetchAllStyles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isFetchingStyle = false;
                 state. isFetchingSwatch = false;
                if(!state.style){
                    state.style = action.payload;
                }
                else{
                    state.style = [...state.style, ...action.payload];
                }
            })
            .addCase(fetchAllStyles.rejected, (state, action) => {
                state.isLoading = false;
                 state. isFetchingSwatch = false;
                state.isFetchingStyle = false;
                console.error('Failed to fetch styles:', action.payload);
            });
    },
});

export const {
    setFilterSwatchSegmentType,
    setFilterSwatchCategory,
    setFilterSwatchBrand,
    setFilterSwatchStyle,
    clearFilter
} = filterSwatchSlice.actions;

export default filterSwatchSlice.reducer;