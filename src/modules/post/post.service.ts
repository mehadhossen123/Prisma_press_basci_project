
import { commentStatus, postStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { DeletePostPayload, PostInterface, QueryPost } from "./post.interface";

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
const getAllPostFromDb = async (query: QueryPost) => {
  const limit=query.limit?Number(query.limit):10
  const page=query.page?Number(query.page):1

 

  const skip=(page-1)*limit;
   const andCondition: PostWhereInput[] = [];

if(query.search){
  andCondition.push({
    OR: [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: query.search,
        },
      },
    ]


  });
}


if(query.title){
  andCondition.push({
    title:query.title
  })
}


if(query.content){
  andCondition.push({
    title:query.content
  })
}




  const result = await prisma.post.findMany({
    //   here implementation filtering

    // where: {
    //   title:"My second Post",
    //   content:"mehad"
    // },
    // where:{
    //   title:{
    //     contains:"Ronaldo",
    //     mode:"insensitive"    // search case insensitive
    //   }
    // },

    // searching or approach
    // where:{
    //   OR:[
    //     {
    //       title:{
    //         contains:"Ronaldo",
    //         mode:"insensitive"
    //       }
    //     },
    //     {
    //       content:{
    //         contains:"Ronaldo",
    //         mode:"insensitive"
    //       }
    //     }
    //   ]
    // },

    // search and filtering er combination
    // where:{

    //   AND:[
    //     //  searching
    //     {
    //       OR:[
    //         {
    //       title:{
    //         contains:"mama ronaldo",
    //         mode:"insensitive"
    //       }
    //     },
    //     {
    //       content:{
    //       contains:"ronaldo",
    //        mode:"insensitive"
    //        }
    //      }

    //       ]

    //     },
    //     // filtering
    //     {
    //       title:"Ronaldo"
    //     },
    //     {
    //       content:"ronaldo"
    //     }
    //   ]
    // },

    //  this is the pagination part
    // take:1,
    // skip:1,

    where: {
      AND: [
        // search
        query.search
          ? {
              OR: [
                {
                  title: {
                    contains: query.search,
                    mode: "insensitive",
                  }
                },
                {
                  content: {
                    contains: query.search,
                  },
                },
              ],
            }
          : {},

        // filtering with title
        query.title ? { title: query.title } : {},
        // content filtering
        query.content ? { content: query.content } : {},
      ],
    },

    // where:{

    //   AND:andCondition
    // },

    



    take:limit,
     skip:skip,

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
  
  const transaction = await prisma.$transaction(

    async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
     
    });

    

    const post = await tx.post.findUniqueOrThrow({
      where: { id: postId },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments:{
          where:{
            status:commentStatus.APPROVED
          },
          orderBy:{
            createdAt:"desc"
          }
        },
        _count:{
          select:{
            comments:true
          }
        }
       
       
      },
    });
    return post;
    
  });

  return transaction;


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






// delete  all post 
const deletePostFormDb = async (
  postId: string,

  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  const result = await prisma.post.delete({
    where: { id: postId },
  });

  return result;
};

// update single  post 
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

const getAllPostStatsFromDb=async()=>{
  const transactionResult=await prisma.$transaction(
    async(tx)=>{
      const totalPost=await tx.post.count();


      const totalPublishPost=await tx.post.count({
        where:{
          status:postStatus.PUBLISHED
        }
      })


      const totalDraftPost=await tx.post.count({
        where:{
          status:postStatus.DRAFT
        }
      })


      const totalArchivePost=await tx.post.count({
        where:{
          status:postStatus.ARCHIVE
        }
      })

      const totalComment=await tx.comment.count();
      

      const totalApprovedComment=await tx.comment.count({
        where:{
          status:commentStatus.APPROVED
        }
      })


      const totalRejectComment=await tx.comment.count({
        where:{
          status:commentStatus.REJECTED
        }
      })

      return {
        totalPost,
        totalPublishPost,
        totalArchivePost,
        totalDraftPost,
        totalComment,
        totalApprovedComment,
        totalRejectComment
      }
    }
  )
   return transactionResult;
}






export const postService = {
  createPostIntoDb,
  getAllPostFromDb,
  getAllPostStatsFromDb,

  getMyPostFromDb,
  getPostByIdFromDb,
  updatePostFromDb,
  deletePostFormDb,
};
