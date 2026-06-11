import type { RequestHandler } from "express";
import type { ApiResponse } from "../lib/api-response.js";

export type HealthResponse = {
  status: "ok";
  uptimeSeconds: number;
  timestamp: string;
};

export const health: RequestHandler<Record<string, string>, ApiResponse<HealthResponse>> = (
  _request,
  response
) => {
  response.status(200).json({
    data: {
      status: "ok",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
};
