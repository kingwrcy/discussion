import type { PointReason, UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'

export const getLength = function (str: string) {
  /// <summary>获得字符串实际长度，中文2，英文1</summary>
  /// <param name="str">要获得长度的字符串</param>
  let realLength = 0
  const len = str.length
  let charCode = -1
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128)
      realLength += 1
    else realLength += 2
  }
  return realLength
}
export const regRequestSchema = z
  .object({
    username: z.string(),
    password: z.string().min(6, '密码最少6个字符'),
    repeatPassword: z.string().min(6, '密码最少6个字符'),
    email: z.string().email('请填写正确的邮箱地址'),
  })
  .refine(data => data.password === data.repeatPassword, {
    message: '两次密码不一致',
    path: ['repeatPassword'],
  }).refine(data => getLength(data.username) >= 4, {
    message: '用户名最少4个字符,中文一个算2个字符',
    path: ['username'],
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
}

export interface MessageDTO {
  id: number
  from: UserDTO
  to: UserDTO
  content: string
  read: boolean
  createdAt: string
}
