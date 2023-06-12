import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { teeActions } from "../../store/slices/teeSlice";
import "./Tee.css";

function Tee(props) {
  const dispatch = useDispatch();
  const teeList = useSelector((state) => state.tees.teeList);

  useEffect(() => {
    const getTees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tees");
        dispatch(teeActions.setTee(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    getTees();
  }, [dispatch]);

  const getUniqueTeeNames = () => {
    const uniqueTeeNames = [...new Set(teeList.map((tee) => tee.name))];
    return uniqueTeeNames;
  };

  const getYardageByTeeName = (teeName) => {
    return teeList
      .filter((tee) => tee.name === teeName)
      .map((tee) => tee.yardage);
  };

  const getTeeClass = (teeName) => {
    return `tee-name ${teeName.toLowerCase().replace(" ", "-")}`;
  };

  const getYardageClass = (teeName) => {
    return `yardage-number ${teeName.toLowerCase().replace(" ", "-")}`;
  };

  const calculateTotalYardage = (yardages) => {
    return yardages.reduce((sum, yardage) => sum + yardage, 0);
  };

  return (
    <div>
      <div className="tee-container">
        {getUniqueTeeNames().map((teeName) => {
          const yardages = getYardageByTeeName(teeName);
          const totalYardage = calculateTotalYardage(yardages);

          return (
            <div key={teeName} className="tee-row">
              <div className={getTeeClass(teeName)}>{teeName}</div>
              {yardages.map((yardage, index) => (
                <div key={index} className={getYardageClass(teeName)}>
                  {yardage}
                </div>
              ))}
              <div className={getYardageClass(teeName)}>{totalYardage}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tee;
