# tl-rtc-video

#### 简介 : （tl webrtc video）用webrt在web端视频通讯，支持单人直播，多人会议，聊天等。
#### 优点 ： 跨终端，不限平台，方便使用，支持私有部署


## 准备

    电脑安装好node，npm后进入项目目录

    npm install

    进入build目录 : cd build/webpack/  

    安装一些依赖 : npm install

## 测试环境 

    本地局域网启动video-res : npm run dev

    本地局域网启动video-socket : npm run devsocket

## 线上环境 （需要配置wss）

    公网环境启动video-res : npm run svr 

    公网环境启动video-socket : npm run svrsocket


## 配置db

    修改conf/cfg.json中相应db配置即可, 如open, dbName, host, port, user, pwd 等


## 配置wss

    修改conf/cfg.json中相应ws配置即可，如port, ws_online等


## 配置turnserver （私有部署）

    ubuntu:

    1. sudo apt-get install coturn  #安装coturn 

    2. cp conf/turn/turnserver.conf /etc/turnserver.conf    #修改配置文件, 文件内容按需修改

    3. chomd +x bin/genTurnUser.sh && ./genTurnUser.sh     #文件内容按需修改

    4. chomd +x bin/startTurnServer.sh && ./startTurnServer.sh     #启动turnserver，文件内容按需修改


## 需要自行修改res目录

    cd build/webpack 

    npm run build 保持后台开启即可