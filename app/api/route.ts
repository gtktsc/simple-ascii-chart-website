import { NextResponse } from "next/server";
import plot from "simple-ascii-chart";

// The function to handle GET requests
export async function GET(request: Request) {
  try {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");
    const settings = searchParams.get("settings");

    if (!input) {
      return NextResponse.json(
        { error: "Missing input data" },
        { status: 400 }
      );
    }

    // Parse input and settings from query string
    const parsedInput = JSON.parse(input);
    const parsedSettings = settings ? JSON.parse(settings) : undefined;

    // Generate the ASCII chart
    const chart = plot(parsedInput, parsedSettings);

    // Send the chart as the response
    return new Response(chart, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to parse data" },
      { status: 400 }
    );
  }
}
