import { postStatus } from "../../../generated/prisma/enums";

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