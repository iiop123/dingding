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
    <img src="https://img.giao111.workers.dev/api/img/fN3dbG" width="100%"/>
    <p>主页 </p>
</td>
<td width="50%">
    <img src="https://img.giao111.workers.dev/api/img/YSah4n" width="100%"/>
    <p>文件上传成功信息页</p>
</td>

</tr>
<tr>
<td width="50%">
    <img src="https://img.giao111.workers.dev/api/img/N8NCG3" width="100%"/>
    <p>文件口令展示</p>
</td>
<td width="50%">
    <img src="https://img.giao111.workers.dev/api/img/aw3Q7Y" width="100%"/>
    <p>文件分享二维码</p>
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