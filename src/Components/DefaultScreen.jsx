import React, { useEffect, useState } from "react";
import CardLayout from "./UI/CardLayout";

import Temperature from "../assets/images/temperature.svg";
import ThermoMini from "../assets/images/temperature-mini.svg";
import Water from "../assets/images/water.svg";
import Windy from "../assets/images/windy.svg";
import Eye from "../assets/images/eye.svg";
import Cloud from "../assets/images/cloud.svg";
import Search from "../assets/images/search.svg";
import { weatherCodesMapping } from "../util";
import moment from "moment";

const DefaultScreen = ({
  currentWeatherData,
  forecastLocation,
  onClickHandler,
}) => {
  // console.log(currentWeatherData);
  // [
  //   {
  //     date: "Fri Nov 07 2025 15:30:00 GMT+0530 (India Standard Time)",
  //     isClosestTime: true,
  //     value: {
  //       apparentTemperature: 22.346561431884766,
  //       humidity: 43,
  //       temperature2m: 22.83799934387207,
  //       visibility: 24140,
  //       weatherCode: 0,
  //       weatherCondition: "Clear Sky",
  //       windDirection10m: 6.379216194152832,
  //       windSpeed: 286.3896179199219,
  //     },
  //   },
  // ];

  const [searchCityText, setSearchCityText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const fetchSuggestions = async function (label) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search.php?q=${label}&format=json&addressdetails=1`
    );
    const datas = await response.json();
    const tempSuggestions = [];
    // console.log(datas);

    datas.forEach((data) => {
      tempSuggestions.push({
        label: `${data.name}, ${data?.address?.state}, ${data?.address?.country}`,
        lat: data.lat,
        lon: data.lon,
      });
    });
    setSuggestions(tempSuggestions);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSuggestions(searchCityText);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchCityText]);

  return (
    <div className="home-main-div">
      <div className="default-home-container">
        <CardLayout>
          {currentWeatherData?.length && currentWeatherData[0] && (
            <>
              {/* Place,sunnu,day and date */}
              <div className="default-card-city">
                <img
                  src={
                    weatherCodesMapping[
                      currentWeatherData[0]?.value?.weatherCode
                    ].img
                  }
                  alt="Sunny"
                />
                <div>
                  <p className="city-name">{forecastLocation?.label}</p>
                  <p className="date-today">
                    {moment().format("ddd DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              {/* Temp container */}
              <div className="temp-container">
                <img src={Temperature} alt="Thermometer image" />

                <div>
                  <p style={{ fontSize: "144px" }}>
                    {parseFloat(
                      currentWeatherData[0].value.temperature2m
                    ).toFixed(0)}
                  </p>
                  <p className="text-capitalize">
                    {currentWeatherData[0].value.weatherCondition}
                  </p>
                </div>
                <p
                  style={{
                    paddingTop: "45px",
                    fontSize: "24px",
                    alignSelf: "start",
                  }}
                >
                  ℃
                </p>
              </div>

              {/* Visibility and feels like */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "60px",
                  width: "100%",
                  columnGap: "16px",
                }}
              >
                <div className="weather-info-subtile">
                  <div className="flex">
                    <img src={Eye} alt="" />
                    <p className="weather-params-label">Visibility</p>
                  </div>
                  <p>
                    {(
                      Math.floor(currentWeatherData[0].value?.visibility) / 1000
                    ).toFixed(0)}{" "}
                    km
                  </p>
                </div>
                <p>|</p>
                <div className="weather-info-subtile">
                  <div className="flex">
                    <img src={ThermoMini} alt="" />
                    <p className="weather-params-label">Feels Like</p>
                  </div>
                  <p>
                    {" "}
                    {parseFloat(
                      currentWeatherData[0].value.apparentTemperature
                    ).toFixed(0)}{" "}
                    ℃
                  </p>
                </div>
              </div>

              {/* Humidity and wind */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "24px",
                  width: "100%",
                  columnGap: "16px",
                }}
              >
                <div className="weather-info-subtile">
                  <div className="flex">
                    <img src={Water} />
                    <p className="weather-params-label">Humidity</p>
                  </div>
                  <p>{currentWeatherData[0].value.humidity}%</p>
                </div>
                <p>|</p>
                <div className="weather-info-subtile">
                  <div className="flex">
                    <img src={Windy} alt="" />
                    <p className="weather-params-label">Wind</p>
                  </div>
                  <p>
                    {Math.floor(
                      currentWeatherData[0].value?.windDirection10m
                    ).toFixed(0)}
                    Km/h
                  </p>
                </div>
              </div>
            </>
          )}
        </CardLayout>

        {/* Search card layout */}
        <CardLayout>
          {/* Cloud image */}
          <div className="search-card">
            <div className="flex justify-center">
              <img src={Cloud} alt="" />
            </div>

            {/* Serach and input tag */}
            <div className="search-city-container city-results">
              <img src={Search} alt="" />
              <input
                type="text"
                className="city-input"
                placeholder="Search City"
                value={searchCityText}
                onChange={(e) => setSearchCityText(e.target.value)}
              />
            </div>

            <div className="search-city-suggestions">
              {suggestions?.length > 0 &&
                suggestions.map((suggestionItem, suggestionIndex) =>
                  suggestionIndex < 4 ? (
                    <p
                      className="suggestion-label"
                      key={suggestionIndex}
                      onClick={() => onClickHandler(suggestionItem)}
                    >
                      {suggestionItem.label}
                    </p>
                  ) : null
                )}
            </div>
          </div>
        </CardLayout>
      </div>
    </div>
  );
};

export default DefaultScreen;
