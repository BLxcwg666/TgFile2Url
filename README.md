# TgFile2Url
一个简单的 Bot 将来自 Telegram 的文件转换为 Url  
使用 Node.JS 构建，所以运行前请先自备 `Node.JS ≥ 16` 的环境喽  

# 功能？
其实没什么特别的，就是你给他发个文件就可以获得一个下载这个文件的 Url，对于某些特定场景下非常实用  

# 特性
- 支持自定义下载域名
- 支持 SSL / HTTPS 访问
- 支持使用 Cloudflare
- 支持基本上全类型的文件
- 支持二改，但是必须开源

# 安装
将仓库克隆到本地后，使用 `npm install` 安装所需依赖  
配置好 `.env` 后使用 `node main.js` 运行  
可以通过 systemctl / screen 保活

# 配置
```
# Server 相关配置
SERVER_HOST=0.0.0.0                   # 绑定 IP，一般用 0.0.0.0
SERVER_PORT=80                        # 绑定端口，不开启 SSL 推荐默认 80，开启 SSL 推荐 443
SERVER_NAME="tgfile2url.local.cat"    # 绑定域名，会显示在 Bot 发送的下载链接中
SERVER_SSL=false                      # SSL 开关，改为 true 后需要在下面配置证书信息

# SSL 相关配置
# 不建议改此项，推荐直接将证书重命名为 server.crt，将密钥重命名为 key.pem 后放进 Certs 文件夹
CERT_PATH="./Certs/server.crt"        # 证书路径（PEM 格式）
CERT_KEY_PATH="./Certs/key.pem"       # 密钥路径（PEM 格式）

# 在这里输入 Bot Token
BOT_TOKEN="11451419:NhE1hA14aAoAbHfFy5HvC1rHbKn4J"
```

# 使用
很简单啦~  
  
![image](https://github.com/BLxcwg666/TgFile2Url/assets/66854530/af2cbd29-1872-4da7-b69b-2db768e02f01)

# 展望未来
- Server 记录访问日志
- 写 .log
- 指定用户黑名单
- 文件发送日志（审计）
