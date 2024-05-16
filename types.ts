import { z } from "zod";

export type Post = {
  id: number;
  title: string;
  author: User;
  created: Date;
  views: number;
  comments: number;
  pinned?: boolean;
  content: string;
  like?: number;
  disLike?: number;
  tag: {
    name: string;
  };
};

export type User = {
  id: number;
  name: string;
  avatar: string;
};

export type Comment = {
  author: User;
  postId: number;
  post: Post;
  content: string;
  created: Date;
  like?: number;
  disLike?: number;
};

export type Posts = Post[];

export type JwtPayload = {
  username: string;
  id: number;
  roleId: number;
};

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
  title: z.string().min(4, "标题不少于6个字符"),
  content: z.string().min(6, "内容最少6个字符"),
  tags: z.array(z.number()).nonempty("请最少选择一个标签"),
});
