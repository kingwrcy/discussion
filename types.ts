import type { PointReason, UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'
import { getLength } from '~/utils'

export const regRequestSchema = z
  .object({
    username: z.string(),
    password: z.string().min(6, '密码最少6个字符'),
    repeatPassword: z.string().min(6, '密码最少6个字符'),
    email: z.string().email('请填写正确的邮箱地址'),
    inviteCode: z.string().optional(),
  })
  .refine(data => data.password === data.repeatPassword, {
    message: '两次密码不一致',
    path: ['repeatPassword'],
  }).refine(data => getLength(data.username) >= 3, {
    message: '用户名最少3个字符,中文一个算2个字符',
    path: ['username'],
  }).refine(data => !data.inviteCode || getLength(data.inviteCode) > 0, {
    message: '请填写邀请码',
    path: ['inviteCode'],
  })

export const saveSettingsRequestSchema = z.object({
  password: z.string().optional(),
  email: z.string().email('请填写正确邮箱地址'),
  headImg: z.union([z.string().url('请填写正确的URL'), z.string().nullish()]),
  css: z.string().optional().nullish(),
  js: z.string().optional().nullish(),
  signature: z.string().max(300, '最大不超过300个字符').optional().nullish(),
})

export const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string().min(6, '密码最少6个字符'),
}).refine(data => getLength(data.username) >= 4, {
  message: '用户名最少4个字符,中文一个算2个字符',
  path: ['username'],
})

export const createPostSchema = z.object({
  title: z
    .string()
    .min(4, '标题不少于6个字符')
    .max(120, '标题不能超过120个字符'),
  content: z.string({ message: '内容是必填的' }),
  tagId: z.number({ message: '标签是必选的' }),
  pid: z.string().optional(),
  readRole: z.number({ message: '阅读范围是必选的' }),
}).refine(data => getLength(data.content) >= 6, {
  message: '内容最少6个字符,中文一个算2个字符',
  path: ['username'],
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
  headImg?: string
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
  titles: TitleDTO[]
}
export interface TagDTO {
  id: number
  name: string
  desc: string
  enName: string
  count: number
}
export interface TitleDTO {
  id: number
  style: string
  status: boolean
  title: string
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
  readRole: number
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
  webBgimage: string
  websiteKeywords: string
  websiteDescription: string
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
  postUrlFormat: {
    type: 'UUID' | 'Date' | 'Number'
    minNumber: number
    dateFormat: string
  }
  invite: string
  createInviteCodePoint: number
}

export interface MessageDTO {
  id: number
  from: UserDTO
  to: UserDTO
  content: string
  read: boolean
  createdAt: string
}
export interface inviteInfo {
  id: number
  createdAt: string
  endAt: string
  fromUid: string
  toUid: string
  content: string
}
