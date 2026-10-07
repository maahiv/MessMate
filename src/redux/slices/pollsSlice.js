import { createSlice } from "@reduxjs/toolkit";
import { demoPolls } from "../../data/demoData.js";

const slice = createSlice({
  name: "polls",

  initialState: demoPolls,

  reducers: {
    setPolls: (state, action) => {
      return action.payload;
    },

    changeVote: (state, action) => {
      const poll = state.find(
        (item) => item.id === action.payload.pollId
      );

      if (!poll) return;

      const {
        previousOption,
        newOption
      } = action.payload;

      if (previousOption === newOption) return;

      // Remove old vote
      if (previousOption) {
        const oldOption = poll.options.find(
          (item) => item.name === previousOption
        );

        if (oldOption) {
          oldOption.votes = Math.max(
            0,
            oldOption.votes - 1
          );
        }
      } else {
        poll.total += 1;
      }

      // Add new vote
      const newVote = poll.options.find(
        (item) => item.name === newOption
      );

      if (newVote) {
        newVote.votes += 1;
      }
    },

    addPoll: (state, action) => {
      state.unshift(action.payload);
    }
  }
});

export const {
  setPolls,
  changeVote,
  addPoll
} = slice.actions;

export default slice.reducer;