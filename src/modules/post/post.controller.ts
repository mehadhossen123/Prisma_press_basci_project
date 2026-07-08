import { NextFunction } from "express";
import { catchAsync } from "../../utilities/catchAsync";
import { TRequest, TResponse } from "../../utilities/type";
import { postService } from "./post.service";
import { sendResponse } from "../../utilities/sendResponse";
import  HttpStatus  from "http-status";


//  create post in database 
const createPost=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
   const userId=req?.user?.id
  const payload=req.body;
 
    const result=await postService.createPostIntoDb(payload,userId as string);


     sendResponse(res, {
       success: true,
       message: "Created post successfully",
       successStatus: HttpStatus.CREATED,
       data: { result },
     });


})


// get all post 
const getAllPost=catchAsync(async(req:TRequest,res:TResponse,next:NextFunction)=>{
  const query=req.query;
  
    const result=await postService.getAllPostFromDb(query);


     sendResponse(res, {
       success: true,
       message: "Get all post successfully",
       successStatus: HttpStatus.FOUND,
       data: result
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



// get single  post by id 
const getMyPost = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const id=req?.user?.id;
 
    const result = await postService.getMyPostFromDb(id as string);

    sendResponse(res, {
      success: true,
      message: "get  post successfully",
      successStatus: HttpStatus.CREATED,
      data: result ,
    });
  },
);




// get  post by id  
const getPostById = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {
    const postId = req?.params?.postId;
  
    if(!postId){
      throw new Error("Post id required")
    }
    const result = await postService.getPostByIdFromDb(postId as string);
    
    if (!result) {
      return sendResponse(res, {
        success: false,
        message: "Post not found",
        successStatus: HttpStatus.NOT_FOUND, 
        data: null,
      });
    }

    sendResponse(res, {
      success: true,
      message: "Get post  successfully",
      successStatus: HttpStatus.OK,
      data:  result ,
    });
  },
);



// update  post by id  stats
const updatePost = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {

    const postId=req?.params?.postId;
    const authorId=req?.user?.id;
     const payload=req.body;
     const admin=req?.user?.role=="admin"
    const result = await postService.updatePostFromDb(postId as string,payload,authorId as string,admin);

    sendResponse(res, {
      success: true,
      message: "post update successfully",
      successStatus: HttpStatus.CREATED,
      data: { result },
    });
  },
);




// delete  post by id  stats
const deletePost = catchAsync(
  async (req: TRequest, res: TResponse, next: NextFunction) => {

    const postId = req?.params?.postId;
    const authorId = req?.user?.id;
  
    const admin = req?.user?.role == "admin";
    const result = await postService.deletePostFormDb(postId as string ,authorId as string ,admin);

    sendResponse(res, {
      success: true,
      message: "post deleted successfully",
      successStatus: HttpStatus.OK,
      data: result ,
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