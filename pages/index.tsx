import { useState, KeyboardEvent } from "react";
import plot from "simple-ascii-chart";

const Home = () => {
  const [error, setError] = useState("");
  const [size, setSize] = useState({ width: 20, height: 20 });
  const [data, setData] = useState([
    [1, 1],
    [2, 4],
    [3, 4],
    [4, 1],
    [5, 1],
    [6, 1],
    [10, 20],
    [14, 10],
  ] as Array<[x: number, y: number]>);

  const chart = (!error && plot(data, size.width, size.height)) || "";

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
      } catch ({ message }: unknown) {
        setError(message as string);
      }
    }
  };

  return (
    <>
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
              setSize({
                width: Number((target as HTMLSpanElement)?.textContent || 1),
                height: size.height,
              });
            });
          }}
        >
          {size.width}
        </span>
        <span>{`, `}</span>
        <span
          contentEditable
          onKeyDown={(event) => {
            runChart(event, () => {
              const { target } = event;
              setSize({
                height: Number((target as HTMLSpanElement)?.textContent || 1),
                width: size.width,
              });
            });
          }}
        >
          {size.height}
        </span>
        <span>{`)`}</span>
      </pre>
      <pre
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
