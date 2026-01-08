import moment from "moment";
import React from "react";
import { weatherCodesMapping } from "../util.js";
import ArrowLeft from "../assets/images/arrow-left.svg";
import ArrowRight from "../assets/images/arrow-right.svg";
import ArrowStraight from "../assets/images/arrow-straight.svg";
import VertialLine from "../assets/images/vartical-line.svg";

const HourComp = ({ currentTime, data }) => {
  return (
    <>
      <div
        className={`hour-comp-main-div ${currentTime ? "time-highlight" : ""}`}
      >
        <p className="label-18">
          {currentTime ? "Now" : moment(data.date).format("HH:mm")}
        </p>
        <img
          src={weatherCodesMapping[data?.value?.weatherCode].img}
          width={48}
          height={48}
        />
        <p className="label-18">{Math.floor(data?.value?.temperature2m)}℃</p>
        <img
          src={
            Math.floor(data?.value?.windDirection10m) < 90 ||
            Math.floor(data?.value?.windDirection10m) > 270
              ? ArrowRight
              : Math.floor(data?.value?.windDirection10m) > 90 ||
                Math.floor(data?.value?.windDirection10m) < 270
              ? ArrowLeft
              : ArrowStraight
          }
        />
        <p className="label-18">{Math.floor(data?.value?.windSpeed)} Km/hr</p>
      </div>
      <img src={VertialLine} alt="" />
    </>
  );
};

export default HourComp;
