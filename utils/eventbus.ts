export const userCardChanged = useEventBus<void>("user-card-changed");

export type CommentQuotedPayload = {
  username: string;
  pid: string;
  floor:number;
}
export const commentQuoted = useEventBus<CommentQuotedPayload>("comment-quoted");
