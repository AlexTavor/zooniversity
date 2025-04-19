import React from "react";
import { useWeather } from "./useWeather.ts";
import "./WeatherPanel.css";

export const WeatherPanel: React.FC = () => {
    const weather = useWeather();

    if (!weather) return null;

    return (
        <div className="weather-panel">
            <h3>Weather</h3>
            <div className="weather-row">
                <label>🌬️ Wind Strength:</label>
                <span>{weather.windStrength.toFixed(2)}</span>
            </div>
            <div className="weather-row">
                <label>🧭 Wind Direction:</label>
                <span>{weather.windDirection === 1 ? "→" : "←"}</span>
            </div>
            <div className="weather-row">
                <label>☁️ Cloud Cover:</label>
                <span>{weather.cloudCover.toFixed(2)}</span>
            </div>
        </div>
    );
};
