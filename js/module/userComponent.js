import store from '../store/store.js'
import properties from '../../properties.js'

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
        toLogin(){
            document.location.href=properties.websiteLoginUrl;

        },
    },
    template:`
    <div v-show=isInit style='display: flex;justify-content: center;'>
        <img v-show=isLogin  class='userInfoBtn' @click="null" :src=userPicturePath  >
        <button v-show=!isLogin class='loginBtn' @click="toLogin"  >登入</button>
    </div>
    `
    
    




    


}
export default{
    user
}