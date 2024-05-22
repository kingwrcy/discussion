import type { UserRole, UserStatus } from "@prisma/client";
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

export const saveSettingsRequestSchema = z.object({
  password: z.string().optional(),
  email: z.string().email("请填写正确邮箱地址"),
  css: z.string().optional(),
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
  tagId: z.number({ message: "标签是必选的" }),
  pid: z.string().optional(),
});

export type JwtPayload = {
  uid: string;
  userId: number;
  username: string;
};
export type UserDTO = {
  createdAt: string;
  uid: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  point: number;
  postCount: number;
  commentCount: number;
  role: UserRole;
  status: UserStatus;
  lastLogin: Date;
  level: number;
  bannedEnd: Date;
  _count: {
    fav: number;
    comments: number;
    posts: number;
  };
};
export type TagDTO = {
  id: number;
  name: string;
  desc: string;
  count: number;
};
export type CommentDTO = {
  content: string;
  cid: string;
  createdAt: string;
  mentioned: Array<string>;
  author: UserDTO;
  likeCount?: number;
  dislikeCount?: number;
  like?: boolean;
  dislike?: boolean;
  post?: PostDTO;
};
export type PostDTO = {
  title: string;
  content: string;
  pid: string;
  uid: string;
  createdAt: string;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  disLikeCount: number;
  minLevel: number;
  author: UserDTO;
  comments?: Array<CommentDTO>;
  tagId: number;
  tag: TagDTO;
  _count: {
    comments: number;
    commentLike: number;
    commentDisLike: number;
  };
  fav?: boolean;
  pinned: boolean;
};

export const SafeUser = {
  createdAt: true,
  uid: true,
  id: true,
  username: true,
  lastLogin: true,
  email: true,
  avatarUrl: true,
  point: true,
  postCount: true,
  commentCount: true,
};

export type SysConfigDTO = {
  pointPerPost: number;
  pointPerComment: number;
  websiteName: string;
  websiteAnnouncement: string;
  userInitPoint: number;
};
