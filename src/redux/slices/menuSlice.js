import { createSlice } from "@reduxjs/toolkit";
import { demoMenu } from "../../data/demoData.js";

const slice = createSlice({
  name: "menu",

  initialState: demoMenu,

  reducers: {
    setMenu: (state, action) => {
      return action.payload;
    },

    updateMeal: (state, action) => {
      const day = state.find(
        (item) => item.day === action.payload.day
      );

      if (!day) return;

      day[action.payload.meal] = action.payload.value;

      day.options[action.payload.meal] =
        action.payload.options;
    }
  }
});

export const {
  setMenu,
  updateMeal
} = slice.actions;

export default slice.reducer;