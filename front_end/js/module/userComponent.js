import store from '../store/store.js'
import properties from '../../properties.js'

let user={

    computed:{
        isLogin:()=>{

            return store.getters.userInfo.isLogin;
        },
        userName:()=>{

            return store.getters.userInfo.userName;
        },
        userPicturePath:()=>{

            return store.getters.userInfo.userPicture;
        },
    },
    methods: {
        toLogin(){
            document.location.href=properties.websiteLoginPage;

        },
        toLogout(){
            document.location.href=properties.websiteLogoutUrl;

        },
    },
    template:`
    <div style='display: flex;justify-content: center;align-items: center;'>
        <img v-show=isLogin  class='userInfoBtn' @click="null" :src=userPicturePath  >
        <button v-show=isLogin  @click="toLogout"  style='cursor: pointer; border: 0px; background-color: #8DC26F; margin: 5px;'>登出</button>
        <button v-show=!isLogin class='loginBtn' @click="toLogin"  >登入</button>
    </div>
    `
    
    




    


}
export default{
    user
}