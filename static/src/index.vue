<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import 'vue-waterfall-plugin-next/style.css'
import QrcodeVue from 'qrcode.vue'
import 'animate.css';
import { nextTick } from 'vue';
export default{
    data(){
        return{
        file_info:[],
        //...
        status:false,//加载动画控制
        list_s:false,//文件列表控制
        //....
        page_status:false,
        //........
        over_page:false,//拖拽上传背景控制
        //......
        qr_val:'',//二维码的值
        code:'',//返回给用户的取件码
        rec_code:'',//用户输入的取件码
        //...
        rec_msg:{},//后端返回的取件码的信息
        file_list_head:['文件名','大小']
        }
    },
    mounted(){
     const drag=document.getElementById('drag')
      drag.addEventListener('dragenter',(e)=>{
        e.preventDefault()
        this.over_page=true
      })
      drag.addEventListener('dragleave',(e)=>{
        e.preventDefault()
        
        if (
        e.clientX <= 0 ||
          e.clientY <= 0 ||
          e.clientX >= window.innerWidth ||
          e.clientY >= window.innerHeight
    ){
      this.over_page=false
      console.log('leave');
    }
      })
      drag.addEventListener('dragover',(e)=>{
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy';
      })
      drag.addEventListener('drop',(e)=>{
        e.preventDefault()
        this.drop_upload(e)
      })
    },
    watch:{
      //监听用户输入的取件码
      rec_code(e){
        if (e.length==5) {
          fetch(`/code?query=${e}`).then((res)=>{
            if (res.ok) {
              return res.json()
            }else{
              throw res
            }
          }).then((msg)=>{
            this.page_status='code_succ_page'
            this.rec_msg=msg.link
          })
          .catch(async (err)=>{
            let err_msg=await err.json()
            return mdui.alert(err_msg.link)
          })
        }
      }
    },
    methods:{
    file(){
      let file_id=this.$refs.inp
      this.list_s=true
      for (let i = 0; i < file_id.files.length; i++) {
        if (file_id.files[i].size > 26214400) {
          return alert('文件大于25MB')
        }
      }
      let form=new FormData()
        for (let i = 0; i < file_id.files.length; i++) {
          form.append('file',file_id.files[i])
          this.status=true
      }
      
      setTimeout(()=>{
      fetch('/api',{
      method:'POST',
      body:form
    }).then((e)=>{
      if (e.ok) {
        return e.json()
      }else{
        throw e
      }
    }).then((re)=>{
      this.status=false
      this.list_s=true
      for (let i = 0; i < re.msg.length; i++) {
        this.file_info.push(re.msg[i])
      }
    })
  },600)      
    },
    assign(e){
      window.location.assign(e)
    },
    doCopy(e) {
        this.$copyText(e).then(()=>{
          mdui.alert('复制成功')
        },()=>{
          mdui.alert('失败')
        }
        )
      },
      date(e){
        const month=new Date(e).getMonth()+1
        return new Date(e).getFullYear()+'-'+month+'-'+new Date(e).getDate()+' '+new Date(e).getHours()+':'+new Date(e).getMinutes() 
      },
      qrcode(e){
        this.qr_val=e
        this.page_status='qrcode'
      },
      share_code(e){
        this.code=e
        this.page_status='code_out'
      },
      drop_upload(e){
      const data=e.dataTransfer.files
      this.list_s=true
      this.over_page=false
      for (let i = 0; i < data.length; i++) {
        if (data[i].size > 26214400) {
          return alert('文件大于25MB')
        }
      }
      let form=new FormData()
        for (let i = 0; i < data.length; i++) {
          form.append('file',data[i])
          this.status=true
      }
      
      setTimeout(()=>{
      fetch('/api',{
      method:'POST',
      body:form
    }).then((e)=>{
      if (e.ok) {
        return e.json()
      }else{
        throw e
      }
    }).then((re)=>{
      this.status=false
      this.list_s=true
      for (let i = 0; i < re.msg.length; i++) {
        this.file_info.push(re.msg[i])
      }
    })
  },600)

    },
  },
  components:{
    Loading,
    QrcodeVue
}
}
</script>
<template>
  <div id="drag" style="position: fixed; inset:0;">
  <Transition name="loading">
    <Loading :active="this.status" loader="bars" width="50" height="50" color="rgb(0,123,255)"></Loading>
    </Transition>
  <div style="position: fixed; bottom: 0; left: 0; right: 0; top: 0; z-index: 999;" v-show="over_page">  
      <div style="background-color: white; opacity: 0.5; inset: 0; position: absolute;" ></div>
    <div style="border: dashed 2px; top: 50%; text-align: center; z-index: 999; width: 50%; height: 30%;" class="center">
      <div style="text-align: center;padding-top: 10%;position: absolute;width: 100%;height: 100%;" class="drop_text">
        
    </div>
    </div>
</div>

    <div style="font-weight: 300; top:20%;" class="center" v-if="!list_s">
      最大可上传25MB大小文件,存放时间为24H<br>
      也可将文件拖拽上传
    </div>
    <TransitionGroup enter-active-class="animate__animated animate__zoomIn" leave-active-class="animate__animated animate__fadeOut">
      <!--qrcode-->
      <div v-if="this.page_status=='qrcode'" class="mdui-shadow-6 msg" >
        <li @click="(this.page_status=false)" class="iconfont icon-close" style="display: block;position: absolute;left: 100%;top: -15%;font-size: 25px;"></li>
        <QrcodeVue size="95" :value="this.qr_val"></QrcodeVue>
      </div>

      <!--output_code_page-->
      <div v-if="this.page_status=='code_out'" class="mdui-shadow-6 msg card">
        <li @click="(this.page_status=false)" class="iconfont icon-shanchu del" ></li>
        <div style="margin-top: 10px;
  font-size: x-large;
    font-weight: 900;">取件码</div>
        <div style="margin-top: 15%;
    font-size: x-large;
    font-weight: 900;
    letter-spacing: 5px;
    text-decoration: underline;
    margin-bottom: 15%;">{{code}}</div>
      </div>
      <!--reccode_input_page-->
      <div v-if="(this.page_status=='code_page')" class="mdui-shadow-6 msg card">
        <li @click="(this.page_status=false)" class="iconfont icon-shanchu del" ></li>
    
        <div style="margin-top: 10px;
    font-size: x-large;
    font-weight: 900;">请输入取件码</div>
        <div class="mdui-textfield mdui-textfield-floating-label" style="margin-top: 15%;
    margin-bottom: 15%;">
  <label class="mdui-textfield-label">5位数字码</label>
  <input maxlength="5" class="mdui-textfield-input" v-model="this.rec_code" style="letter-spacing: 5px; text-align: center; font-size: x-large;
    font-weight: 900;" type="text"/>
</div>
      </div> 

<!--rec_succ_page-->
      <div v-if="this.page_status=='code_succ_page'" class="mdui-shadow-6 msg card">
        <li @click="(this.page_status=false)" class="iconfont icon-close del" ></li>
        <div style="margin-top: 10px; font-size: large;overflow-wrap: break-word;font-weight: 900;">{{this.rec_msg.name}}</div>
    <span style="display: block; margin: 10px;">{{Math.floor(this.rec_msg.size/1024/1024*100)/100}} MB</span>
        <button @click="assign(this.rec_msg.url)" style="margin: 10px; border-radius: 10px;" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-indigo mdui-text-color-white" >
  <span>确认下载</span>
</button>
      </div>
      </TransitionGroup>


    <!--file list-->
    <Transition enter-active-class="animate__animated animate__zoomIn">
    <div class="mdui-table-fluid center" v-if="this.list_s" style="top: 50%; width: 89%;height: 70%;">
  <table class="mdui-table mdui-table-hoverable" style="table-layout: fixed;">
    <thead>
      <tr>
        <th v-for="i in this.file_list_head">{{i}}</th>
      </tr>
    </thead>
    <tbody>
      <TransitionGroup enter-active-class="animate__animated animate__fadeInRight">
      <tr v-for="(value,index) in this.file_info" :key="index">
        <td style="overflow-wrap: break-word;">
          {{value.name}}
        </td> 
        <td style="overflow-wrap: normal;">
          {{Math.floor(value.size/1024/1024*100)/100}} MB
        </td> 
        <td>
            <button class="mdui-btn mdui-btn-raised mdui-color-indigo" style="position:relative;right:15px" :mdui-menu="`{target: '#share_${index}'}`">分享</button>
            <ul class="mdui-menu" :id="'share_'+index">
                <li class="mdui-menu-item"  style="position:relative">
                    <a href="javascript:;" @click="qrcode(value.link)" class="mdui-ripple">
      <i class="iconfont icon-erweima icon"></i>二维码
    </a>
  </li>
  <li class="mdui-menu-item" style="position:relative">
                    <a href="javascript:;" @click="this.doCopy(value.link)" class="mdui-ripple">
      <i class="iconfont icon-link icon"></i>复制链接
    </a>
  </li>
  <li class="mdui-menu-item" style="position:relative">
                    <a href="javascript:;" @click="this.share_code(value.code)" class="mdui-ripple">
      <i class="iconfont icon-codev1 icon"></i>分享码
    </a>
  </li>
  </ul>
        </td>
      </tr>
   </TransitionGroup>
    </tbody>
    </table>
    </div>
  </Transition>
  <div style="display: flex;
  top: 88%;
    width: 100%;
    justify-content: space-around;" class="center">
<button style="border-radius: 10px; width: 10px;" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-indigo mdui-text-color-white" @change="file">
  <input type="file" ref="inp" multiple style="opacity: 0; position: relative; z-index: 9999;"/>
  <i style="position: absolute;left: 15px;">发送文件</i>
</button>
<button style="border-radius: 10px;" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-indigo mdui-text-color-white" @click="this.page_status='code_page'">
  <span>接收文件</span>
</button>
</div>
</div>
</template>
<style>
@import url('//at.alicdn.com/t/c/font_3741384_czlnf1hfqo6.css');
.drop_text:before{
  content: '+将文件拖到此处，即可上传';
}
.card{
  width: 40%;
  text-align: center;
  height: auto;
  border-radius: 15px;
}
.icon{
    margin-right: 10%;
    font-size: 23px;
  }

.over_page{
  width: 100%;
  height: 100%;
 
}
.msg{
  position: absolute;
    z-index: 99;
    padding: 5px;
    left: 50%;
    transform: translate(-50%,-50%);
    top:50%;
    background: white;
}
.del{
  display: inline-block;
    position: relative;
    left: 45%;
    font-size: 25px;
}
.loading-enter-active,
.loading-leave-active {
  transition: all 0.8s ease;
}
.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
.center{
  position: absolute;
  left: 50%;
    transform: translate(-50%,-50%);
}
</style>
