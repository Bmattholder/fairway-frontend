import React, { useEffect } from "react";
import Hole from "../Hole/Hole";
import Tee from "../Tee/Tee";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { courseActions } from "../../store/slices/courseSlice";
import "./Course.css";

function Course(props) {
  const dispatch = useDispatch();
  const courseList = useSelector((state) => state.courses.courseList);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/courses");
        dispatch(courseActions.setCourse(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    getCourses();
  }, [dispatch]);

  return (
    <div>
      <div className="course-container">
        {courseList.map((course) => (
          <h3 key={course.id}>{course.name}</h3>
        ))}
      </div>
      <Hole />
      <Tee />
    </div>
  );
}

export default Course;
