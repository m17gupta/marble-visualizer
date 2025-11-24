import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  AttributeId,
  MaterialCategory,
  Product,
  Variant,
} from "@/components/swatchBook/interfaces";
import {
  AdminMaterialLibService,
  APIResponseForProductSave,
  getMaterialByPaginationArgs,
} from "../services/Material/AdminMaterialLibService";
import { SelectOption } from "@/components/swatchBook/NewProductPage/ProductAdd";
import { generateSKU } from "@/components/swatchBook/helper";

interface initialStateModal {
  error: string | null;
  loading: string | null;
  materials: Product[];
  product: Product;
  selected: AttributeId[];
  variant: Variant[];
  saveLoading: boolean;
  availableAttributes: AttributeId[];
  category: SelectOption[];
  brand: SelectOption[];
  segments: SelectOption[];
  filteringData: getMaterialByPaginationArgs;
  total: null | number;
  selectedmaterial: Product | null;
}

const initialState: initialStateModal = {
  error: null,
  loading: null,
  materials: [],
  selectedmaterial: null,
  product: {
    name: "",
    product_category_id: undefined,
    brand_id: undefined,
    description: "",
    photo:
      "https://plus.unsplash.com/premium_photo-1760464278852-70a83cf27edb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    bucket_path: "default",
    new_bucket: 0,
    material_segment_id: undefined,
    gallery: [
      // "https://plus.unsplash.com/premium_photo-1760464278852-70a83cf27edb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      // "https://images.unsplash.com/photo-1759333246345-8fc65596ab5d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=696",
      // "https://images.unsplash.com/photo-1759401214196-9cfdf4bf685f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
    ],
  },
  filteringData: {
    current_page: 1,
    item_per_page: 20,
    brand_id: [],
    category_id: [],
    segment_id: [],
  },
  selected: [],
  variant: [],
  saveLoading: false,
  availableAttributes: [],
  category: [],
  brand: [],
  segments: [],
  total: null,
};

export const adminFetchMaterial = createAsyncThunk(
  "materials/adminFetchMaterial",
  async (
    {
      item_per_page = 20,
      current_page,
      segment_id,
      category_id,
      brand_id,
    }: getMaterialByPaginationArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await AdminMaterialLibService.getMaterialByPagination({
        item_per_page,
        current_page,
        segment_id,
        category_id,
        brand_id,
      });

      if (response.status != false) {
        return { data: response.data as Product[], count: response.count };
      } else {
        return {
          data: [],
          count: 0,
        };
      }
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

export const adminProductSave = createAsyncThunk(
  "materials/adminProductSave",
  async (
    {
      product,
      selected,
      variants,
    }: { product: Product; selected: AttributeId[]; variants: Variant[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await AdminMaterialLibService.handleSave({
        product,
        selected,
        variants,
      });

      if (response.status != false) {
        return response.data;
      } else {
        return null;
      }
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error)?.message || "Failed to fetch all projects"
      );
    }
  }
);

const adminMaterialLibSlice = createSlice({
  name: "adminMaterialLibSlice",
  initialState,
  reducers: {
    handleProductInSlicesChange: (state, action) => {
      const { name, value, type, results } = action.payload;

      state.product[name as keyof Product] =
        type === "number" ? Number(value) : value;

      if (name == "material_segment_id" || name == "product_category_id") {
        if (name == "material_segment_id" && results !== null) {
          const finalCategories = Array.from(
            new Map(
              results.map((d: any) => [d.category_id.id, d.category_id])
            ).values()
          );

          state.category = finalCategories.map((d: any) => {
            return {
              value: d.id,
              label: d.name,
            };
          });
        } else {
        const finalBrands = Array.from(
            new Map(
              results.map((d: any) => [d.brand_id.id, d.brand_id])
            ).values()
          );

          state.brand = finalBrands.map((d: any) => {
            return {
              value: d.id,
              label: d.name,
            };
          });
        }
      }
    },

    handleCheckUncheck: (state, action) => {
      const { idx, type } = action.payload;

      if (type == "selected") {
        state.selected[idx].is_variant_value =
          !state.selected[idx].is_variant_value;
      } else {
        state.variant[idx].checked = !state.variant[idx].checked;
      }
    },

    handleGenerateRandomSKUInSlice: (state, action) => {
      const { arr, values } = action.payload;
      state.variant.forEach((d) => {
        d.sku = generateSKU(arr);
        d.price = values.price;
        d.stock = values.stock;
      });
    },

    handleavailableattributes: (state, action) => {
      state.availableAttributes = action.payload;
    },

    variantSet: (state, action) => {
      state.variant = action.payload;
    },

    handleVariantInSliceChange: (state, action) => {
      const { index, filed, value } = action.payload;
      state.variant[index] = {
        ...state.variant[index],
        [filed]: value,
      };
    },

    handleAddAttributeInSlice: (state) => {
      state.selected = [
        ...state.selected,
        {
          name: "",
          visible: true,
          is_variant_value: false,
          selected_values: [],
          possible_values: [],
          data_type: "text",
        },
      ];
    },

    handleAttributeSelectInSlice: (state, action) => {
      const { idx, attrId } = action.payload;
      const selectedAttr = state.availableAttributes.find(
        (a) => a.id === attrId
      );
      if (selectedAttr) {
        state.selected[idx] = {
          ...selectedAttr,
          visible: true,
          is_variant_value: false,
          selected_values: selectedAttr.possible_values || [],
          possible_values: selectedAttr.possible_values || [],
        };
      }
    },
    handleRemoveAttributeInSlice: (state, action) => {
      state.selected = state.selected.filter((_, i) => i !== action.payload);
    },
    handleAddValueInSlice: (state, action) => {
      const { attrIdx, value } = action.payload;
      if (!value.trim()) return;

      const trimmedValue = value.trim();

      // Initialize selected_values if it doesn't exist
      if (!state.selected[attrIdx].selected_values) {
        state.selected[attrIdx].selected_values = [];
      }

      // Initialize possible_values if it doesn't exist
      if (!state.selected[attrIdx].possible_values) {
        state.selected[attrIdx].possible_values = [];
      }

      // Add to selected_values if not already present
      if (!state.selected[attrIdx].selected_values!.includes(trimmedValue)) {
        state.selected[attrIdx].selected_values!.push(trimmedValue);
      }

      // Add to possible_values if not already present
      if (!state.selected[attrIdx].possible_values!.includes(trimmedValue)) {
        state.selected[attrIdx].possible_values!.push(trimmedValue);
      }
    },
    handleRemoveValueInSlice: (state, action) => {
      const { attrIdx, value } = action.payload;
      state.selected[attrIdx].selected_values = state.selected[
        attrIdx
      ].selected_values?.filter((v) => v !== value);
    },

    handleAddInCategorySegmentBrand: (state, action) => {
      const { type, value } = action.payload;
      if (type == "material_segments") {
        state.segments = value;
      }
      if (type == "product_categories") {
        state.category = value;
      }
      if (type == "product_brand") {
        state.brand = value;
      }
    },

    handleImageInProduct: (state, action) => {
      const imageName = action.payload;
      state.product.photo = imageName;
      state.product.new_bucket = 1;
    },
    handleFileUploadInSlice: (state, action) => {
      const { imageUrl, index } = action.payload;
      state.variant[index].image_url = imageUrl;
    },

    handleRemoveImageFromSlice: (state, action) => {
      const index = action.payload;
      state.variant[index].image_url = "";
    },

    handleforUpdateSelectAttributes: (state, action) => {
      state.selected = action.payload;
    },

    handleRemoveImageFromProduct: (state) => {
      state.product.photo = "";
      state.product.new_bucket = 0;
    },
    handleImageDrag: (state, action) => {
      state.product.gallery = action.payload;
    },
    handleAddFilters: (state, action) => {
      const { type, values } = action.payload;
      const map = {
        category: "category_id",
        brand: "brand_id",
        segment: "material_segment_id",
      };
      const key = map[type as keyof typeof map];
      const mapped = values
        .filter((f: any) => f.type === type)
        .map((f: any) => f.id);
      state.filteringData[key as keyof getMaterialByPaginationArgs] = mapped;
    },
    handleRemoverFilters: (state, action) => {
      const { type, values } = action.payload;
      const map = {
        category: "category_id",
        brand: "brand_id",
        segment: "material_segment_id",
      };
      const key = map[type as keyof typeof map];
      const mapped = values
        .filter((f: any) => f.type === type)
        .map((f: any) => f.id);
      state.filteringData[key as keyof getMaterialByPaginationArgs] = mapped;
    },
    handleClearAll: (state) => {
      state.filteringData.brand_id = [];
      state.filteringData.category_id = [];
      state.filteringData.segment_id = [];
    },
    handlePerPageChange: (state, action) => {
      state.filteringData.item_per_page = action.payload;
    },
    handlePageChange: (state, action) => {
      let { type, value, total } = action.payload;
      let perpage = state.filteringData.item_per_page;
      let totalPages = Math.ceil(total / perpage);

      if (type == "next") {
        state.filteringData.current_page = Math.min(value + 1, totalPages);
      } else {
        state.filteringData.current_page = Math.max(value - 1, 1);
      }
    },
    handleCurrentSelectedMaterial: (state, action) => {
      const material = state.materials.find((d) => d.id == action.payload);
      if (material) {
        state.selectedmaterial = material;
      }
    },
    handleuploadInUploadImages: (state, action) => {
      state.product.gallery = [...state.product.gallery!, ...action.payload];
    },
    handleRemoveFromUploadImages: (state, action) => {
      state.product.gallery = state.product.gallery!.filter(
        (_, i) => i != action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchMaterial.pending, (state) => {
        state.loading = "main";
      })
      .addCase(adminFetchMaterial.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.materials = data as Product[];
        state.total = count!;
        state.error = null;
        state.loading = null;
      })
      .addCase(adminFetchMaterial.rejected, (state, action) => {
        state.loading = null;
        state.error = action.payload as string;
      })
      .addCase(adminProductSave.pending, (state) => {
        state.saveLoading = true;
      })
      .addCase(adminProductSave.fulfilled, (state, action) => {
        if (action.payload != null) {
          state.materials.push(action.payload as Product);
          state.selected = [];
          state.variant = [];
          state.product = {};
        }
        state.saveLoading = false;
        state.error = null;
      })
      .addCase(adminProductSave.rejected, (state, action) => {
        state.saveLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  handleProductInSlicesChange,
  handleCurrentSelectedMaterial,
  handleAddAttributeInSlice,
  handleImageInProduct,
  handleavailableattributes,
  handleAddInCategorySegmentBrand,
  handleFileUploadInSlice,
  handleRemoveImageFromSlice,
  variantSet,
  handleVariantInSliceChange,
  handleAttributeSelectInSlice,
  handleRemoveAttributeInSlice,
  handleAddValueInSlice,
  handleRemoveValueInSlice,
  handleCheckUncheck,
  handleGenerateRandomSKUInSlice,
  handleAddFilters,
  handleImageDrag,
  handleRemoverFilters,
  handleClearAll,
  handlePerPageChange,
  handlePageChange,
  handleRemoveImageFromProduct,
  handleuploadInUploadImages,
  handleRemoveFromUploadImages,
  handleforUpdateSelectAttributes,
} = adminMaterialLibSlice.actions;

export default adminMaterialLibSlice.reducer;
