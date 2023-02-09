## 丁丁快传

> ### 一款基于cloudflare workers的文件传输工具，文件存储在cloudflare KV中

---

> ### 主要功能：

- [x] 拖拽上传
- [x] 多文件上传
- [x] 定时删除
- [x] 二维码接收
- [x] 文件口令传输

> ### 功能截图

<table width="100%">
<tr>
<td width="50%">
    <img src="https://f.pz.al/pzal/2023/02/09/3c020420b7b1d.jpg" width="100%"/>
    <p>主页 </p>
</td>
<td width="50%">
    <img src="https://f.pz.al/pzal/2023/02/09/e95544ff865f3.jpg" width="100%"/>
    <p>文件上传成功信息页</p>
</td>

</tr>

</table>

> ### 如何使用 :tw-1f334:

```
#先安装Cloudflare Workers.命令行工具wrangler
npm install -g wrangler

#登录cloudflare
wrangler login

#下载代码
git clone https://github.com/iiop123/dingding.git

#执行npm i 安装库
cd dingding && npm i

#修改wrangler.toml中 id 为你创建的KV数据库id
kv_namespaces = [
  { binding = "LINK", id = "111",preview_id='111'}
]

#最后执行publish推送到workers即可
 wrangler publish
```
>### 关于后台
#### 可以访问 /list.html 页面查看已经上传的数据，密码为123 可以在 src/index.js文件中修改密码

------------

>### 关于过期时间的配置

#### 可以修改 src/index.js中 const exp=86400 的值单位为秒
