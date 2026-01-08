import React from "react";
import CardLayout from "./Components/UI/CardLayout";
import DayForcast from "./Components/UI/DayForcast";
import moment from "moment";
import { weatherCodesMapping } from "./util";

const SevenDayFocast = ({ dailyForcast }) => {
  return (
    <CardLayout className="seven-day-forecast-card-layout">
      <p className="label-18 ">7 Day FORECAST</p>
      {Object.keys(dailyForcast)?.length > 0 &&
        Object.keys(dailyForcast).map((day, dayIndex) => {
          return (
            <DayForcastCard
              key={dayIndex}
              dayData={dailyForcast[day]}
              day={day}
              lastDay={dayIndex === 6 ? true : false}
            />
          );
        })}
    </CardLayout>
  );
};

const DayForcastCard = ({ dayData, day, lastDay }) => {
  return (
    <div
      className={`flex items-center single-day justify-between"
            ${lastDay ? "border-0" : ""} `}
    >
      <p style={{ width: "27%" }}>{moment(day).format("dddd")}</p>
      <img
        src={weatherCodesMapping[dayData.weatherCode].img}
        alt=""
        width={48}
        height={48}
      />
      <div
        style={{ width: "62%", marginLeft: "12px" }}
        className="flex items-center justify-between"
      >
        <p className="capitalize">{dayData.weatherCondition}</p>
        <p>
          {Math.floor(dayData.temperature2mMin)}℃ -{" "}
          {Math.floor(dayData.temperature2mMax)}℃
        </p>
      </div>
    </div>
  );
};

export default SevenDayFocast;
