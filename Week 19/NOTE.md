#Week 19

本周学习了发布系统的搭建

系统用到3个模块

1. `server` 一个express项目，仅用到了其静态资源服务的功能（/public 文件夹）类似`nginx`

2.  `publish-server`负责校验用户身份和将`publish-tool`上传的包内容`解压(unzipper)`至 `server`的`/public`目录

3. `publish-tool`负责引导用户进行github oauth授权，并将需要更新的资源文件`压缩(archiver)`和oauth授权得到的access_token一同提交给`publish-server`

   

