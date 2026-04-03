import {
  handleGetChartRequest,
  handlePostChartRequest,
} from "../../lib/api.mjs";

export async function GET(request: Request) {
  return handleGetChartRequest(request);
}

export async function POST(request: Request) {
  return handlePostChartRequest(request);
}
