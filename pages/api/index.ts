import { NextApiRequest, NextApiResponse } from "next";
import plot from "simple-ascii-chart";

export default function handler(
  { query }: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { input, settings } = query;
    const parsedInput = JSON.parse(input as string);

    const parsedSettings =
      (settings && JSON.parse(settings as string)) || undefined;

    res.status(200).send(plot(parsedInput, parsedSettings));
  } catch (error) {
    res.status(400).send("Unable to parse data");
  }
}
