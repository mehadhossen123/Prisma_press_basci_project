import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { TRequest, TResponse } from "../../utilities/type";
import { sendResponse } from "../../utilities/sendResponse";
import  HttpStatus  from "http-status";
import { commentService } from "./comment.service";


// get comment by author id 
const getCommentByAuthorId = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await commentService.getCommentByAuthorId()
    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);


// post comment 
const postComment = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await commentService.createCommentIntoDb()
    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);


// get comment by id 
const getCommentById = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await commentService.getCommentByCommentId()
    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);


// update comment 
const updateComment = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await commentService.updateComment()
    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);



// delete comment 
const deleteComment = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await commentService.deleteComment()
    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);
// moderates  comment 
const moderateComment = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await commentService.moderateCommentIntoDb();
    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);

export const commentController = {
  getCommentByAuthorId,
  postComment,
  getCommentById,
  updateComment,
  deleteComment,
  moderateComment,
};
