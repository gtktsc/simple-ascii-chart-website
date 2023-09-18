import { useState, KeyboardEvent } from "react";
import plot from "simple-ascii-chart";

const Home = () => {
  const [error, setError] = useState("");
  const [settings, setSettings] = useState("" as string | void);
  const [data, setData] = useState([
    [1, 1],
    [2, -20],
    [3, 4],
    [4, 1],
    [5, 1],
    [6, 10],
  ] as Array<[x: number, y: number]>);

  // lord please forgive me
  const getSettings = (obj: string) => {
    try {
      return Function('"use strict";return (' + obj + ")")();
    } catch ({ message }: any) {
      setError(message as string);
    }
  };

  const executed = (settings && getSettings(settings)) || "";
  const chart = (!error && plot(data, executed)) || "";

  const runChart = (
    event: KeyboardEvent<HTMLSpanElement>,
    cb: (event: KeyboardEvent<HTMLSpanElement>) => void
  ) => {
    if (event.key === "Enter") {
      try {
        cb(event);
        (event.target as HTMLSpanElement)?.blur();
        event.preventDefault();
        setError("");
      } catch ({ message }: any) {
        setError(message as string);
      }
    }
  };

  return (
    <>
      <span>Plot settings:</span>
      <pre>
        <span>{`plot(`}</span>
        <span
          contentEditable
          onKeyDown={(event) =>
            runChart(event, () => {
              const { target } = event;
              const newData = JSON.parse(
                (target as HTMLSpanElement)?.textContent || ""
              );
              setData(newData);
            })
          }
        >
          {JSON.stringify(data)}
        </span>
        <span>{`, `}</span>
        <span
          contentEditable
          onKeyDown={(event) => {
            runChart(event, () => {
              const { target } = event;
              setSettings(
                (target as HTMLSpanElement)?.textContent || undefined
              );
            });
          }}
        >
          {settings?.toString() || "{}"}
        </span>
        <span>{`})`}</span>
      </pre>
      <span>Output:</span>

      <pre
        className="copyable"
        onClick={() => {
          navigator.clipboard.writeText(chart);
        }}
      >
        {error || chart}
      </pre>
    </>
  );
};

export default Home;
