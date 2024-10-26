"use client";

import React, { useEffect, useState } from "react";
import EditablePlot from "../../components/EditablePlot";
import { Coordinates } from "simple-ascii-chart";

export default function Playground() {
  const [input, setInput] = useState<Coordinates>([
    [1, 2],
    [2, 4],
    [3, 6],
    [4, 8],
  ]); // Default input values

  const [options, setOptions] = useState<{
    width: number;
    height: number;
  }>({
    width: 30,
    height: 15,
  }); // Default options values

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inputParam = urlParams.get("input");
    const optionsParam = urlParams.get("options");

    if (inputParam) {
      try {
        const parsedInput = JSON.parse(decodeURIComponent(inputParam));
        setInput(parsedInput as Coordinates);
      } catch (error) {
        console.error("Error parsing input URL parameter:", error);
      }
    }

    if (optionsParam) {
      try {
        const parsedOptions = JSON.parse(decodeURIComponent(optionsParam));
        setOptions(parsedOptions);
      } catch (error) {
        console.error("Error parsing options URL parameter:", error);
      }
    }
  }, []);

  return (
    <div>
      <EditablePlot input={input} options={options} />
    </div>
  );
}
