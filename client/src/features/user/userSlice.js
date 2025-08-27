import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  value: null,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
  const { data } = await api.get("/api/user/data", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.success ? data.user : null
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export default userSlice.reducer;
