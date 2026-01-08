import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import DefaultScreen from "./Components/DefaultScreen";
import SearchResult from "./Components/SearchResults.jsx";
import { fetchWeatherApi } from "openmeteo";
import { weatherCodesMapping } from "./util.js";

const App = () => {
  const [dailyForcast, setDailyForcast] = useState(null);
  const [hourlyForcast, setHourlyForcast] = useState(null);
  const [dataLoading, setdataLoading] = useState(false);
  const [forecastLocation, setForcastLocation] = useState({
    label: "London",
    lat: 51.5085,
    lon: -0.1257,
  });
  const [showResultScreen, setShowResultScreen] = useState(false);

  const filterAndFlagClosestTime = function (data) {
    // console.log(data);
    const currentDate = new Date();
    const entries = Object.entries(data);
    // console.log(entries);

    // [["time","{obj.values"],["time2","{obj.values2"]]

    const todayData = entries.filter(([dateString]) => {
      const date = new Date(dateString); //Coverting string to a date format
      return (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    });

    // console.log(todayData);

    let closetTimeDiff = Math.abs(currentDate - new Date(todayData[0][0]));
    let closetTimeDiffIndex = 0;
    todayData.forEach(([dateString], index) => {
      const timeDiff = Math.abs(currentDate - new Date(dateString));
      if (timeDiff < closetTimeDiff) {
        closetTimeDiff = timeDiff;
        closetTimeDiffIndex = index;
      }

      // console.log(closetTimeDiff);
      // console.log(closetTimeDiffIndex);
    });

    //  Add a flag to the closest time entry
    const result = todayData.map(([dateString, value], index) => ({
      date: dateString,
      value,
      isClosestTime: index === closetTimeDiffIndex,
    }));

    return result;
  };

  function processData(hourly, daily) {
    function covertTimeToObjectArray(times, values) {
      if (!times || !values || !values.weatherCode) {
        return {};
      }

      const obj = {};
      times.forEach((time, timeIndex) => {
        if (!time) return;
        const weatherProperties = {};

        Object.keys(values).forEach((property) => {
          if (values[property] && values[property][timeIndex] !== undefined) {
            weatherProperties[property] = values[property][timeIndex];
          }
        });
        const weatherCode = values.weatherCode[timeIndex];
        const weatherCondition = weatherCodesMapping[weatherCode]?.label;

        obj[time] = {
          ...weatherProperties,
          weatherCondition,
        };
      });
      // console.log(obj);
      return obj;
    }

    const dailyData = covertTimeToObjectArray(daily.time, {
      weatherCode: daily.weatherCode,
      temperature2mMax: daily.temperature2mMax,
      temperature2mMin: daily.temperature2mMin,
      apparentTemperatureMax: daily.apparentTemperatureMax,
      apparentTemperatureMin: daily.apparentTemperatureMin,
      uvIndexMax: daily.uvIndexMax,
      precipitationSum: daily.precipitationSum,
      windSpeed10mMax: daily.windSpeed10mMax,
      windDirection10mDominant: daily.windDirection10mDominant,
    });

    const hourlyFormatted = covertTimeToObjectArray(hourly.time, {
      temperature2m: hourly.temperature2m,
      visibility: hourly.visibility,
      windDirection10m: hourly.windDirection10m,
      apparentTemperature: hourly.apparentTemperature,
      precipitationProbability: hourly.precipitationProbability,
      humidity: hourly.humidity,
      windSpeed: hourly.windSpeed,
      weatherCode: hourly.weatherCode,
      cloudCover: hourly.cloudCover,
      surfacePressure: hourly.surfacePressure,
    });

    const hourlyData = filterAndFlagClosestTime(hourlyFormatted);
    return { hourlyData, dailyData };
  }

  const fetchWeather = async (lat, lon, switchToResultScreen) => {
    const params = {
      latitude: lat ?? 26.6139,
      longitude: lon ?? 77.209,

      hourly: [
        "temperature_2m",
        "weather_code",
        "visibility",
        "wind_direction_10m",
        "apparent_temperature",
        "precipitation_probability",
        "relative_humidity_2m",
        "wind_speed_10m",
        "cloud_cover",
        "surface_pressure",
      ],
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",

        "uv_index_max",
        "precipitation_sum",
        "wind_speed_10m_max",
        "wind_direction_10m_dominant",
      ],
      timezone: "auto",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start, stop, step) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process the first location and add a for loop for multiple locations orweather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly();
    const daily = response.daily();

    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0).valuesArray(),
        weatherCode: hourly.variables(1).valuesArray(),
        visibility: hourly.variables(2).valuesArray(),
        windDirection10m: hourly.variables(3).valuesArray(),
        apparentTemperature: hourly.variables(4).valuesArray(),
        precipitationProbability: hourly.variables(5).valuesArray(),
        humidity: hourly.variables(6).valuesArray(),
        windSpeed: hourly.variables(7).valuesArray(),
        cloudCover: hourly.variables(8).valuesArray(),
        surfacePressure: hourly.variables(9).valuesArray(),
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        weatherCode: daily.variables(0).valuesArray(),
        temperature2mMax: daily.variables(1).valuesArray(),
        temperature2mMin: daily.variables(2).valuesArray(),
        apparentTemperatureMax: daily.variables(3).valuesArray(),
        apparentTemperatureMin: daily.variables(4).valuesArray(),
        uvIndexMax: daily.variables(5).valuesArray(),
        precipitationSum: daily.variables(6).valuesArray(),
        windSpeed10mMax: daily.variables(7).valuesArray(),
        windDirection10mDominant: daily.variables(8).valuesArray(),
      },
    };
    // console.log(weatherData);
    const { hourlyData, dailyData } = processData(
      weatherData.hourly,
      weatherData.daily
    );

    // console.log("Hourly data", hourlyData);
    // console.log("Daily data", dailyData);

    setDailyForcast(dailyData);
    setHourlyForcast(hourlyData);
    setdataLoading(false);
    if (switchToResultScreen) {
      setShowResultScreen(true);
    }
  };

  useEffect(() => {
    try {
      setdataLoading(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          // console.log(position);
          const { latitude, longitude } = position.coords;

          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&format=jsonv2`
          )
            .then((response) => response.json())
            .then((location) => {
              setForcastLocation({
                label: `${
                  location?.address?.city ??
                  location?.address?.village ??
                  location?.address?.subrub
                },
            ${location?.address?.state}, ${location?.address?.country}`,
                lat: location.lat,
                lon: location.lon,
              });
              fetchWeather(location.lat, location.lon);
            });
        });
      } else {
        fetchWeather();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setdataLoading(false);
    }
  }, []);

  const clickHandler = (seartchItem) => {
    console.log(seartchItem);

    setdataLoading(true);
    setForcastLocation({
      label: seartchItem.label,
      lat: seartchItem.lat,
      lon: seartchItem.lon,
    });
    // console.log(seartchItem);
    fetchWeather(seartchItem.lat, seartchItem.lon, true);
  };

  return (
    <div className="app">
      <Header />
      {!dataLoading && !showResultScreen && (
        <DefaultScreen
          currentWeatherData={
            hourlyForcast?.length
              ? hourlyForcast.filter((hour) => hour.isClosestTime)
              : []
          }
          forecastLocation={forecastLocation}
          onClickHandler={clickHandler}
        />
      )}
      {showResultScreen && !dataLoading && (
        <SearchResult
          currentWeatherData={
            hourlyForcast?.length
              ? hourlyForcast.filter((hour) => hour.isClosestTime)
              : []
          }
          dailyForcast={dailyForcast}
          hourlyForecast={hourlyForcast}
          forecastLocation={forecastLocation}
        />
      )}
      <p className="copyright-text">&copy; 2025 WSA, All rights reserved</p>
    </div>
  );
};

export default App;
