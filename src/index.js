import {
    Application,
    Router,
    normalizePathnameMiddleware
  } from '@cfworker/web';
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
const pass='123'//默认登录密码
/*
默认密码都是123
*/

  const router = new Router();
  async function randomString(len) {
    　　len = len || 6;
    　　let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　let maxPos = $chars.length;
    　　let result = '';
    　　for (let i = 0; i < len; i++) {
    　　　　result += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return result;
    }

    async function randomnumber(len) {
      　　len = len || 5;
      　　let $chars = '0123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      　　let maxPos = $chars.length;
      　　let result = '';
      　　for (let i = 0; i < len; i++) {
      　　　　result += $chars.charAt(Math.floor(Math.random() * maxPos));
      　　}
      　　return result;
      }
    
    //router
     addEventListener("fetch", async (event) => {
      let pathname = new URL(event.request.url)
      let asset= new RegExp('/assets/.*','i')
      let index=new RegExp('/index.*','i')
      let list=new RegExp('/list.*','i')
      if (asset.test(pathname.pathname)||index.test(pathname.pathname)||list.test(pathname.pathname)) {
        event.respondWith(handleEvent(event));
      }
    });
    //handle event
    async function handleEvent(event) {
      let pathname = new URL(event.request.url)
      return getAssetFromKV(event)
  }
  
//redirect to index
  router.get('/',({res})=>{
    res.redirect('/index.html')
  })
  
  //upload api
router.post(
    '/api', async ({req,res})=> {
      let form=req.body.formData()
      let msg
      let file=(await form).get('file')
      //检查取件码、链接合法性
      let url=await randomString()
          let code=await randomnumber()
        let check=await LINK.get(url)
        if (check!==null) {
          url=await randomString()
        }
        const code_check=await LINK.get(code)
        if (code_check!==null) {
          code=await randomnumber()
        }
      let stream=file.stream()
      const exp=86400
      
        await LINK.put(url,stream,{
          expirationTtl: exp,
          metadata:{
            size:file.size,
            name:file.name,
            date:new Date().getTime(),
            link:req.url+'/file/'+url,
            type:file.type
          },
        })
        await LINK.put(code,req.url+'/file/'+url,{
          expirationTtl: exp,
          metadata:{
          size:file.size,
          name:file.name}
        })
        msg=
        {name:file.name,
          time:new Date().getTime(),
          size:file.size,
          link:req.url+'/file/'+url,
          code:code
        }

    res.body={msg:msg}
  }
  );

  //get file config
  router.get('/api/file/:p', async ({req,res})=>{
    let body=await LINK.get(req.params.p,{cacheTtl:864000,type:"stream"})
    const video=new RegExp("(.*?)\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)","i")
    const media=new RegExp("(.*?)\.(png|jpe?g|gif|bmp|psd|tiff|tga|webp)","i")
    const { metadata } = await LINK.getWithMetadata(req.params.p);
    if (video.test(metadata.name)) {
      res.type=metadata.type
      res.headers.append('Accept-Ranges','bytes')
      res.headers.append('Content-Disposition',`inline;filename=${metadata.name}`)
      res.body=body
      return
    }
    if (media.test(metadata.name)) {
      res.type=metadata.type
      res.headers.append('Content-Disposition',`inline;filename=${metadata.name}`)
      res.body=body
      return
    }
    res.type=metadata.type
    res.headers.append('Content-Disposition',`attachment;filename=${metadata.name}`)
    res.body=body
    
  })  
  // Favicon route for fun :)
  router.get('/favicon.ico', ({ res }) => {
    res.type = 'image/svg+xml';
    res.body = `
        <svg xmlns="http://www.w3.org/2000/svg" baseProfile="full" width="200" height="200">
          <rect width="100%" height="100%" fill="#F38020"/>
          <text font-size="120" font-family="Arial, Helvetica, sans-serif" text-anchor="end" fill="#FFF" x="185" y="185">W</text>
        </svg>`;
  });

  //share_code
  router.get('/code',async ({req,res})=>{
    const paramas=req.url.searchParams
    if (paramas.get('query')!==null) {
      const value=await LINK.get(paramas.get('query'))
      const { metadata } = await LINK.getWithMetadata(paramas.get('query'));
      if (value==null) {
        res.status=400
        res.body={link:'错误的分享码'}
        return
      }
    res.body={link:{name:metadata.name,size:metadata.size,url:value}}
    console.log(value);
    }
  })
  //sign in auth
  router.get('/query',async ({req,res})=>{
    const paramas=req.url.searchParams
    
    if (paramas.get('pass')==pass) {
      const key=await LINK.list()
    if (key.keys=='') {
      res.status=400
      res.body={info:'无内容可展示'}
      return
    }
    res.body=key
    }
    else{
      res.status=400
      res.body={info:'密码错误'}
      
    }

  })
  

  // Compose the application
  new Application()
  .use(normalizePathnameMiddleware)
  .use(router.middleware)
  .listen();