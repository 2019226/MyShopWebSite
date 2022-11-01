import store from '../store/store.js'

let user={
    data(){
        return{
            
            
            class:'loginBtn',
            lineLoginImg:'./image/btn_login_base.png',
        }

    },
    computed:{
        isInit:()=>{
            return store.state.init;
        },
        isLogin:()=>{
            console.log(store.state.isLogin);
            return store.state.isLogin;
        },
        userName:()=>{
            console.log(store.state.userName);
            return store.state.userName;
        },
        userPicturePath:()=>{
            console.log(store.state.userPicture);
            return store.state.userPicture;
        },
    },
    methods: {
        toLineLogin(){
            var x = screen.width/2 - 500/2;
            var y = screen.height/2 - 600/2;
            var rand =Math.floor(Math.random()*100000);
            window.open('https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1657200173&redirect_uri=http://127.0.0.1:5500/lineLogin.html&state='+rand+'&scope=profile%20openid&nonce=09876xyz&initial_amr_display=lineqr',"","left="+x+",top="+y+",width=500,height=600")
        },
    },
    template:`
    <div v-show=isInit style='display: flex;justify-content: center;'>
        <img v-show=isLogin  class='userInfoBtn' @click="null" :src=userPicturePath  >
        <img v-show=!isLogin class='loginBtn'    @click="toLineLogin" :src=lineLoginImg  >
    </div>
    `
    
    
    
    /*
        `
        <img  :class=isLogin?'userInfoBtn':loginBtn @click="isLogin?null:toLineLogin()" :src=isLogin?userPicturePath:lineLoginImg  style="width:120px;">
        `
    */



    


}
export default{
    user
}