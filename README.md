# 极简论坛

[![docker pull](https://img.shields.io/docker/pulls/kingwrcy/discussion)](https://hub.docker.com/repository/docker/kingwrcy/discussion)

[在线demo](https://discussion.mblog.club)

本项目基于Nuxt3+PostgresSQL开发而成,保持极简,所以注定功能不会过多.
基本的功能目前都有了,欢迎pr,添加你觉得常用/有用的功能.

适合小范围部署自用.

特性如下:

1. 发帖和回复支持markdown语法.
2. 支持点赞和踩,支持收藏帖子.
3. 支持配置网站公告.
4. 支持新增节点.
5. 他人回复,点赞等互动有消息通知.
6. 支持积分,评论,发帖等会增加积分,可后台配置上限等.
7. 支持禁言用户.
8. 支持Docker Compose一键部署.

## docker compose 部署

进入项目根目录,执行`docker-compose up -d`即可,无其他任何配置.

由于依赖了PostgresSQL数据库,所以没办法单独使用Docker启动,如果你本地已经有了PostgresSQL环境,你可以去掉[docker-compose.yml](https://github.com/kingwrcy/discussion/blob/master/docker-compose.yml)文件中的关于数据库的部分,并且把discussion中关于数据库的链接换成你自己的数据库链接.

## docker compose 升级
删掉[docker-compose.yml](https://github.com/kingwrcy/discussion/blob/master/docker-compose.yml)文件中的`#pull_policy: always`这一行最前面的`#`号,然后执行`docker-compose up -d`即可升级

有任何问题环境在论坛里谈论,或者直接在github上讨论.

## 本地启动

新建.env文件,内容如下:

```shell
#PostgreSQL数据库地址
DATABASE_URL="postgresql://数据库用户:数据库密码@数据库地址:数据库端口/数据库名称"
#生成JWT token时加密密钥,可自行指定,随机字符串即可,安全起见,最好改掉.
NUXT_JWT_SECRET_KEY="67vdu9Bw951Kga4"
#生成Cookie时的key,可自定指定,也可以不更改
NUXT_PUBLIC_TOKEN_KEY="S3pSQMBAgYWz"
#由于使用了avatar头像服务,这里指定cdn地址,不懂的不要改.
NUXT_PUBLIC_AVATAR_CDN=https://gravatar.cooluc.com/avatar/
```

执行`pnpm i`安装依赖包,执行`pnpm dev`本地启动项目.