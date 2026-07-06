import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { TRequest, TResponse } from "../../utilities/type";
import { postService } from "./post.service";
import { sendResponse } from "../../utilities/sendResponse";
import  HttpStatus  from "http-status";


//  create post in database 
const createPost=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
    const result=await postService.createPostIntoDb();


     sendResponse(res, {
       success: true,
       message: "get profile successfully",
       successStatus: HttpStatus.CREATED,
       data: { result },
     });


})


// get all post 
const getAllPost=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
    const result=await postService.getAllPostFromDb();


     sendResponse(res, {
       success: true,
       message: "get profile successfully",
       successStatus: HttpStatus.CREATED,
       data: { result },
     });


})



// get all post stats
const getPostStats = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await postService.getAllPostStatsFromDb();

    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);



// get all post stats
const getMyPost = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await postService.getMyPostFromDb();

    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);




// get  post by id  stats
const getPostById = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await postService.getPostByIdFromDb();

    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);



// update  post by id  stats
const updatePost = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await postService.updatePostFromDb();

    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);




// delete  post by id  stats
const deletePost = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const result = await postService.deletePostFormDb();

    sendResponse(res, {
      success: true,
      message: "get profile successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);




export const postController = {
  createPost,
  getAllPost,
  getPostStats,
  getMyPost,
  getPostById,
  updatePost,
  deletePost,
};