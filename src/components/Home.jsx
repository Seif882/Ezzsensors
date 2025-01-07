import React, { useState } from "react";
import { useFormik } from "formik";

export default function Home() {
  let [showTempError, setShowTempError] = useState("hidden");
  let [showPumpError, setShowPumpError] = useState("hidden");
  let [showHLError, setShowHLError] = useState("hidden");
  let [result, setResult] = useState("hidden");
  let [resultMessage, setResultMessage] = useState("");
  let [heatMessage, setHeatMessage] = useState("");
  let [electricityMessage, setElectricityMessage] = useState("");

  function handleSubmit(e) {
    if (e.t0 < -273.15 || e.t1 < -273.15) {
      setShowTempError("flex");
    }
    if (e.pumpEfficiency < 0.6 || e.pumpEfficiency > 0.9) {
      setShowPumpError("flex");
    }
    if (e.hl <= 0) {
      setShowHLError("flex");
    }
    if (
      e.t0 > -273.15 &&
      e.t1 > -273.15 &&
      e.pumpEfficiency >= 0.6 &&
      e.pumpEfficiency <= 0.9 &&
      e.hl > 0
    ) {
      setShowTempError("hidden");
      setShowPumpError("hidden");
      setShowHLError("hidden");

      let gravity = 9.81;
      let specificHeatWater = 4186;
      let tempDifference = e.t1 - e.t0;
      let heatGained = specificHeatWater * tempDifference;
      let electricityConsumed = (gravity * e.hl) / e.pumpEfficiency;
      setElectricityMessage(
        `Electricity consumed by circulation pump: ${electricityConsumed.toFixed(
          2
        )} J.`
      );
      setHeatMessage(
        `Heat gained by clarified water: ${heatGained.toFixed(2)} J.`
      );
      if (heatGained > electricityConsumed) {
        setResult("flex");
        setResultMessage("Conclusion: Should operate the pump.");
      } else {
        setResult("flex");
        setResultMessage("Conclusion: Stop the pump.");
      }
    }
  }

  let formik = useFormik({
    initialValues: {
      t0: "",
      t1: "",
      pumpEfficiency: "",
      hl: "",
    },
    onSubmit: handleSubmit,
  });

  return (
    <div className="mt-5">
      <form
        className="w-3/4 mx-auto flex flex-col items-center"
        onSubmit={formik.handleSubmit}
      >
        {/* T0 Input */}
        <div className="relative z-0 w-full mb-5 group ">
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            name="t0"
            value={formik.values.t0}
            id="t0"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            step="any"
          />
          <label
            htmlFor="t0"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Temperature before the heat exchanger (T0) in °C
          </label>
        </div>

        {/* T1 Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            value={formik.values.t1}
            name="t1"
            id="t1"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            step="any"
          />
          <label
            htmlFor="t1"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Temperature after the heat exchanger (T1) in °C
          </label>
        </div>

        {/* Temperature Alert */}
        <div
          className={`${showTempError} w-full items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400`}
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>Temperatures cannot be below absolute zero (-273.15°C).</div>
        </div>

        {/* Pump Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            value={formik.values.pumpEfficiency}
            name="pumpEfficiency"
            id="pumpEfficiency"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            step="any"
          />
          <label
            htmlFor="pumpEfficiency"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Pump efficiency ratio (between 0.6 and 0.9)
          </label>
        </div>

        {/* Pump Alert */}
        <div
          className={`${showPumpError} w-full items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400`}
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>Pump efficiency must be between 0.6 and 0.9.</div>
        </div>

        {/* Head Loss Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            value={formik.values.hl}
            name="hl"
            id="hl"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            step="any"
          />
          <label
            htmlFor="hl"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            System head loss in meters (recommend 3 meters)
          </label>
        </div>

        {/* Head Loss Alert */}
        <div
          className={`${showHLError}  w-full items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400`}
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>System head loss must be a positive number.</div>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-fit px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        {/* Result */}
        <div
          className={`${result} w-full justify-center items-center p-4 mb-4 mt-2 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400`}
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="flex flex-col items-center">
            <p className="">{heatMessage}</p>
            <p>{electricityMessage}</p>
            <p>{resultMessage}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
