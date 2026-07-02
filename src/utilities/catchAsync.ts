import { NextFunction, RequestHandler } from "express";
import { TRequest, TResponse } from "./type";
import  HttpStatus  from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: TRequest, res: TResponse, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to user register",
        error: (error as Error).message,
      });
    }
  };
};
