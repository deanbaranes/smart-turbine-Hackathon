import React, { useEffect, useState } from "react";
import "./index.css";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const TurbineBlades = ({ windSpeed }: { windSpeed: number }) => {
  const rotationDuration = Math.max(0.3, 6 - windSpeed / 3);

  return (
    <div className="relative w-40 h-40 mx-auto mb-6">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: rotationDuration,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="5" fill="#ccc" />
          <path d="M50 50 L90 45 L85 55 Z" fill="#00f2fe" />
          <path d="M50 50 L45 10 L55 15 Z" fill="#00f2fe" />
          <path d="M50 50 L15 60 L20 50 Z" fill="#00f2fe" />
        </svg>
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  const [windSpeed, setWindSpeed] = useState(0);
  const [bladeAngles, setBladeAngles] = useState<number[]>([0, 0, 0]);
  const [powerData, setPowerData] = useState<number[]>([]);
  const [windHistory, setWindHistory] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [windDirection, setWindDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const speed = +(Math.random() * 15).toFixed(1);
      const direction = Math.floor(Math.random() * 360);
      const angles = [speed * 2, speed * 2 + 5, speed * 2 - 5];
      setWindSpeed(speed);
      setWindDirection(direction);
      setBladeAngles(angles);
      setPowerData((prev) => {
        const updated = [...prev, +(speed * 1.5).toFixed(1)];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
      setWindHistory((prev) => {
        const updated = [...prev, speed];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
      setLabels((prev) => {
        const updated = [...prev, ""];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
      setTotalEnergy((prev) => prev + (speed * 1.5) / 60);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const bladeWarning = bladeAngles.some((a) => a > 90);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
      <h1 className="text-3xl font-bold text-center text-teal-400 mb-8">
        🌬️ Smart Wind Turbine Control Panel
      </h1>

      <div className="flex flex-col items-center gap-2 mb-6">
        <label className="text-sm text-gray-300">
          Manual Wind Speed Control
        </label>
        <input
          type="range"
          min="0"
          max="25"
          step="0.1"
          value={windSpeed}
          onChange={(e) => setWindSpeed(Number(e.target.value))}
          className="w-64"
        />
        <p>{windSpeed} m/s</p>
      </div>

      <TurbineBlades windSpeed={windSpeed} />

      {windSpeed > 20 && (
        <div className="text-red-400 text-center font-bold mt-2">
          ⚠️ Overload Risk! Consider stopping the turbine.
        </div>
      )}

      {bladeWarning && (
        <div className="text-orange-300 text-center mt-2">
          ⚠️ Blade angle deviation detected! Perform maintenance check.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
        <div className="bg-white bg-opacity-5 backdrop-blur-md p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-300 mb-3">
            🌦️ Weather
          </h2>
          <p>💨 Wind Speed: {windSpeed} m/s</p>
          <p>↪️ Wind Direction: {windDirection}°</p>
          <p>🌫️ Pressure: {1000 + Math.floor(Math.random() * 20)} hPa</p>
          <p>💧 Humidity: {50 + Math.floor(Math.random() * 50)}%</p>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-md p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-300 mb-3">
            🌀 Blades
          </h2>
          {bladeAngles.map((angle, index) => (
            <p key={index}>
              Blade {index + 1}: {angle.toFixed(0)}°
            </p>
          ))}
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-md p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-yellow-300 mb-3">
            ⚡ Power Output
          </h2>
          <div className="h-[200px]">
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Power (kW)",
                    data: powerData,
                    borderColor: "rgb(255, 206, 86)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white bg-opacity-5 backdrop-blur-md p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-cyan-300 mb-3">
            🌪️ Wind History
          </h2>
          <div className="h-[200px]">
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Wind Speed (m/s)",
                    data: windHistory,
                    borderColor: "cyan",
                    tension: 0.3,
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="bg-white bg-opacity-5 backdrop-blur-md p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-indigo-300 mb-2">
            📊 Summary
          </h2>
          <p>Total Energy Generated: {totalEnergy.toFixed(1)} kWh</p>
          <p>Estimated CO₂ Saved: {(totalEnergy * 0.85).toFixed(1)} kg</p>
          <p>Monitoring Blades: {bladeAngles.length}</p>
        </div>
      </div>

      <div className="mt-6 bg-white bg-opacity-5 backdrop-blur-md p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-pink-300 mb-2">
          🧠 Coming Soon
        </h2>
        <p>
          AI Recommendations, Blade Deformation Prediction, Remote Maintenance
          Control and more...
        </p>
      </div>
    </div>
  );
};

export default App;
