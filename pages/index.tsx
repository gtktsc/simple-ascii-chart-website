import { useState, KeyboardEvent } from "react";
import plot from "simple-ascii-chart";

const Home = () => {
  const [error, setError] = useState("");
  const [size, setSize] = useState({ width: 20, height: 20 });
  const [data, setData] = useState([
    [1, 1],
    [2, -20],
    [3, 4],
    [4, 1],
    [5, 1],
    [6, 10],
  ] as Array<[x: number, y: number]>);

  const chart =
    (!error && plot(data, { width: size.width, height: size.height })) || "";

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
        <span>{`, { width: `}</span>
        <span
          contentEditable
          onKeyDown={(event) => {
            runChart(event, () => {
              const { target } = event;
              setSize({
                width: Number(
                  (target as HTMLSpanElement)?.textContent || undefined
                ),
                height: size.height,
              });
            });
          }}
        >
          {size.width || "-"}
        </span>
        <span>{`, height: `}</span>
        <span
          contentEditable
          onKeyDown={(event) => {
            runChart(event, () => {
              const { target } = event;
              setSize({
                height: Number(
                  (target as HTMLSpanElement)?.textContent || undefined
                ),
                width: size.width,
              });
            });
          }}
        >
          {size.height || "-"}
        </span>
        <span>{`})`}</span>
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
