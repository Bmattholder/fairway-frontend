import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { holeActions } from "../../store/slices/holeSlice";
import "./Hole.css";

function Hole(props) {
  const dispatch = useDispatch();
  const holeList = useSelector((state) => state.holes.holeList);

  useEffect(() => {
    const getHoles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/holes");
        dispatch(holeActions.setHole(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    getHoles();
  }, [dispatch]);

  const totalPar = holeList.reduce((sum, hole) => sum + hole.par, 0);

  return (
    <div>
      <div className="hole-container">
        <div className="hole-label">
          <p className="label">Hole</p>
        </div>
        {holeList.map((hole) => (
          <div key={hole.id} className="number-container">
            <p className="number">{hole.number}</p>
          </div>
        ))}
        <div className="par-number-container">TOT</div>
      </div>
      <div className="par-container">
        <div className="par-label">
          <p className="label">Par</p>
        </div>
        {holeList.map((hole) => (
          <div key={hole.id} className="par-number-container">
            <p className="par-number">{hole.par}</p>
          </div>
        ))}
        <div className="par-number-container">{totalPar}</div>
      </div>
    </div>
  );
}

export default Hole;
