import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch projects

const initialState = {};

const materialsSlice = createSlice({
  name: "adminBrandSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = materialsSlice.actions;

export default materialsSlice.reducer;
