import { createSlice } from "@reduxjs/toolkit";
import { demoComplaints } from "../../data/demoData.js";

const slice = createSlice({
  name: "complaints",

  initialState: demoComplaints,

  reducers: {
    setComplaints: (state, action) => {
      return action.payload;
    },

    addComplaint: (state, action) => {
      state.unshift(action.payload);
    },

    updateStatus: (state, action) => {
      const item = state.find(
        (complaint) => complaint.id === action.payload.id
      );

      if (item) {
        item.status = action.payload.status;
      }
    }
  }
});

export const {
  setComplaints,
  addComplaint,
  updateStatus
} = slice.actions;

export default slice.reducer;