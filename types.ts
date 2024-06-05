import type { PointReason, UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'

export const regRequestSchema = z
  .object({
    username: z.string().min(4, '用户名最少4个字符'),
    password: z.string().min(6, '密码最少6个字符'),
    repeatPassword: z.string().min(6, '密码最少6个字符'),
    email: z.string().email('请填写正确的邮箱地址'),
  })
  .refine(data => data.password === data.repeatPassword, {
    message: '两次密码不一致',
    path: ['repeatPassword'],
  })

export const saveSettingsRequestSchema = z.object({
  password: z.string().optional(),
  email: z.string().email('请填写正确邮箱地址'),
  css: z.string().optional().nullish(),
  js: z.string().optional().nullish(),
  signature: z.string().max(300, '最大不超过300个字符').optional().nullish(),
})

export const loginRequestSchema = z.object({
  username: z.string().min(4, '用户名最少4个字符'),
  password: z.string().min(6, '密码最少6个字符'),
})

export const createPostSchema = z.object({
  title: z
    .string()
    .min(4, '标题不少于6个字符')
    .max(120, '标题不能超过120个字符'),
  content: z.string().min(6, '内容最少6个字符'),
  tagId: z.number({ message: '标签是必选的' }),
  pid: z.string().optional(),
})

export interface JwtPayload {
  uid: string
  userId: number
  username: string
}
export interface UserDTO {
  createdAt: string
  uid: string
  username: string
  email: string
  avatarUrl: string | null
  point: number
  postCount: number
  commentCount: number
  role: UserRole
  status: UserStatus
  lastLogin: string
  level: number
  bannedEnd: string
  unRead: number
  css?: string
  js?: string
  signature?: string
  lastActive?: string
  _count: {
    fav: number
    comments: number
    posts: number
    ReceiveMessage: number
  }
}
export interface TagDTO {
  id: number
  name: string
  desc: string
  enName: string
  count: number
}
export interface CommentDTO {
  content: string
  cid: string
  createdAt: string
  updatedAt: string
  mentioned: Array<string>
  author: UserDTO
  likeCount?: number
  dislikeCount?: number
  like?: boolean
  dislike?: boolean
  post?: PostDTO
  floor: number
}

export interface PointHistoryDTO {
  createdAt: string
  pid: string
  cid: string
  post: PostDTO
  comment: CommentDTO
  reason: PointReason
}

export interface PostDTO {
  title: string
  content: string
  pid: string
  uid: string
  createdAt: string
  viewCount: number
  replyCount: number
  likeCount: number
  disLikeCount: number
  minLevel: number
  author: UserDTO
  comments?: Array<CommentDTO>
  tagId: number
  tag: TagDTO
  support?: boolean
  _count: {
    comments: number
    commentLike: number
    commentDisLike: number
    PostSupport: number
  }
  fav?: boolean
  pinned: boolean
  lastCommentTime?: string
  lastCommentUid?: string
  lastCommentUser?: UserDTO
  point: number
}

export interface SysConfigDTO {
  websiteName: string
  pointPerPost: number
  pointPerPostByDay: number
  pointPerComment: number
  pointPerCommentByDay: number
  pointPerLikeOrDislike: number
  pointPerDaySignInMin: number
  pointPerDaySignInMax: number
  websiteAnnouncement: string
  css: string
  js: string
}

export interface MessageDTO {
  id: number
  from: UserDTO
  to: UserDTO
  content: string
  read: boolean
  createdAt: string
}
