export const userCardChanged = useEventBus<void>('user-card-changed')

export interface CommentQuotedPayload {
  username: string
  pid: string
  floor: number
  content: string
  cid: string
}
export const commentQuoted = useEventBus<CommentQuotedPayload>('comment-quoted')
export const themeChanged = useEventBus<string>('theme-changed')
