import { Response } from "express";

interface ApiResponseOptions {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: any;
  pagination?: any;
}

export const sendResponse = ({
  res,
  statusCode = 200,
  message,
  data,
  pagination,
}: ApiResponseOptions) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};