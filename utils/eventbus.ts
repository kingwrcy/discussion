export const userCardChanged = useEventBus<void>("user-card-changed");

export type CommentQuotedPayload = {
  username: string;
  pid: string;
  floor: number;
  edit: boolean;
  content: string;
  cid: string;
};
export const commentQuoted = useEventBus<CommentQuotedPayload>("comment-quoted");
