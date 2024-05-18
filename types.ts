import { z } from "zod";

export const regRequestSchema = z
  .object({
    username: z.string().min(4, "用户名最少4个字符"),
    password: z.string().min(6, "密码最少6个字符"),
    repeatPassword: z.string().min(6, "密码最少6个字符"),
    email: z.string().email("请填写正确的邮箱地址"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "两次密码不一致",
    path: ["repeatPassword"],
  });

export const loginRequestSchema = z.object({
  username: z.string().min(4, "用户名最少4个字符"),
  password: z.string().min(6, "密码最少6个字符"),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(4, "标题不少于6个字符")
    .max(120, "标题不能超过120个字符"),
  content: z.string().min(6, "内容最少6个字符"),
  tags: z.array(z.number()).nonempty("请最少选择一个标签"),
  pid:z.string().optional()
});

export type JwtPayload = {
  uid: string;
  username: string;
};
export type RoleDTO = {
  name: string;
  level: number;
};
export type UserDTO = {
  createdAt: string;
  uid: string;
  username: string;
  lastLogin: string | null;
  email: string;
  avatarUrl: string | null;
  point: number;
  postCount: number;
  commentCount: number;
  roleId: number;
  role: RoleDTO;
};
export type TagDTO = {
  id:number;
  name: string;
  desc: string;
  count: number;
};
export type CommentDTO = {
  content: string;
  cid: string;
  createdAt: string;
  mentioned: string | null;
  author: UserDTO;
};
export type PostDTO = {
  title: string;
  content: string;
  pid: string;
  createdAt: string;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  disLikeCount: number;
  minLevel: number;
  author: UserDTO;
  comments?: Array<CommentDTO>;
  tags: Array<TagDTO>;
  _count: {
    comments: number;
  };
};
