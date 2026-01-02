import React from "react";
import CardLayout from "./UI/CardLayout";
import { weatherCodesMapping } from "../util";
import Location from "../assets/images/location.svg";
import Temperature from "../assets/images/temperature.svg";
import ThermoMini from "../assets/images/temperature-mini.svg";
import Water from "../assets/images/water.svg";
import Windy from "../assets/images/windy.svg";
import Eye from "../assets/images/eye.svg";
import Cloud from "../assets/images/cloud.svg";
import Search from "../assets/images/search.svg";
import moment from "moment";
import DayForcast from "./UI/DayForcast.jsx";
import HourlyForecast from "./HourlyForecast.jsx";
import UnitMatrixComponent from "../UnitMatrixComponent.jsx";
import SevenDayFocast from "../SevenDayFocast.jsx";
import TempGraph from "./TempGraph.jsx";

// apparentTemperatureMax: 24.493581771850586
// apparentTemperatureMin: 12.095468521118164
// precipitationSum:  0
// temperature2mMax: 25.538000106811523
// temperature2mMin: 12.637999534606934
// uvIndexMax: 5.050000190734863
// weatherCode: 0
// weatherCondition: "Clear Sky"
// windDirection10mDominant: 290.92449951171875
// windSpeed10mMax: 8.714676856994629

const SearchResults = ({
  forecastLocation,
  dailyForcast,
  currentWeatherData,
  hourlyForecast,
}) => {
  // console.log(forecastLocation);

  // console.log(dailyForcast);

  return (
    <div className="search-result-container-div">
      <p className="forecast-title text-capitalize">
        {currentWeatherData[0]?.value?.weatherCondition}
      </p>
      <CardLayout>
        <div className="flex item-center justify-between">
          <div style={{ width: "30%" }}>
            <img
              src={
                weatherCodesMapping[currentWeatherData[0].value.weatherCode].img
              }
              alt="Weather img"
              width={48}
              height={48}
            />

            <div className="flex items-center">
              <img src={Location} alt="map mark" />
              <p className="city-name">{forecastLocation?.label}</p>
            </div>

            <p className="text-blue" style={{ paddingLeft: "30px" }}>
              Today's {moment(currentWeatherData[0].date).format("MMM DD")}
            </p>
          </div>

          <div className="temp-container" style={{ width: "auto" }}>
            <img
              src={Temperature}
              alt="Thermometer image"
              className="thermometer-img"
            />
            <div>
              <p style={{ fontSize: "144px" }}>
                {parseFloat(currentWeatherData[0].value?.temperature2m).toFixed(
                  0
                )}
              </p>
              <p>{currentWeatherData[0]?.value?.weatherCondition}</p>
            </div>
            <p
              style={{
                fontSize: "24px",
                alignSelf: "start",
                paddingTop: "45px",
              }}
            >
              ℃
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                  {Math.floor(currentWeatherData[0]?.value?.visibility / 1000)}{" "}
                  km
                </p>
                <p>|</p>
              </div>

              <div className="weather-info-subtile">
                <div className="flex">
                  <img src={ThermoMini} alt="" />
                  <p className="weather-params-label">Feels Like</p>
                </div>
                <p>
                  {Math.floor(
                    currentWeatherData[0]?.value?.apparentTemperature
                  )}{" "}
                  ℃
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                columnGap: "16px",
                marginTop: "24px",
              }}
            >
              <div className="weather-info-subtile">
                <div className="flex">
                  <img src={Water} alt="" />
                  <p className="weather-params-label">Humidity</p>
                </div>
                <p>{Math.floor(currentWeatherData[0]?.value?.humidity)} %</p>
                <p>|</p>
              </div>

              <div className="weather-info-subtile">
                <div className="flex">
                  <img src={Windy} alt="" />
                  <p className="weather-params-label">Wind</p>
                </div>
                <p>
                  {Math.floor(currentWeatherData[0]?.value?.windSpeed)} km/h
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>

      <div className="flex justify-between" style={{ marginTop: "24px" }}>
        <HourlyForecast hourlyData={hourlyForecast} />
      </div>

      <div className="flex items-center" style={{ columnGap: "20px" }}>
        <div className="current-time-metrix">
          <CardLayout className="unit-metrix">
            <div className="unit-metrix-container" style={{ marginTop: "0px" }}>
              <UnitMatrixComponent
                label="Temperature"
                value={Math.floor(currentWeatherData[0]?.value?.temperature2m)}
                unit="℃"
              />
              <UnitMatrixComponent
                label="Wind"
                value={Math.floor(currentWeatherData[0]?.value?.windSpeed)}
                unit="km/h"
              />
            </div>

            <div className="unit-metrix-container">
              <UnitMatrixComponent
                label="Humidity"
                value={Math.floor(currentWeatherData[0]?.value?.humidity)}
                unit="%"
              />
              <UnitMatrixComponent
                label="Visibility"
                value={Math.floor(
                  currentWeatherData[0]?.value?.visibility / 1000
                ).toFixed(2)}
                unit="km"
              />
            </div>
            <div className="unit-metrix-container">
              <UnitMatrixComponent
                label="Feels Like"
                value={Math.floor(
                  currentWeatherData[0]?.value?.apparentTemperature
                )}
                unit="℃"
              />
              <UnitMatrixComponent
                label="Chance of Rain"
                value={Math.floor(
                  currentWeatherData[0]?.value?.precipitationProbability
                )}
                unit="mm"
              />
            </div>

            <div className="unit-metrix-container">
              <UnitMatrixComponent
                label="Pressure"
                value={Math.floor(currentWeatherData[0]?.value?.cloudCover)}
                unit="%"
              />
              <UnitMatrixComponent
                label="Cloud Cover"
                value={Math.floor(
                  currentWeatherData[0]?.value?.surfacePressure
                )}
                unit="hPa"
              />
            </div>
          </CardLayout>
        </div>

        <SevenDayFocast dailyForcast={dailyForcast} />
      </div>

      <TempGraph hourlyData={hourlyForecast} />
    </div>
  );
};

export default SearchResults;
