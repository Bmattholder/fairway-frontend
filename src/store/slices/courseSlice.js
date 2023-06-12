import { createSlice } from "@reduxjs/toolkit";

const initialCourseState = {
  courseList: [],
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialCourseState,
  reducers: {
    setCourse(state, action) {
      state.courseList = action.payload;
    },
  },
});

export const courseActions = courseSlice.actions;

export default courseSlice.reducer;
