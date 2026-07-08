
import { postStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface PostInterface {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured: boolean;
  status: postStatus;
  tags: string[];
}



export interface DeletePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: postStatus;
  tags?: string[];
}

export interface QueryPost extends PostWhereInput {
 
  search?:string
  limit?:string
  page?:string
  sortBy?:string
  sortOrder?:string
}


