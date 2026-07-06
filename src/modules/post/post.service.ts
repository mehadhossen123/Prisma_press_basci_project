import { prisma } from "../../lib/prisma";
import { DeletePostPayload, PostInterface } from "./post.interface";

// create post in db
const createPostIntoDb = async (payload: PostInterface, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

// get all post form db api
const getAllPostFromDb = async () => {
  const result = await prisma.post.findMany({
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
  return result;
};

// get my  post by id
const getPostByIdFromDb = async (postId: string) => {
  const result = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!result) {
    const error = new Error("Post not found");
    (error as any).statusCode = 404;
    throw error;
  }

  const updatePostView = await prisma.post.update({
    where: { id: postId },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatePostView;
};

// get all post stats
const getMyPostFromDb = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: { authorId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!result) {
    const error = new Error("Post not found");
    (error as any).statusCode = 404;
    throw error;
  }

  return result;
};
// update  all post stats
const deletePostFormDb = async (
  postId: string,

  authorId: string,
  isAdmin: boolean,
) => {

   const post = await prisma.post.findUniqueOrThrow({
     where: { id: postId }
   });

   if (!isAdmin && post.authorId !== authorId) {
     throw new Error("You are not the owner of this post");
   }

   const result=await prisma.post.delete({
    where:{id:postId}
   })

   return result;




};


// get all post stats
const updatePostFromDb = async (
  postId: string,
  payload: DeletePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  const result = await prisma.post.update({
    where: { id: postId },
    data: payload,
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};

export const postService = {
  createPostIntoDb,
  getAllPostFromDb,

  getMyPostFromDb,
  getPostByIdFromDb,
  updatePostFromDb,
  deletePostFormDb,
};
