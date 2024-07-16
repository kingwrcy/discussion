# 极简论坛

[![docker pull](https://img.shields.io/docker/pulls/kingwrcy/discussion)](https://hub.docker.com/repository/docker/kingwrcy/discussion)

[在线demo](https://discussion.mblog.club)

本项目基于Nuxt3+PostgresSQL开发而成,保持极简,所以注定功能不会过多.
基本的功能目前都有了,欢迎pr,添加你觉得常用/有用的功能.

适合小范围部署自用.

特性如下:

- 发帖和回复支持markdown语法.
- 支持点赞和踩,支持收藏帖子.
- 支持tg通知,支持上传本地图片
- 支持邮件注册验证/邀请注册
- 支持重置密码
- 支持配置网站公告.
- 支持新增节点.
- 他人回复,点赞等互动有消息通知.
- 支持积分,评论,发帖等会增加积分,可后台配置上限等.
- 支持禁言用户.
- 支持Docker Compose一键部署.

**如果在后台开启了允许上传本地图片,还需要把`/app/upload`文件夹映射到宿主机上,不映射的话,docker重启之后上传到本地的图片就丢了.**

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
#上传图片的目录，如果需要上传本地图片，docker启动时需要映射出来，不然重启就会丢失
NUXT_UPLOAD_DIR=/opt/discussion/upload
```

执行`pnpm i`安装依赖包
执行`npx prisma migrate dev`同步数据库
执行`pnpm dev`本地启动项目.

## 本地开发时数据库变更

### DML变更

对数据库中的数据进行一些简单操作，如insert,delete,update,select等.

执行`npx prisma migrate dev --create-only`,创建一个空的迁移脚本,然后自己填入DML变更脚本,完了之后执行`npx prisma migrate dev`会自动执行迁移脚本,已经执行过的迁移脚本不可手动修改!!!

### DDL变更

对数据库中的某些对象(例如，database,table)进行管理，如Create,Alter和Drop.

直接修改`schema.prisma`文件,需要掌握一定的prisma知识,修改完后保存,然后执行`npx prisma migrate dev`会自动生成迁移脚本,生成的迁移脚本不可手动修改!!!
