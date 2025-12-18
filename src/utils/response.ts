import { ApiResponse } from "../types/response";
import { Response } from "express";

export const successResponse = <T>(
  res: Response<ApiResponse<T>>,
  data: T,
  message: string = "Success",
  code: number = 200
) => {
  const response: ApiResponse<T> = {
    code,
    data,
    message,
  };
  return res.status(200).json(response);
};
