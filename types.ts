export type Post = {
  id: number;
  title: string;
  author: User;
  created: Date;
  views: number;
  comments: number;
  pinned?:boolean,
  content:string,
  tag:{
    name:string
  }
};

export type User = {
  name:string
  avatar:string
}

export type Posts = Post[]