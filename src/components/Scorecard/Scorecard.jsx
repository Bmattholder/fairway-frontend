import React from "react";
import Player from "../Player/Player";
import Course from "../Course/Course";
import "./Scorecard.css";

function Scorecard(props) {
  return (
    <div className="scorecard">
      <Course />
      <Player />
    </div>
  );
}

export default Scorecard;
