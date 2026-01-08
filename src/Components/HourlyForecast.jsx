import React, { useState } from "react";
import CardLayout from "./UI/CardLayout";
import LeftNavGray from "../assets/images/left-nav-gray.svg";
import LeftNav from "../assets/images/left-nav.svg";
import RightNavGray from "../assets/images/right-nav-gray.svg";
import RightNav from "../assets/images/right-nav.svg";
import HourComp from "./HourComp.jsx";

const HourlyForecast = ({ hourlyData }) => {
  const [disableLeftNavigation, setDisableLeftNavigation] = useState(true);
  const [disableRightNavigation, setDisableRightNavigation] = useState(false);

  const scrollRight = () => {
    if (disableRightNavigation) {
      return;
    }
    const scrollVariable = document.querySelector(
      ".hourly-forecast-card-layout"
    );
    setDisableLeftNavigation(false);
    scrollVariable.scrollBy({ left: 720, behavior: "smooth" });
    // console.log(scrollVariable.scrollWidth);
    // console.log(scrollVariable.clientWidth);
    // console.log(scrollVariable.scrollLeft);

    if (
      Math.floor(scrollVariable.scrollLeft) + scrollVariable.clientWidth + 1 >=
      scrollVariable.scrollWidth
    ) {
      setDisableRightNavigation(true);
    }
  };

  const scrollLeft = () => {
    if (disableLeftNavigation) {
      return;
    }
    const scrollVariable = document.querySelector(
      ".hourly-forecast-card-layout"
    );
    setDisableRightNavigation(false);
    scrollVariable.scrollBy({ left: -720, behavior: "smooth" });
    // console.log(scrollVariable.scrollWidth);
    // console.log(scrollVariable.clientWidth);
    // console.log(scrollVariable.scrollLeft);

    if (scrollVariable.scrollLeft === 0) {
      setDisableLeftNavigation(true);
    }
  };

  return (
    <div className="hourly-forecast-container">
      <div className="hourly-title-container">
        <p className="forecast-title">Hourly Weather</p>
        <div className="hourly-navigation-arrow">
          <img
            src={disableLeftNavigation ? LeftNavGray : LeftNav}
            alt="arrow"
            id="right-nav-btn"
            onClick={scrollLeft}
          />
          <img
            src={disableRightNavigation ? RightNavGray : RightNav}
            alt="arrow"
            id="right-nav-btn"
            onClick={scrollRight}
          />
        </div>
      </div>

      <CardLayout className="p-0 hourly-forecast-card-layout">
        <div className="hourly-card-main-div">
          {hourlyData.map((elem, elemIndex) => {
            return (
              <HourComp
                key={elemIndex}
                currentTime={elem.isClosestTime}
                data={elem}
              />
            );
          })}
        </div>
      </CardLayout>
    </div>
  );
};

export default HourlyForecast;
