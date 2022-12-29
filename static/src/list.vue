<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import QrcodeVue from 'qrcode.vue'
import 'animate.css';
export default{
    data(){
        return{
        list:[],
        auth:true,
        pass:'',
        }
    },
    methods:{
      query(){
     this.start=false
        fetch(`/query?pass=${this.pass}`,{
            method:'GET'
        }).then((response)=>{
          if (response.ok) {
            return response.json()
          }
            throw response
        }).then((succ)=>{
            this.list=succ.keys.filter((e)=>{
              return e.metadata.date!=null
            })
            this.auth=false
            this.list.sort((a,b)=>{
              return b.metadata.date-a.metadata.date
            })
            
        }).catch(async (err)=>{
          const msg=await err.json()
          alert(msg.info)
        })
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
      iconOver(e){
        document.getElementById('list_'+e).style.display='block'
      },
      iconLeave(e){
        document.getElementById('list_'+e).style.display='none'
      }
     
  },
  components:{
    Loading,
    QrcodeVue
  }
}
</script>
<template>
  <Transition name="loading">
    <div class="mdui-textfield mdui-textfield-floating-label center" style="top:30%" v-if="auth">
  <label class="mdui-textfield-label">PASSWORD</label>
  <input class="mdui-textfield-input" v-model="pass" type="password" @keyup.enter="query"/>
  <button class="mdui-btn mdui-btn-raised mdui-color-indigo mdui-text-color-white" style="margin-top: 10px;" @click="query">生成</button>
</div>
    </Transition>
    <div class="mdui-container">
      <Transition enter-active-class="animate__animated animate__zoomIn">
    <div class="mdui-table-fluid center" v-if="!auth" style="top: 50%; width: 89%; height: 70%;" >
  <table class="mdui-table mdui-table-hoverable" style="table-layout: fixed;">
    <tbody>
      <tr v-for="(value,index) in list" :key="index">
        <td style="overflow-wrap: break-word;">
          {{value.metadata.name}}
        </td> 
        <td >
          {{date(value.metadata.date)}}
        </td> 
        <td>
          {{Math.floor(value.metadata.size/1024/1024*100)/100}} MB
        </td> 
        <td><i class="iconfont icon-erweima icon" @mouseover="iconOver(index)" @mouseleave="iconLeave(index)"><div :id="'list_'+index" style="display: none;" class="mdui-shadow-6 qrcode" ><QrcodeVue size="80" :value="value.metadata.link"></QrcodeVue></div></i><button class="mdui-btn mdui-btn-raised mdui-color-indigo" @click="this.doCopy(value.metadata.link)">copy</button></td>
      </tr>
    </tbody>
    </table>
    </div>
  </Transition>
    </div>
</template>
<style>
@import url('//at.alicdn.com/t/c/font_3741384_w6y11gqk0hm.css');
.icon{
  position: relative;
    font-size: 25px;
    right: 10px;
  }
  @media screen and (min-width:300px) and (max-width:450px) {
  .icon{
    position: relative;
    font-size: 25px;
    right: -26px;
  }
}
.qrcode{
  position: absolute;
    z-index: 99;
    padding: 5px;
    right: 13px;
    background: white;
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